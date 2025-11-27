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
import { ROUTES } from "@/constants/routes";
import BookServiceModal from "./BookServiceModal";
import { useSelector } from "react-redux";

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

  // Check if we're on professional dashboard or its sub-routes (including professional profile)
  const isProfessionalDashboard = pathname?.startsWith('/professional');
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [servicesMenuAnchor, setServicesMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [bookServiceModalOpen, setBookServiceModalOpen] = useState(false);

  useEffect(() => {


    if (typeof window === "undefined") return;


    const syncFromLocalStorage = () => {
      const initial = localStorage.getItem("userInitial");
      const email = localStorage.getItem("userEmail");

      setUserInitial(initial);
      setUserEmail(email);
    };
    // Sync state with localStorage 
    // changes (e.g., from other tabs)


    syncFromLocalStorage();
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        setUserInitial(localStorage.getItem("userInitial"));
        setUserEmail(localStorage.getItem("userEmail"));

      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  const isAuthenticated = Boolean(userInitial && userEmail);

  const handleLogout = () => {
    localStorage.removeItem("userInitial");
    localStorage.removeItem("userEmail");
    setUserInitial(null);
    setUserEmail(null);
    router.push(ROUTES.HOME);
  };

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setServicesMenuAnchor(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setServicesMenuAnchor(null);
  };

  const handleNotificationsMenuOpen = (
    event: React.MouseEvent<HTMLElement>
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

  // Determine home route - use prop if provided, otherwise based on authentication
  const finalHomeRoute =
    homeRoute || (isAuthenticated ? ROUTES.AUTH_HOME : ROUTES.HOME);
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white" }}>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                    color: "primary.main",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
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
                        color:
                          pathname === ROUTES.PROFESSIONAL_DASHBOARD
                            ? "primary.main"
                            : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom:
                          pathname === ROUTES.PROFESSIONAL_DASHBOARD
                            ? "2px solid"
                            : "none",
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
                        color:
                          pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS
                            ? "primary.main"
                            : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom:
                          pathname === ROUTES.PROFESSIONAL_EXPLORE_REQUESTS
                            ? "2px solid"
                            : "none",
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
                        color:
                          pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT
                            ? "primary.main"
                            : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom:
                          pathname === ROUTES.PROFESSIONAL_TASK_MANAGEMENT
                            ? "2px solid"
                            : "none",
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
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Explore Services Dropdown - Only for non-professional routes */}
                {!isProfessionalDashboard &&
                  showExploreServices &&
                  isAuthenticated && (
                    <Button
                      onClick={handleServicesMenuOpen}
                      endIcon={<ExpandMoreIcon />}
                      sx={{
                        color: "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "flex" },
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
                      p: 2,
                    },
                  }}
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2F6B8E",
                        fontWeight: "bold",
                        mb: 2,
                        fontSize: "1.25rem",
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
                      <Card
                        component={Link}
                        href={ROUTES.HOME_ASSISTANCE}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "primary.main",
                          },
                          transition: "all 0.2s ease",
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
                              bgcolor: "grey.50",
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
                            sx={{ textAlign: "center", color: "text.primary" }}
                          >
                            Home Assistance
                          </Typography>
                        </Box>
                      </Card>

                      {/* Transport */}
                      <Card
                        component={Link}
                        href={ROUTES.TRANSPORT}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "primary.main",
                          },
                          transition: "all 0.2s ease",
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
                              bgcolor: "grey.50",
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
                            sx={{ textAlign: "center", color: "text.primary" }}
                          >
                            Transport
                          </Typography>
                        </Box>
                      </Card>

                      {/* Personal Care */}
                      <Card
                        component={Link}
                        href={ROUTES.PERSONAL_CARE}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "primary.main",
                          },
                          transition: "all 0.2s ease",
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
                              bgcolor: "grey.50",
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
                            sx={{ textAlign: "center", color: "text.primary" }}
                          >
                            Personal Care
                          </Typography>
                        </Box>
                      </Card>

                      {/* Tech Support */}
                      <Card
                        component={Link}
                        href={ROUTES.TECH_SUPPORT}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "grey.200",
                          textDecoration: "none",
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "primary.main",
                          },
                          transition: "all 0.2s ease",
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
                              bgcolor: "grey.50",
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
                            sx={{ textAlign: "center", color: "text.primary" }}
                          >
                            Tech Support
                          </Typography>
                        </Box>
                      </Card>
                    </Box>
                  </Box>
                </Menu>

                {/* My Requests Link - Only show when authenticated and not on professional dashboard */}
                {!isProfessionalDashboard &&
                  showMyRequests &&
                  isAuthenticated && (
                    <Button
                      component={Link}
                      href={ROUTES.MY_REQUESTS}
                      sx={{
                        color:
                          pathname === ROUTES.MY_REQUESTS
                            ? "primary.main"
                            : "text.secondary",
                        textTransform: "none",
                        display: { xs: "none", lg: "block" },
                        borderBottom:
                          pathname === ROUTES.MY_REQUESTS
                            ? "2px solid"
                            : "none",
                        borderColor: "primary.main",
                        borderRadius: 0,
                        pb: pathname === ROUTES.MY_REQUESTS ? 1 : 0,
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
                {!isProfessionalDashboard &&
                  showBookServiceButton &&
                  isAuthenticated && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setBookServiceModalOpen(true)}
                      sx={{
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
                {showUserIcons && isAuthenticated && (
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
                      <NotificationsIcon />
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
                      <MessageIcon />
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
                        {userInitial}
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
                          mt: 1.5,
                          minWidth: 280,
                          borderRadius: 3,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          p: 2,
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Box>
                        {/* User Name */}
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{ color: "#2F6B8E", mb: 0.5 }}
                        >
                          Cameron Williamson
                        </Typography>
                        <Button
                          component={Link}
                          href={isProfessionalDashboard ? ROUTES.PROFESSIONAL_PROFILE : ROUTES.PROFILE}
                          onClick={handleProfileMenuClose}
                          sx={{
                            textTransform: "none",
                            color: "#6B7280",
                            fontSize: "0.9rem",
                            p: 0,
                            mb: 2,
                            justifyContent: "flex-start",
                            "&:hover": {
                              bgcolor: "transparent",
                              color: "#2F6B8E",
                            },
                          }}
                        >
                          View my profile
                        </Button>

                        {/* Menu Items */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Button
                            fullWidth
                            sx={{
                              textTransform: "none",
                              color: "#6B7280",
                              fontSize: "0.95rem",
                              justifyContent: "flex-start",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#F3F4F6",
                                color: "#2F6B8E",
                              },
                            }}
                          >
                            My Earnings
                          </Button>
                          <Button
                            fullWidth
                            sx={{
                              textTransform: "none",
                              color: "#6B7280",
                              fontSize: "0.95rem",
                              justifyContent: "flex-start",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#F3F4F6",
                                color: "#2F6B8E",
                              },
                            }}
                          >
                            Manage Services
                          </Button>
                          <Button
                            fullWidth
                            sx={{
                              textTransform: "none",
                              color: "#6B7280",
                              fontSize: "0.95rem",
                              justifyContent: "flex-start",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#F3F4F6",
                                color: "#2F6B8E",
                              },
                            }}
                          >
                            Manage Subscription
                          </Button>
                          <Button
                            fullWidth
                            sx={{
                              textTransform: "none",
                              color: "#6B7280",
                              fontSize: "0.95rem",
                              justifyContent: "flex-start",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#F3F4F6",
                                color: "#2F6B8E",
                              },
                            }}
                          >
                            Ratings & Reviews
                          </Button>

                          {/* Divider */}
                          <Box
                            sx={{
                              height: 1,
                              bgcolor: "#E5E7EB",
                              my: 1,
                            }}
                          />

                          {/* Sign Out */}
                          <Button
                            fullWidth
                            onClick={() => {
                              handleProfileMenuClose();
                              handleLogout();
                            }}
                            sx={{
                              textTransform: "none",
                              color: "#2F6B8E",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              justifyContent: "flex-start",
                              py: 1.5,
                              px: 2,
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#F3F4F6",
                              },
                            }}
                          >
                            Sign Out
                          </Button>
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
                bgcolor: "grey.50",
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
