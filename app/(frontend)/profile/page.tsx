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

export default function ProfilePage() {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState("My Profile");

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
        router.push(ROUTES.HOME);
      },
    },
  ];

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
      <Header  />

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 6,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
          }}
        >
          {/* Left Sidebar - Account Setting */}
          <Box
            sx={{
              width: { xs: "100%", md: 280 },
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                mb: 3,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Account Setting
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    color:
                      activeMenuItem === item.id
                        ? "white"
                        : item.id === "Sign Out"
                        ? "primary.main"
                        : "text.secondary",
                    bgcolor:
                      activeMenuItem === item.id ? "primary.main" : "transparent",
                    "&:hover": {
                      bgcolor:
                        activeMenuItem === item.id
                          ? "primary.dark"
                          : item.id === "Sign Out"
                          ? "transparent"
                          : "grey.50",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right Content - Dynamic Sections */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeMenuItem === "My Profile" && <ProfileOverview />}
            {activeMenuItem === "Transactions" && <TransactionsHistory />}
            {activeMenuItem === "Ratings & Reviews" && <RatingsReviews />}
          </Box>
        </Box>
      </Container>


    </Box>
  );
}

