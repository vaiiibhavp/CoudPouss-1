// components/Header.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Card,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  Divider,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ApplicationStatusModal from "./ApplicationStatusModal";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "@/constants/routes";
import BookServiceModal from "./BookServiceModal";
import SignOutModal from "./SignOutModal";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { setUserFromStorage, logout } from "@/lib/redux/authSlice";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import CreateServiceRequestModal from "./CreateServiceRequestModal";

// Helper function to get cookie value
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

interface HeaderProps {
  showExploreServices?: boolean;
  showBookServiceButton?: boolean;
  showAuthButtons?: boolean;
  showUserIcons?: boolean;
  showMyRequests?: boolean;
  homeRoute?: string;
}

interface Service {
  id: number;
  name: string;
  icon: string;
}

interface SearchService {
  category: string;
  service: string;
  id: string;
  category_logo_url?: string;
  category_name?: string;
  sub_category_name?: string;
  sub_category_id: string;
  category_id: string;
}

interface HomeApiResponse {
  data: {
    services: Service[];
    recent_requests?: {
      total_items: number;
      records: any[];
    };
  };
}

interface SearchApiResponse {
  data: {
    services: SearchService[];
  };
}

interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
  stripe_customer_id: string | null;
  user_type: string;
  profile_photo_id: string | null;
  profile_photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string;
  lang: string;
  is_deleted: boolean;
  is_docs_verified: boolean;
  created_at: string;
  updated_at: string;
  role?: string;
}

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserDetails;
  };
}

// Helper function to map service names to routes and icons
const getServiceRouteAndIcon = (
  serviceName: string,
): { route: string; icon: string } => {
  const nameLower = serviceName.toLowerCase().trim();

  // Map service names to routes and icons
  const serviceMap: Record<string, { route: string; icon: string }> = {
    "home assistance": {
      route: ROUTES.HOME_ASSISTANCE,
      icon: "/icons/home_assistance_icon_home.svg",
    },
    transport: { route: ROUTES.TRANSPORT, icon: "/icons/transport.svg" },
    "personal care": { route: ROUTES.PERSONAL_CARE, icon: "/icons/makeup.svg" },
    "tech support": { route: ROUTES.TECH_SUPPORT, icon: "/icons/laptop.svg" },
  };

  // Return mapped route/icon or default
  return (
    serviceMap[nameLower] || {
      route: `/services/${nameLower.replace(/\s+/g, "-").toLowerCase()}`,
      icon: "/icons/home_assistance_icon_home.svg",
    }
  );
};

export default function Header({
  showExploreServices = true,
  showBookServiceButton = true,
  showAuthButtons = true,
  showUserIcons = true,
  showMyRequests = true,
  homeRoute = ROUTES.AUTH_HOME,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // Check if we're on professional dashboard or its sub-routes (including professional profile)
  const isProfessionalDashboard = pathname?.startsWith("/professional");
  const [servicesMenuAnchor, setServicesMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [bookServiceModalOpen, setBookServiceModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [signoutSnackbarOpen, setSignoutSnackbarOpen] = useState(false);
  const [signoutSnackbarMessage, setSignoutSnackbarMessage] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isAccountUnderVerification, setIsAccountUnderVerification] =
    useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchService[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasRequests, setHasRequests] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const servicesMenuCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringServicesRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");

  console.log("searchResults", searchResults, selectedSubcategoryId);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  }, []);

  useEffect(() => {
    // Sync Redux state with localStorage on component mount
    dispatch(setUserFromStorage());
  }, [dispatch]);

  // Fetch user details when authenticated
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated) {
        setUserDetails(null);
        setIsAccountUnderVerification(false);
        return;
      }

      setUserDetailsLoading(true);
      try {
        const response = await apiGet<GetUserApiResponse>(
          API_ENDPOINTS.AUTH.GET_USER,
        );

        if (response.success && response.data) {
          const apiData = response.data;
          if (apiData.data?.user) {
            const user = apiData.data.user;
            setUserDetails(user);
            // Set verification status based on is_docs_verified
            // If is_docs_verified is false, account is under verification (show message)
            // If is_docs_verified is true, account is verified (hide message)
            setIsAccountUnderVerification(user.is_docs_verified === false);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsAccountUnderVerification(false);
      } finally {
        setUserDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [isAuthenticated]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (servicesMenuCloseTimeoutRef.current) {
        clearTimeout(servicesMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  // Fetch request data to determine if "My Requests" button should be shown
  useEffect(() => {
    const fetchRequestData = async () => {
      if (isProfessionalDashboard || !isAuthenticated) {
        setHasRequests(false);
        return;
      }

      try {
        const response = await apiGet<HomeApiResponse>(API_ENDPOINTS.HOME.HOME);
        if (response.success && response.data) {
          const apiData = response.data;
          // Check if there are recent requests
          if (apiData.data?.recent_requests) {
            const totalItems = apiData.data.recent_requests.total_items || 0;
            const records = apiData.data.recent_requests.records || [];
            setHasRequests(totalItems > 0 || records.length > 0);
          } else {
            setHasRequests(false);
          }
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
        setHasRequests(false);
      }
    };

    fetchRequestData();
  }, [isProfessionalDashboard, isAuthenticated]);

  useEffect(() => {
    // Fetch services from API on component mount and when page reloads
    const fetchServices = async () => {
      if (!showExploreServices || isProfessionalDashboard) return;

      // Don't call API if user is not authenticated
      if (!isAuthenticated) return;

      setServicesLoading(true);
      try {
        const response = await apiGet<HomeApiResponse>(API_ENDPOINTS.HOME.HOME);
        if (response.success && response.data) {
          // Handle the API response structure: response.data contains the full API response
          const apiData = response.data;
          if (apiData.data?.services && Array.isArray(apiData.data.services)) {
            setServices(apiData.data.services);
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // On error, set empty array to prevent UI issues
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [showExploreServices, isProfessionalDashboard, isAuthenticated]);

  // Debounced search for services
  useEffect(() => {
    const handler = setTimeout(async () => {
      const term = searchTerm.trim();
      if (!term) {
        setSearchResults([]);
        return;
      }

      // Don't call API if user is not authenticated
      if (!isAuthenticated) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const url = `${API_ENDPOINTS.HOME.HOME}?search=${encodeURIComponent(
          term,
        )}`;
        const response = await apiGet<SearchApiResponse>(url);
        if (response.success && response.data?.data?.services) {
          setSearchResults(response.data.data.services);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching services:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, isAuthenticated]);

  const handleLogoutClick = () => {
    setSignOutModalOpen(true);
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    // perform logout and show a success toast before redirecting
    dispatch(logout());
    setSignoutSnackbarMessage("Sign out successful");
    setSignoutSnackbarOpen(true);
    // close modal if open
    setSignOutModalOpen(false);
    // wait a short moment so user sees the toast, then redirect
    setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 800);
  };
  const redirectToLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Clear any pending close timeout
    if (!isAuthenticated) return;
    if (servicesMenuCloseTimeoutRef.current) {
      clearTimeout(servicesMenuCloseTimeoutRef.current);
      servicesMenuCloseTimeoutRef.current = null;
    }
    isHoveringServicesRef.current = true;
    setServicesMenuAnchor(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    // Clear any pending close timeout
    if (servicesMenuCloseTimeoutRef.current) {
      clearTimeout(servicesMenuCloseTimeoutRef.current);
      servicesMenuCloseTimeoutRef.current = null;
    }
    isHoveringServicesRef.current = false;
    setServicesMenuAnchor(null);
  };

  const handleServicesButtonMouseLeave = () => {
    // Mark that we're leaving the button
    isHoveringServicesRef.current = false;
    // Delay closing to allow mouse to move to menu
    servicesMenuCloseTimeoutRef.current = setTimeout(() => {
      // Only close if still not hovering (mouse didn't enter menu)
      if (!isHoveringServicesRef.current) {
        handleServicesMenuClose();
      }
    }, 250); // 250ms delay to allow smooth transition
  };

  const handleServicesMenuMouseEnter = () => {
    // Mark that we're hovering over menu
    isHoveringServicesRef.current = true;
    // Clear close timeout when mouse enters menu
    if (servicesMenuCloseTimeoutRef.current) {
      clearTimeout(servicesMenuCloseTimeoutRef.current);
      servicesMenuCloseTimeoutRef.current = null;
    }
  };

  const handleServicesMenuMouseLeave = () => {
    // Mark that we're leaving the menu
    isHoveringServicesRef.current = false;
    // Delay closing
    servicesMenuCloseTimeoutRef.current = setTimeout(() => {
      if (!isHoveringServicesRef.current) {
        handleServicesMenuClose();
      }
    }, 250);
  };

  const handleNotificationsMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
  };
  // Determine home route - use prop if provided, otherwise based on authentication and role
  const userRole =
    user?.role || getCookie("userRole") || localStorage.getItem("role");
  const finalHomeRoute =
    homeRoute ||
    (isAuthenticated && userRole === "service_provider"
      ? ROUTES.PROFESSIONAL_HOME
      : isAuthenticated && userRole === "elderly_user"
        ? ROUTES.AUTH_HOME
        : ROUTES.HOME);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          zoom: 0.9,
          borderBottom: "0.0625rem solid #DFE8ED",
        }}
      >
        <Box
          sx={{
            width: "100%",
            py: "28px",
            px: { xs: "16px", md: "80px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "40px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              <Box
                component={Link}
                href={finalHomeRoute}
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  bgcolor: "white",
                  border: "0.125rem solid",
                  borderColor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/icons/main-logo.png"
                  alt="CoudPouss Logo"
                  width={48}
                  height={48}
                />
              </Box>
              <Typography
                variant="h6"
                component={Link}
                href={finalHomeRoute}
                sx={{
                  color: "primary.normal",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  display: { xs: "none", sm: "block" },
                  textDecoration: "none",
                }}
              >
                CoudPouss
              </Typography>
            </Box>

            {isProfessionalDashboard && isAuthenticated && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <>
                  <Button
                    component={Link}
                    href={ROUTES.PROFESSIONAL_HOME}
                    sx={{
                      color:
                        pathname === ROUTES.PROFESSIONAL_HOME
                          ? "primary.main"
                          : "text.secondary",
                      textTransform: "none",
                      display: { xs: "none", lg: "block" },
                      // borderBottom:
                      //   pathname === ROUTES.PROFESSIONAL_HOME
                      //     ? "0.125rem solid"
                      //     : "none",
                      borderColor: "primary.main",
                      borderRadius: 0,
                      // pb: pathname === ROUTES.PROFESSIONAL_DASHBOARD ? 1 : 0,
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    component={Link}
                    href={ROUTES.PROFESSIONAL_EXPLORE_REQUESTS}
                    sx={{
                      color:
                        pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS
                          ? "primary.main"
                          : "text.secondary",
                      textTransform: "none",
                      display: { xs: "none", lg: "block" },
                      fontWeight: "400",
                      borderColor: "primary.main",
                      borderRadius: 0,

                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    Explore Requests
                  </Button>
                  <Button
                    component={Link}
                    href={ROUTES.PROFESSIONAL_TASK_MANAGEMENT}
                    sx={{
                      color:
                        pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT
                          ? "primary.main"
                          : "text.secondary",
                      textTransform: "none",
                      display: { xs: "none", lg: "block" },

                      borderColor: "primary.main",
                      borderRadius: 0,

                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    Task Management
                  </Button>
                </>
              </Box>
            )}
            {/* Search Bar */}
            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                maxWidth: { xs: "100%", md: "25rem" },
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  minWidth: "381px",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "0.0625rem solid",
                  borderColor: "grey.300",
                  overflow: "hidden",
                  paddingRight: "1rem",
                }}
              >
                <InputBase
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1,
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                      fontSize: "0.95rem",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "text.secondary",
                      opacity: 1,
                    },
                  }}
                />
                <IconButton
                  sx={{
                    bgcolor: "primary.normal",
                    borderRadius: "50%",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <Image
                    src={"/icons/searhIcon.png"}
                    alt="Search Icon"
                    width={16}
                    height={16}
                  />
                </IconButton>
              </Box>
              {(searchLoading ||
                searchResults.length > 0 ||
                searchTerm.trim()) && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    width: "100%",
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    zIndex: 1300,
                    maxHeight: 320,
                    overflowY: "auto",
                    p: 1,
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {searchLoading && (
                    <Typography
                      sx={{ color: "text.secondary", px: 1, py: 0.5 }}
                    >
                      Searching...
                    </Typography>
                  )}
                  {!searchLoading &&
                    searchResults.length === 0 &&
                    searchTerm.trim() && (
                      <Typography
                        sx={{ color: "text.secondary", px: 1, py: 0.5 }}
                      >
                        No results found
                      </Typography>
                    )}
                  {!searchLoading &&
                    searchResults.map((item) => (
                      <Box
                        key={item.id}
                        // onClick={() => {
                        //   setSelectedCategoryId(item.category_id);
                        //   setSelectedSubcategoryId(item.sub_category_id);
                        //   setIsModalOpen(true);
                        // }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1,
                          py: 0.75,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "grey.100" },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            overflow: "hidden",
                            flexShrink: 0,
                            bgcolor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            src={
                              item.category_logo_url ||
                              "/icons/home_assistance_icon_home.svg"
                            }
                            alt={item.category_name || "Service"}
                            width={32}
                            height={32}
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#214C65",
                              lineHeight: 1.2,
                            }}
                          >
                            {item.sub_category_name}
                          </Typography>
                          <Typography
                            sx={{ color: "#6D6D6D", fontSize: "0.85rem" }}
                          >
                            {item.category_name}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>
              )}

              {!isProfessionalDashboard && (
                <>
                  <Box
                    onMouseEnter={handleServicesMenuOpen}
                    onMouseLeave={handleServicesButtonMouseLeave}
                    sx={{ display: "inline-block" }}
                  >
                    <Button
                      // endIcon={<ExpandMoreIcon />}
                      onClick={() => {
                        if (!isAuthenticated) redirectToLogin();
                      }}
                      sx={{
                        color: "text.secondary",
                        textTransform: "none",
                        padding: 0,
                        paddingLeft: "2.5rem",
                        textWrap: "nowrap",

                        display: {
                          xs: "none",
                          lg: "flex",
                          fontSize: "1rem",
                          lineHeight: "1.125rem",
                        },
                        "&:hover": {
                          bgcolor: "transparent",
                          color: "primary.main",
                        },
                      }}
                    >
                      Explore Services
                    </Button>
                    <Menu
                      anchorEl={servicesMenuAnchor}
                      open={Boolean(servicesMenuAnchor)}
                      onClose={handleServicesMenuClose}
                      MenuListProps={{
                        onMouseLeave: handleServicesMenuMouseLeave,
                        onMouseEnter: handleServicesMenuMouseEnter,
                      }}
                      PaperProps={{
                        onMouseEnter: handleServicesMenuMouseEnter,
                        onMouseLeave: handleServicesMenuMouseLeave,
                        sx: {
                          mt: 1.5,
                          minWidth: 400,
                          maxWidth: 500,
                          borderRadius: 2,
                          boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.15)",
                          px: "2rem",
                          py: "1.25rem",
                          pointerEvents: "auto",
                        },
                      }}
                      transformOrigin={{ horizontal: "left", vertical: "top" }}
                      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                      disableAutoFocusItem
                      disableEnforceFocus
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#555555",
                            lineHeight: "1.125rem",
                            mb: 2,
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          Explore Services
                        </Typography>
                        {servicesLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              py: 4,
                            }}
                          >
                            <Typography sx={{ color: "text.secondary" }}>
                              Loading services...
                            </Typography>
                          </Box>
                        ) : services.length > 0 ? (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              gap: 2,
                            }}
                          >
                            {/* {services.map((service) => {
                          const { route, icon } = getServiceRouteAndIcon(
                            service.name
                          );
                          return (
                            <Box
                              key={service.id}
                              component={Link}
                              href={route}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                cursor: "pointer",
                                border: "0.0625rem solid",
                                borderColor: "grey.200",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                                bgcolor: "#F7F7F7",
                                "&:hover": {
                                  borderColor: "primary.main",
                                  bgcolor: "#f0f7fa",
                                },
                              }}
                              onClick={handleServicesMenuClose}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 2,
                                  }}
                                >
                                  {service.services_type_photos_url ? (
                                    <Image
                                      src={service.services_type_photos_url}
                                      alt={service.name}
                                      width={60}
                                      height={60}
                                      style={{ objectFit: "contain" }}
                                    />
                                  ) : (
                                    <Image
                                      src={icon}
                                      alt={service.name}
                                      width={60}
                                      height={60}
                                      style={{ objectFit: "contain" }}
                                    />
                                  )}
                                </Box>
                                <Typography
                                  variant="body1"
                                  fontWeight="600"
                                  sx={{
                                    textAlign: "center",
                                    color: "#787878",
                                    lineHeight: "1.125rem",
                                  }}
                                >
                                  {service.name}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })} */}

                            <Box sx={{ cursor: "pointer" }}>
                              <Image
                                src="/image/HomeServiceBox.png"
                                alt="services"
                                width={183}
                                height={158}
                              />
                            </Box>
                            <Box sx={{ cursor: "pointer" }}>
                              <Image
                                src="/image/TransportSercviceBox.png"
                                alt="services"
                                width={183}
                                height={158}
                              />
                            </Box>
                            <Box sx={{ cursor: "pointer" }}>
                              <Image
                                src="/image/personalServiceBox.png"
                                alt="services"
                                width={183}
                                height={158}
                              />
                            </Box>
                            <Box sx={{ cursor: "pointer" }}>
                              <Image
                                src="/image/techSupportBox.png"
                                alt="services"
                                width={183}
                                height={158}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              py: 4,
                            }}
                          >
                            <Typography sx={{ color: "text.secondary" }}>
                              No services available
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Menu>
                  </Box>

                  {isAuthenticated && (
                    <Box
                      sx={{
                        py: "14px",
                        bgColor: "red",
                        marginLeft: "40px",
                        borderBottom:
                          pathname === ROUTES.MY_REQUESTS
                            ? "0.125rem solid #2C6587 "
                            : "none",
                      }}
                    >
                      <Button
                        component={Link}
                        href={ROUTES.MY_REQUESTS}
                        sx={{
                          p: 0,

                          textWrap: "nowrap",
                          fontSize: "1rem",
                          lineHeight: "20px",
                          color:
                            pathname === ROUTES.MY_REQUESTS
                              ? "#2C6587"
                              : "#555555",
                          textTransform: "none",
                          display: { xs: "none", lg: "block" },

                          borderColor: "primary.main",
                          borderRadius: 0,
                          "&:hover": {
                            bgcolor: "transparent",
                          },
                        }}
                      >
                        My Requests
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                marginLeft: "auto",
              }}
            >
              {/* Explore Services Dropdown - Only for non-professional routes */}

              {/* My Requests Link - Only show when authenticated, not on professional dashboard, and has requests */}
              {/* {!isProfessionalDashboard &&
                showMyRequests &&
                isAuthenticated &&
                hasRequests && <></>} */}

              {/* Book a Service Button - Only show when authenticated and not on professional dashboard */}
              {!isProfessionalDashboard && showBookServiceButton && (
                <Button
                  variant="contained"
                  onClick={() =>
                    isAuthenticated
                      ? setBookServiceModalOpen(true)
                      : router.push(ROUTES.LOGIN)
                  }
                  sx={{
                    bgcolor: "primary.normal",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: { xs: "none", sm: "flex" },
                    gap: 0.5,
                  }}
                  endIcon={<ArrowOutwardIcon sx={{ fontSize: "1rem" }} />}
                >
                  Book a Service
                </Button>
              )}

              {/* Get Started Button - Only show when NOT authenticated */}
              {showAuthButtons && !isAuthenticated && (
                <Button
                  component={Link}
                  href={ROUTES.LOGIN}
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    px: 2,
                    fontSize: "1rem",
                    fontWeight: 400,
                    border: "1px solid #2C6587",
                    backgroundColor: "white",
                    color: "#2C6587",
                    fontFamily: "lato",
                    py: 1,
                    borderRadius: "12px",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Get Started
                </Button>
              )}

              {/* Logout Button - Only show when authenticated */}
              {/* {showAuthButtons && isAuthenticated && (
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    startIcon={<ExitToAppIcon />}
                    sx={{
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      borderColor: "grey.300",
                      color: "primary.main",
                      display: { xs: "none", sm: "flex" },
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "primary.50",
                      },
                    }}
                  >
                    Logout
                  </Button>
                )} */}

              {/* User Icons - Only show when authenticated */}
              {showUserIcons && isAuthenticated && user && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={handleNotificationsMenuOpen}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "grey.100",
                      },
                    }}
                  >
                    {/* <NotificationsIcon /> */}
                    <Image
                      width={20}
                      height={20}
                      alt="notification"
                      src={"/icons/bellIcon.png"}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={notificationsMenuAnchor}
                    open={Boolean(notificationsMenuAnchor)}
                    onClose={handleNotificationsMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 400,
                        maxWidth: 500,
                        borderRadius: 2,
                        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.15)",
                        maxHeight: 600,
                        overflowY: "auto",
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "primary.normal",
                          fontWeight: 500,
                          mb: 2,
                          lineHeight: "1.25rem",
                          fontSize: "1.25rem",
                        }}
                      >
                        Notifications
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* Notification 1 */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            pb: 2,
                            borderBottom: "0.0625rem solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Box>
                            <Image
                              width={36}
                              height={36}
                              alt="msg"
                              src={"/icons/doubleMsg.png"}
                            />
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                mb: 0.5,
                                color: "#424242",
                                lineHeight: "1.125rem",
                              }}
                            >
                              Your service has started.
                            </Typography>
                            <Typography
                              sx={{
                                color: "#595959",
                                mb: 1.5,
                                lineHeight: "140%",
                                fontSize: "0.875rem",
                              }}
                            >
                              The provider has proposed a revised budget of €620
                              for your service.
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                Friday 2:22 PM
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                3 hours ago
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  bgcolor: "primary.normal",
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  borderColor: "grey.300",
                                  color: "text.primary",
                                }}
                              >
                                Decline
                              </Button>
                            </Box>
                          </Box>
                        </Box>

                        {/* Notification 2 */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            pb: 2,
                            borderBottom: "0.0625rem solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1,
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <Box>
                              <Image
                                width={36}
                                height={36}
                                alt="msg"
                                src={"/icons/doubleMsg.png"}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ mb: 0.5 }}
                            >
                              New Budget Request
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mb: 1.5 }}
                            >
                              The provider has proposed a revised budget of €620
                              for your service.
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                Friday 2:22 PM
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                3 hours ago
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  bgcolor: "primary.normal",
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  borderColor: "grey.300",
                                  color: "text.primary",
                                }}
                              >
                                Decline
                              </Button>
                            </Box>
                          </Box>
                        </Box>

                        {/* Notification 3 */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            pb: 2,
                            borderBottom: "0.0625rem solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src="/icons/testimonilas-1.png"
                              alt="Bessie Cooper"
                              width={48}
                              height={48}
                              style={{ objectFit: "cover" }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ mb: 1.5 }}
                            >
                              Expert Bessie Cooper has arrived at your location
                              and is requesting your approval to manually
                              initiate the service.
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                Friday 2:22 PM
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                3 hours ago
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  bgcolor: "primary.normal",
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "0.85rem",
                                  px: 2,
                                  py: 0.5,
                                  borderColor: "grey.300",
                                  color: "text.primary",
                                }}
                              >
                                Decline
                              </Button>
                            </Box>
                          </Box>
                        </Box>

                        {/* Notification 4 */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src="/icons/testimonilas-1.png"
                              alt="Bessie Cooper"
                              width={48}
                              height={48}
                              style={{ objectFit: "cover" }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ mb: 1.5 }}
                            >
                              Expert Bessie Cooper is out for service.
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                Friday 2:22 PM
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                3 hours ago
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{
                                textTransform: "none",
                                fontSize: "0.85rem",
                                py: 0.5,
                                bgcolor: "primary.normal",
                              }}
                            >
                              Check Task Status
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Menu>
                  <IconButton
                    component={Link}
                    href={
                      isProfessionalDashboard
                        ? ROUTES.PROFESSIONAL_CHAT
                        : ROUTES.CHAT
                    }
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "grey.100",
                      },
                    }}
                  >
                    {/* <MessageIcon /> */}
                    <Image
                      width={24}
                      height={24}
                      alt="chaticon"
                      // unoptimized\
                      src={"/icons/headerChat.png"}
                    />
                  </IconButton>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      onClick={handleProfileMenuOpen}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                        textDecoration: "none",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {userDetails?.profile_photo_url ? (
                        <Image
                          src={userDetails.profile_photo_url}
                          alt={`${userDetails.first_name} ${userDetails.last_name}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : userDetails ? (
                        `${userDetails.first_name?.[0] || ""}${
                          userDetails.last_name?.[0] || ""
                        }`.toUpperCase() || user?.initial
                      ) : (
                        user?.initial
                      )}
                    </Box>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{
                        color: "text.secondary",
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </Box>

                  {/* Profile Dropdown Menu */}
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        borderRadius: "1rem",
                        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.15)",
                        p: "1.25rem",
                        "& .MuiMenu-list": {
                          padding: 0,
                          margin: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box>
                      {/* User Name */}
                      <Typography
                        sx={{
                          color: "primary.normal",
                          fontSize: "1.125rem",
                          lineHeight: "1.25rem",
                          fontWeight: 600,
                          mb: "0.25rem",
                        }}
                      >
                        {userDetails
                          ? `${userDetails.first_name || ""} ${
                              userDetails.last_name || ""
                            }`.trim() || "User"
                          : "User"}
                      </Typography>
                      <Button
                        component={Link}
                        href={
                          isProfessionalDashboard
                            ? ROUTES.PROFESSIONAL_PROFILE
                            : ROUTES.PROFILE
                        }
                        onClick={handleProfileMenuClose}
                        sx={{
                          textTransform: "none",
                          color: "#989898",
                          fontSize: "0.9rem",
                          p: 0,
                          mb: "0.9rem",
                          justifyContent: "flex-start",
                          "&:hover": {
                            bgcolor: "transparent",
                            color: "#2F6B8E",
                          },
                        }}
                      >
                        View my profile
                      </Button>

                      {
                        // isAccountUnderVerification &&
                        (userDetails?.role === "service_provider" ||
                          userRole === "service_provider") && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.75rem",
                              borderRadius: "0.75rem",
                              border: "0.5px solid #2C6587",
                              mb: "0.875rem",
                            }}
                          >
                            <Image
                              src={"/icons/headerWarning.png"}
                              alt="warning"
                              width={42}
                              height={42}
                            />
                            <Typography
                              sx={{
                                color: "#214C65",
                                fontWeight: 700,
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                letterSpacing: 0,
                                textAlign: "center",
                              }}
                            >
                              Account under verification
                            </Typography>

                            <Button
                              onClick={() => {
                                setStatusModalOpen(true);
                                handleProfileMenuClose();
                              }}
                              sx={{
                                background: "#214C65",
                                color: "white",
                                borderRadius: "12px",
                                fontWeight: 600,
                                padding: "10px 60px",
                                fontSize: "14px",
                                lineHeight: "16px",
                              }}
                            >
                              Check Status
                            </Button>
                          </Box>
                        )
                      }
                      <Divider color={"#E7E7E7"} />

                      {/* Menu Items */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          margin: 0,
                          marginTop: "0.9rem",
                        }}
                      >
                        {userDetails?.role === "service_provider" ||
                        userRole === "service_provider" ? (
                          <>
                            <Button
                              component={Link}
                              href={ROUTES.PROFESSIONAL_PROFILE}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              My Earnings
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.PROFESSIONAL_PROFILE}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              Manage Services
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.PROFESSIONAL_PROFILE}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              Manage Subscription
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.PROFESSIONAL_PROFILE}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              Ratings & Reviews
                            </Button>
                            <Divider color={"#E7E7E7"} />
                            <Button
                              onClick={handleLogoutClick}
                              sx={{
                                textTransform: "none",
                                p: 0,
                                mb: "0.9rem",
                                justifyContent: "flex-start",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                                color: "primary.normal",
                                lineHeight: "1.125rem",
                                cursor: "pointer",
                              }}
                            >
                              Sign Out
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              component={Link}
                              href={ROUTES.MY_REQUESTS}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              My Requests
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.Favorite}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              My Favorite Professionals
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.PROFILE}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              My Transactions
                            </Button>
                            <Button
                              component={Link}
                              href={ROUTES.HELP_CENTER}
                              onClick={handleProfileMenuClose}
                              sx={{
                                textTransform: "none",
                                color: "#989898",
                                fontSize: "1rem",
                                lineHeight: "1.125rem",
                                p: 0,
                                justifyContent: "flex-start",
                                minWidth: "auto",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                              }}
                            >
                              Help Center
                            </Button>
                            <Divider color={"#E7E7E7"} />
                            <Button
                              onClick={handleLogoutClick}
                              sx={{
                                textTransform: "none",
                                p: 0,
                                mb: "0.9rem",
                                justifyContent: "flex-start",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#2F6B8E",
                                },
                                color: "primary.normal",
                                lineHeight: "1.125rem",
                                cursor: "pointer",
                              }}
                            >
                              Sign Out
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Menu>
                </Box>
              )}

              {/* Mobile Menu */}
              <IconButton
                onClick={(e) => handleProfileMenuOpen(e)}
                sx={{
                  display: { md: "none" },
                  color: "text.primary",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Mobile Search Bar */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              mt: 2,
              width: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                minWidth: { xs: "100%", sm: "381px" },
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "0.0625rem solid",
                borderColor: "grey.300",
                overflow: "hidden",
                paddingRight: "1rem",
              }}
            >
              <InputBase
                placeholder="What are you looking for?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1,
                  "& .MuiInputBase-input": {
                    color: "text.primary",
                    fontSize: "0.95rem",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.secondary",
                    opacity: 1,
                  },
                }}
              />
              <IconButton
                sx={{
                  bgcolor: "primary.normal",
                  borderRadius: "50%",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <Image
                  src={"/icons/searhIcon.png"}
                  alt="Search Icon"
                  width={16}
                  height={16}
                />
              </IconButton>
            </Box>
            {(searchLoading ||
              searchResults.length > 0 ||
              searchTerm.trim()) && (
              <Box
                sx={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  width: "100%",
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 1300,
                  maxHeight: 320,
                  overflowY: "auto",
                  p: 1,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {searchLoading && (
                  <Typography sx={{ color: "text.secondary", px: 1, py: 0.5 }}>
                    Searching...
                  </Typography>
                )}
                {!searchLoading &&
                  searchResults.length === 0 &&
                  searchTerm.trim() && (
                    <Typography
                      sx={{ color: "text.secondary", px: 1, py: 0.5 }}
                    >
                      No results found
                    </Typography>
                  )}
                {!searchLoading &&
                  searchResults.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1,
                        py: 0.75,
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={
                            item.category_logo_url ||
                            "/icons/home_assistance_icon_home.svg"
                          }
                          alt={item.category_name || "Service"}
                          width={32}
                          height={32}
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#214C65",
                            lineHeight: 1.2,
                          }}
                        >
                          {item.sub_category_name}
                        </Typography>
                        <Typography
                          sx={{ color: "#6D6D6D", fontSize: "0.85rem" }}
                        >
                          {item.category_name}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>
      <CreateServiceRequestModal
        open={isModalOpen}
        onClose={handleCloseModal}
        preSelectedCategoryId={selectedCategoryId}
        preSelectedSubcategoryId={selectedSubcategoryId}
      />
      <BookServiceModal
        open={bookServiceModalOpen}
        onClose={() => setBookServiceModalOpen(false)}
      />
      <SignOutModal
        open={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleLogout}
      />
      <ApplicationStatusModal
        open={statusModalOpen}
        onClose={handleStatusModalClose}
        status="rejected"
      />
      <Snackbar
        open={signoutSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSignoutSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSignoutSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {signoutSnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
