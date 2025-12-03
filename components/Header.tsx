// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "@/constants/routes";
import BookServiceModal from "./BookServiceModal";
import { logout, setUserFromStorage } from "@/lib/redux/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";

interface HeaderProps {
  showExploreServices?: boolean;
  showBookServiceButton?: boolean;
  showAuthButtons?: boolean;
  showUserIcons?: boolean;
  showMyRequests?: boolean;
  homeRoute?: string;
}

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
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check if we're on professional dashboard or its sub-routes (including professional profile)
  const isProfessionalDashboard = pathname?.startsWith('/professional');
  const [servicesMenuAnchor, setServicesMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [bookServiceModalOpen, setBookServiceModalOpen] = useState(false);

  useEffect(() => {
    // Sync Redux state with localStorage on component mount
    dispatch(setUserFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.HOME);
  };

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setServicesMenuAnchor(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setServicesMenuAnchor(null);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

  // Determine home route - use prop if provided, otherwise based on authentication
  const finalHomeRoute = homeRoute || (isAuthenticated ? ROUTES.AUTH_HOME : ROUTES.HOME);

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white",
        borderBottom:"1px solid #DFE8ED"

       }}>
        <Toolbar sx={{ py: 2 }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 2,
              }}
            >
              {/* Logo and Brand Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                <Box
                  component={Link}
                  href={finalHomeRoute}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "white",
                    border: "2px solid",
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
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component={Link}
                  href={finalHomeRoute}
                  sx={{
                    color: "primary.normal",
                    fontWeight: "bold",
                    fontSize: "20px",
                    lineHeight: "24px",
                    display: { xs: "none", sm: "block" },
                    textDecoration: "none",
                  }}
                >
                  CoudPouss
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {isProfessionalDashboard && isAuthenticated && (
                  <>
                    <Button
                      component={Link}
                      href={ROUTES.PROFESSIONAL_DASHBOARD}
                      sx={{
                        color: pathname === ROUTES.PROFESSIONAL_DASHBOARD ? "primary.main" : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom: pathname === ROUTES.PROFESSIONAL_DASHBOARD ? "2px solid" : "none",
                        borderColor: "primary.main",
                        borderRadius: 0,
                        pb: pathname === ROUTES.PROFESSIONAL_DASHBOARD ? 1 : 0,
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
                        color: pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS ? "primary.main" : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        fontWeight: "400",
                        borderBottom: pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS ? "2px solid" : "none",
                        borderColor: "primary.main",
                        borderRadius: 0,
                        pb: pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS ? 1 : 0,
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
                        color: pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT ? "primary.main" : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom: pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT ? "2px solid" : "none",
                        borderColor: "primary.main",
                        borderRadius: 0,
                        pb: pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT ? 1 : 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          color: "primary.main",
                        },
                      }}
                    >
                      Task Management
                    </Button>
                  </>
                )}
              </Box>

              {/* Search Bar */}
              <Box
                sx={{
                  flexGrow: 1,
                  maxWidth: { xs: "100%", md: "400px" },
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  mx: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    overflow: "hidden",
                    paddingRight: "1rem"
                  }}
                >
                  <InputBase
                    placeholder="What are you looking for?"
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
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Explore Services Dropdown - Only for non-professional routes */}
                {!isProfessionalDashboard && showExploreServices && isAuthenticated && (
                  <Button
                    onClick={handleServicesMenuOpen}
                    endIcon={<ExpandMoreIcon />}
                    sx={{
                      color: "text.secondary",
                      textTransform: "none",
                      display: { xs: "none", lg: "flex", fontSize: "1rem", lineHeight: "140%" },
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    Explore Services
                  </Button>
                )}
                <Menu
                  anchorEl={servicesMenuAnchor}
                  open={Boolean(servicesMenuAnchor)}
                  onClose={handleServicesMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 500,
                      maxWidth: 600,
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      px: "2rem",
                      py: "1.25rem"
                    },
                  }}
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "primary.normal",
                        fontWeight: 600,
                        lineHeight: "1.125rem",
                        mb: 2,
                        fontSize: "1rem",
                      }}
                    >
                      Explore Services
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                      }}
                    >
                      {/* Home Assistance */}
                      <Box
                        component={Link}
                        href={ROUTES.HOME_ASSISTANCE}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          bgcolor: "#F7F7F7"

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
                            <Image
                              src="/icons/home-assistance.png"
                              alt="Home Assistance"
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{ textAlign: "center", color: "#787878", lineHeight: "1.125rem" }}
                          >
                            Home Assistance
                          </Typography>
                        </Box>
                      </Box>

                      {/* Transport */}
                      <Box
                        component={Link}
                        href={ROUTES.TRANSPORT}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",

                          transition: "all 0.2s ease",
                          bgcolor: "#F7F7F7"
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
                            <Image
                              src="/icons/transport.png"
                              alt="Transport"
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{ textAlign: "center", color: "#787878", lineHeight: "1.125rem" }}
                          >
                            Transport
                          </Typography>
                        </Box>
                      </Box>

                      {/* Personal Care */}
                      <Box
                        component={Link}
                        href={ROUTES.PERSONAL_CARE}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",

                          transition: "all 0.2s ease",
                          bgcolor: "#F7F7F7"
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
                            <Image
                              src="/icons/personal-care.png"
                              alt="Personal Care"
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{ textAlign: "center", color: "#787878", lineHeight: "1.125rem" }}
                          >
                            Personal Care
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tech Support */}
                      <Box
                        component={Link}
                        href={ROUTES.TECH_SUPPORT}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          bgcolor: "#F7F7F7"
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
                            <Image
                              src="/icons/support.png"
                              alt="Tech Support"
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{ textAlign: "center", color: "#787878", lineHeight: "1.125rem" }}
                          >
                            Tech Support
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Menu>

                {/* My Requests Link - Only show when authenticated and not on professional dashboard */}
                {!isProfessionalDashboard && showMyRequests && isAuthenticated && (
                  <Button
                    component={Link}
                    href={ROUTES.MY_REQUESTS}
                    sx={{
                      color: pathname === ROUTES.MY_REQUESTS ? "primary.main" : "text.secondary",
                      textTransform: "none",
                      display: { xs: "none", lg: "block" },
                      borderBottom: pathname === ROUTES.MY_REQUESTS ? "2px solid" : "none",
                      borderColor: "primary.main",
                      borderRadius: 0,
                      pb: 1,
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    My Requests
                  </Button>
                )}

                {/* Book a Service Button - Only show when authenticated and not on professional dashboard */}
                {!isProfessionalDashboard && showBookServiceButton && isAuthenticated && (
                  <Button
                    variant="contained"
                    onClick={() => setBookServiceModalOpen(true)}
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
                      py: 1,
                      borderRadius: 2,
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    Get Started
                  </Button>
                )}

                {/* Logout Button - Only show when authenticated */}
                {showAuthButtons && isAuthenticated && (
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
                )}

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
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
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
                            color: "#2F6B8E",
                            fontWeight: "bold",
                            mb: 2,
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
                              borderBottom: "1px solid",
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
                              <Box
                                sx={{
                                  position: "absolute",
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  bgcolor: "#8B4513",
                                  zIndex: 1,
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  left: 4,
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  bgcolor: "#10B981",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  zIndex: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "white",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body1"
                                fontWeight="600"
                                sx={{ mb: 0.5 }}
                              >
                                Your service has started.
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", mb: 1.5 }}
                              >
                                The provider has proposed a revised budget of
                                €620 for your service.
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
                              borderBottom: "1px solid",
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
                              <Box
                                sx={{
                                  position: "absolute",
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  bgcolor: "#8B4513",
                                  zIndex: 1,
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  left: 4,
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  bgcolor: "#10B981",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  zIndex: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "white",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓
                                </Typography>
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
                                The provider has proposed a revised budget of
                                €620 for your service.
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
                              borderBottom: "1px solid",
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
                                Expert Bessie Cooper has arrived at your
                                location and is requesting your approval to
                                manually initiate the service.
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
                      href={ROUTES.CHAT}
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
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
                        }}
                      >
                        {user.initial}
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
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          p: "1.25rem",
                          "& .MuiMenu-list": {
                            padding: 0,
                            margin: 0
                          },

                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Box>
                        {/* User Name */}
                        <Typography

                          sx={{ color: "primary.normal", fontSize: "1.125rem", lineHeight: "1.25rem", fontWeight: 500, mb: "0.25rem" }}
                        >
                          Cameron Williamson
                        </Typography>
                        <Button
                          component={Link}
                          href={isProfessionalDashboard ? ROUTES.PROFESSIONAL_PROFILE : ROUTES.PROFILE}
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
                        <Divider color={"#E7E7E7"} />
                        {/* Menu Items */}



                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            margin: 0,
                            marginTop: "0.9rem"
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#989898",
                              lineHeight: "1.125rem"
                            }}
                          >
                            My Requests
                          </Typography>
                          <Typography
                            sx={{
                              color: "#989898",
                              lineHeight: "1.125rem",
                              cursor: "pointer"
                            }}
                          >
                            My Favorite Professionals
                          </Typography>
                          <Typography
                            sx={{
                              color: "#989898",
                              lineHeight: "1.125rem", cursor: "pointer"
                            }}
                          >
                            My Transactions
                          </Typography>
                          <Typography
                            sx={{
                              color: "#989898",
                              lineHeight: "1.125rem",
                              cursor: "pointer"
                            }}
                          >
                            Help Center
                          </Typography>
                          <Divider color={"#E7E7E7"} />

                          <Typography
                            sx={{
                              color: "primary.normal",
                              lineHeight: "1.125rem",
                              cursor: "pointer"
                            }}
                          >
                            Sign Out
                          </Typography>

                        </Box>
                      </Box>
                    </Menu>
                  </Box>
                )}

                {/* Mobile Menu */}
                <IconButton
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

                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
                overflow: "hidden",
              }}
            >
              <InputBase
                placeholder="What are you looking for?"
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
                  bgcolor: "primary.main",
                  borderRadius: 0,
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <BookServiceModal
        open={bookServiceModalOpen}
        onClose={() => setBookServiceModalOpen(false)}
      />
    </>
  );
}