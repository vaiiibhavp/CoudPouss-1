"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileOverview from "./components/ProfileOverview";
import TransactionsHistory from "./components/TransactionsHistory";
import RatingsReviews from "./components/RatingsReviews";
import DeleteProfileModal from "@/components/DeleteProfileModal";
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
  const [deleting, setDeleting] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const menuItems = [
    { id: "My Profile", label: "My Profile" },
    { id: "Transactions", label: "Transactions" },
    { id: "Ratings & Reviews", label: "Ratings & Reviews" },
    {
      id: "Sign Out",
      label: "Sign Out",
      action: () => {
        localStorage.removeItem("userInitial");
        localStorage.removeItem("userEmail");
        dispatch(logout());
        router.push(ROUTES.HOME);
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
          px:"5rem",
          py: "3.188rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
          }}
        >
          {/* Left Sidebar - Account Setting */}
          <Box
            sx={{
              width: { xs: "100%", md: "17.5rem" },
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: "text.primary",
                mb: "1.875rem",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Account Setting
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.id}
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
                    fontSize: "1rem",
                    fontFamily: activeMenuItem === item.id ? "Lato, sans-serif" : item.id === "Sign Out" ? "inherit" : "Lato, sans-serif",
                    fontWeight: activeMenuItem === item.id ? 400 : item.id === "Sign Out" ? "inherit" : 400,
                    lineHeight: activeMenuItem === item.id ? "140%" : item.id === "Sign Out" ? "inherit" : "140%",
                    letterSpacing: activeMenuItem === item.id ? "0%" : item.id === "Sign Out" ? "inherit" : "0%",
                    border: activeMenuItem === item.id ? "none" : item.id === "Sign Out" ? "none" : "0.0625rem solid #EAF0F3",
                    color:
                      activeMenuItem === item.id
                        ? "#FFFFFF"
                        : item.id === "Sign Out"
                        ? "primary.main"
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
              ))}
              <Button
                onClick={handleDeleteProfile}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  px: "1rem",
                  py: 0,
                  minWidth: "auto",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 400,
                  lineHeight: "140%",
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
              </Button>
            </Box>
          </Box>

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
    </Box>
  );
}

