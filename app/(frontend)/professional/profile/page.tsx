"use client";

import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Drawer, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import MyEarnings from "@/components/MyEarnings";
import ManageServices from "@/components/ManageServices";
import ManageSubscription from "@/components/ManageSubscription";
import RatingsAndReviews from "@/components/RatingsAndReviews";
import ProfessionalEditProfile from "./components/ProfessionalEditProfile";
import ProfessionalProfileOverview from "./components/ProfessionalProfileOverview";
import DeleteProfileModal from "@/components/DeleteProfileModal";
import SignOutModal from "@/components/SignOutModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { logout } from "@/lib/redux/authSlice";
import { apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("My Profile");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSignOutModal, setOpenSignOutModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    "My Profile",
    "My Earnings",
    "Manage Services",
    "Manage Subscription",
    "Ratings & Reviews",
  ];

  const handleDeleteProfile = () => {
    setOpenDeleteModal(true);
  };

  const handleSignOutClick = () => {
    setOpenSignOutModal(true);
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    // perform logout and show toast before redirect
    localStorage.removeItem("userInitial");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    dispatch(logout());
    setOpenSignOutModal(false);
    toast.success("Sign out successful");
    setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 800);
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
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
          py: { xs: "1rem", sm: "2rem", md: "2.5rem", lg: "3.188rem" },
          display: "flex",
          flexDirection: "column",
          gap: { xs: "1rem", md: "2rem" },
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

        {/* Desktop Account Setting Title */}
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            color: "text.primary",
            fontSize: { xs: "1.5rem", md: "2rem" },
            display: { xs: "none", md: "block" },
          }}
        >
          Account Setting
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
          }}
        >
          {/* Sidebar (Desktop) */}
          <Box
            sx={{
              width: { xs: "100%", md: "17.5rem" },
              flexShrink: 0,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: "0.875rem",
              borderRight: { md: "0.063rem solid #E7E7E7" },
              paddingRight: { md: "1.438rem" },
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  px: activeTab === tab ? "1.25rem" : "1.25rem",
                  py: activeTab === tab ? "0.625rem" : "0.625rem",
                  borderRadius: activeTab === tab ? "6.25rem" : "6.25rem",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: activeTab === tab ? 400 : 400,
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  border: activeTab === tab ? "none" : "0.0625rem solid #EAF0F3",
                  color: activeTab === tab ? "#FFFFFF" : "#6D6D6D",
                  bgcolor: activeTab === tab ? "#2C6587" : "transparent",
                  "&:hover": {
                    bgcolor: activeTab === tab ? "#2C6587" : "grey.50",
                  },
                }}
              >
                {tab}
              </Button>
            ))}

            <Divider sx={{ borderColor: "#E7E7E7", my: "0.5rem" }} />

            <Button
              onClick={handleSignOutClick}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: "1rem",
                py: "0.75rem",
                minWidth: "auto",
                fontSize: "1rem",
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0%",
                border: "none",
                color: "#2C6587",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Sign Out
            </Button>

            <Typography
              onClick={handleDeleteProfile}
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
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    px: activeTab === tab ? "1.25rem" : "1.25rem",
                    py: activeTab === tab ? "0.625rem" : "0.625rem",
                    borderRadius: activeTab === tab ? "6.25rem" : "6.25rem",
                    fontSize: "1rem",
                    fontFamily: "Lato, sans-serif",
                    fontWeight: activeTab === tab ? 400 : 400,
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    border: activeTab === tab ? "none" : "0.0625rem solid #EAF0F3",
                    color: activeTab === tab ? "#FFFFFF" : "#6D6D6D",
                    bgcolor: activeTab === tab ? "#2C6587" : "transparent",
                    "&:hover": {
                      bgcolor: activeTab === tab ? "#2C6587" : "grey.50",
                    },
                  }}
                >
                  {tab}
                </Button>
              ))}

              <Divider sx={{ borderColor: "#E7E7E7", my: "0.5rem" }} />

              <Button
                onClick={handleSignOutClick}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  px: "1rem",
                  py: "0.75rem",
                  minWidth: "auto",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: 400,
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  border: "none",
                  color: "#2C6587",
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
              >
                Sign Out
              </Button>

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

          {/* Main Content */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeTab === "My Profile" ? (
              <ProfessionalProfileOverview />
            ) : activeTab === "My Earnings" ? (
              <MyEarnings />
            ) : activeTab === "Manage Services" ? (
              <ManageServices />
            ) : activeTab === "Manage Subscription" ? (
              <ManageSubscription />
            ) : activeTab === "Ratings & Reviews" ? (
              <RatingsAndReviews />
            ) : null}
          </Box>
        </Box>
      </Box>

      <DeleteProfileModal
        open={openDeleteModal}
        onClose={() => !deleting && setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
      <SignOutModal
        open={openSignOutModal}
        onClose={() => setOpenSignOutModal(false)}
        onConfirm={handleSignOut}
      />
    </Box>
  );
}
