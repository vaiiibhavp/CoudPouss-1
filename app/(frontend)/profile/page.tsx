"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Divider, IconButton, Drawer, Snackbar, Alert } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileOverview from "./components/ProfileOverview";
import TransactionsHistory from "./components/TransactionsHistory";
import RatingsReviews from "./components/RatingsReviews";
import DeleteProfileModal from "@/components/DeleteProfileModal";
import SignOutModal from "@/components/SignOutModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { logout } from "@/lib/redux/authSlice";
import { apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenuItem, setActiveMenuItem] = useState("My Profile");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSignOutModal, setOpenSignOutModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [signoutSnackbarOpen, setSignoutSnackbarOpen] = useState(false);
  const [signoutSnackbarMessage, setSignoutSnackbarMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const handleSignOut = () => {
    // perform logout and show toast before redirect
    localStorage.removeItem("userInitial");
    localStorage.removeItem("userEmail");
    dispatch(logout());
    setOpenSignOutModal(false);
    setSignoutSnackbarMessage("Sign out successful");
    setSignoutSnackbarOpen(true);
    setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 800);
  };

  const menuItems = [
    { id: "My Profile", label: "My Profile" },
    { id: "Transactions", label: "Transactions" },
    { id: "Ratings & Reviews", label: "Ratings & Reviews" },
    {
      id: "Sign Out",
      label: "Sign Out",
      action: () => {
        setOpenSignOutModal(true);
      },
    },
  ];

  const handleDeleteProfile = () => {
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await apiDelete(API_ENDPOINTS.AUTH.DELETE_PROFILE);
      
      if (response.success) {
        // Clear user data
        localStorage.removeItem("userInitial");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        dispatch(logout());
        // Redirect to home or login page
        router.push(ROUTES.HOME);
      } else {
        alert(response.error?.message || "Failed to delete profile. Please try again.");
        setOpenDeleteModal(false);
      }
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
      setOpenDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      {/* <Header  /> */}

      {/* Main Content */}
      <Box
        
        sx={{
          flex: 1,
          px: { xs: "1rem", md: "5rem" },
          py: { xs: "1rem", md: "3.188rem" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile Menu Icon */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            mb: "1.5rem",
            gap: "1rem",
          }}
        >
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              color: "#2C6587",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "rgba(44, 101, 135, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              color: "#2C6587",
              fontSize: "1.5rem",
            }}
          >
            Account Setting
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "2.25rem",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
          }}
        >
          {/* Left Sidebar - Account Setting (Desktop) */}
          <Box
            sx={{
              width: { xs: "100%", md: "17.5rem" },
              flexShrink: 0,
              borderRight: { xs: "none", md: "0.063rem solid #E7E7E7" },
              paddingRight: { xs: "0", md: "1.438rem" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: "#2C6587",
                mb: "1.875rem",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Account Setting
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveMenuItem(item.id);
                      }
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      px: activeMenuItem === item.id ? "1.25rem" : item.id === "Sign Out" ? "1rem" : "1.25rem",
                      py: activeMenuItem === item.id ? "0.625rem" : item.id === "Sign Out" ? "0.75rem" : "0.625rem",
                      borderRadius: activeMenuItem === item.id ? "6.25rem" : item.id === "Sign Out" ? "1rem" : "6.25rem",
                      fontSize: item.id === "Sign Out" ? "1rem" : "1rem", // 16px
                      fontFamily: "Lato, sans-serif",
                      fontWeight: 400,
                      lineHeight: item.id === "Sign Out" ? "1.125rem" : activeMenuItem === item.id ? "140%" : "140%", // 18px for Sign Out
                      letterSpacing: "0%",
                      border: activeMenuItem === item.id ? "none" : item.id === "Sign Out" ? "none" : "0.0625rem solid #EAF0F3",
                      color:
                        activeMenuItem === item.id
                          ? "#FFFFFF"
                          : item.id === "Sign Out"
                          ? "#2C6587"
                          : "#6D6D6D",
                      bgcolor:
                        activeMenuItem === item.id ? "#2C6587" : "transparent",
                      "&:hover": {
                        bgcolor:
                          activeMenuItem === item.id
                            ? "#2C6587"
                            : item.id === "Sign Out"
                            ? "transparent"
                            : "grey.50",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  {item.id === "Ratings & Reviews" && (
                    <Divider sx={{ borderColor: "#E7E7E7", my: "0.5rem" }} />
                  )}
                </React.Fragment>
              ))}
              <Typography
                onClick={handleDeleteProfile}
                sx={{

                  textAlign: "left",
                  cursor: "pointer",
                  textTransform: "none",
                  px: "1rem",
                  py: 0,
                  minWidth: "auto",
                  fontSize: "1rem", // 16px
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 600, // SemiBold
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  border: "none",
                  color: "#D32F2F",
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                Delete Profile
              </Typography>
            </Box>
          </Box>

          {/* Mobile Drawer - Account Setting */}
          <Drawer
            anchor="left"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: "17.5rem",
                px: "1.438rem",
                py: "2rem",
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {menuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <Button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveMenuItem(item.id);
                        setMobileMenuOpen(false);
                      }
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      px: activeMenuItem === item.id ? "1.25rem" : item.id === "Sign Out" ? "1rem" : "1.25rem",
                      py: activeMenuItem === item.id ? "0.625rem" : item.id === "Sign Out" ? "0.75rem" : "0.625rem",
                      borderRadius: activeMenuItem === item.id ? "6.25rem" : item.id === "Sign Out" ? "1rem" : "6.25rem",
                      fontSize: item.id === "Sign Out" ? "1rem" : "1rem",
                      fontFamily: "Lato, sans-serif",
                      fontWeight: 400,
                      lineHeight: item.id === "Sign Out" ? "1.125rem" : activeMenuItem === item.id ? "140%" : "140%",
                      letterSpacing: "0%",
                      border: activeMenuItem === item.id ? "none" : item.id === "Sign Out" ? "none" : "0.0625rem solid #EAF0F3",
                      color:
                        activeMenuItem === item.id
                          ? "#FFFFFF"
                          : item.id === "Sign Out"
                          ? "#2C6587"
                          : "#6D6D6D",
                      bgcolor:
                        activeMenuItem === item.id ? "#2C6587" : "transparent",
                      "&:hover": {
                        bgcolor:
                          activeMenuItem === item.id
                            ? "#2C6587"
                            : item.id === "Sign Out"
                            ? "transparent"
                            : "grey.50",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  {item.id === "Ratings & Reviews" && (
                    <Divider sx={{ borderColor: "#E7E7E7", my: "0.5rem" }} />
                  )}
                </React.Fragment>
              ))}
              <Typography
                onClick={() => {
                  handleDeleteProfile();
                  setMobileMenuOpen(false);
                }}
                sx={{
                  textAlign: "left",
                  cursor: "pointer",
                  textTransform: "none",
                  px: "1rem",
                  py: 0,
                  minWidth: "auto",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 600,
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  border: "none",
                  color: "#D32F2F",
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                Delete Profile
              </Typography>
            </Box>
          </Drawer>

          {/* Right Content - Dynamic Sections */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeMenuItem === "My Profile" && <ProfileOverview />}
            {activeMenuItem === "Transactions" && <TransactionsHistory />}
            {activeMenuItem === "Ratings & Reviews" && <RatingsReviews />}
          </Box>
        </Box>
      </Box>

      {/* Delete Profile Modal */}
      <DeleteProfileModal
        open={openDeleteModal}
        onClose={() => !deleting && setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
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

      {/* Sign Out Modal */}
      <SignOutModal
        open={openSignOutModal}
        onClose={() => setOpenSignOutModal(false)}
        onConfirm={handleSignOut}
      />
    </Box>
  );
}

