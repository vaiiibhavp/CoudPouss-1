"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditIcon from "@mui/icons-material/Edit";
import MyEarnings from "@/components/MyEarnings";
import ManageServices from "@/components/ManageServices";
import ManageSubscription from "@/components/ManageSubscription";
import RatingsAndReviews from "@/components/RatingsAndReviews";

export default function ProfessionalProfilePage() {
  const [activeTab, setActiveTab] = useState("My Profile");

  const tabs = [
    "My Profile",
    "My Earnings",
    "Manage Services",
    "Manage Subscription",
    "Ratings & Reviews",
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ color: "#2F6B8E", mb: 4 }}
        >
          Account Setting
        </Typography>

        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1rem",
                  fontWeight: activeTab === tab ? "600" : "400",
                  bgcolor: activeTab === tab ? "#2F6B8E" : "transparent",
                  color: activeTab === tab ? "white" : "#6B7280",
                  "&:hover": {
                    bgcolor: activeTab === tab ? "#2F6B8E" : "#F3F4F6",
                  },
                }}
              >
                {tab}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <Button
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: "400",
                color: "#EF4444",
                "&:hover": {
                  bgcolor: "#FEE2E2",
                },
              }}
            >
              Sign Out
            </Button>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {activeTab === "My Earnings" ? (
              <MyEarnings />
            ) : activeTab === "Manage Services" ? (
              <ManageServices />
            ) : activeTab === "Manage Subscription" ? (
              <ManageSubscription />
            ) : activeTab === "Ratings & Reviews" ? (
              <RatingsAndReviews />
            ) : (
              <>
                {/* Profile Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 3,
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "#E5E7EB",
                      }}
                    >
                      <Image
                        src="/icons/testimonilas-1.png"
                        alt="Bessie Carter"
                        width={120}
                        height={120}
                        style={{ objectFit: "cover" }}
                      />
                    </Avatar>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
                      Bessie Carter
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6B7280", mb: 0.5 }}
                    >
                      Professional User
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Manchester, Kentucky 39495
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{
                      textTransform: "none",
                      borderColor: "#2F6B8E",
                      color: "#2F6B8E",
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#2F6B8E",
                        bgcolor: "#F0F9FF",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>

                {/* Personal Information */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#2F6B8E", mb: 3 }}
                  >
                    Personal Information
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", mb: 1 }}
                      >
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        Bessie Cooper
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", mb: 1 }}
                      >
                        E-mail id
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        michael.mitc@example.com
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", mb: 1 }}
                      >
                        Mobile Number
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        +11 (480) 555-0103
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", mb: 1 }}
                      >
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        4517 Washington Ave. Manchester, Kentucky 39495
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", mb: 1 }}
                      >
                        Year of Experience
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        4
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Public Profile Details */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#2F6B8E", mb: 3 }}
                  >
                    Public profile Details
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
                      Bio
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#374151", lineHeight: 1.6 }}
                    >
                      Hi, I'm Bessie — with over 6 years of experience in expert TV
                      mounting and reliable plumbing solutions. I specialize in
                      mounting TVs, shelves, mirrors with precision and care
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6B7280", mb: 1 }}
                    >
                      Experience & Specialties
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#374151", lineHeight: 1.6 }}
                    >
                      Hi, I'm Bessie — with over 6 years of experience in expert
                      TV mounting and reliable plumbing solutions. I specialize in
                      mounting TVs, shelves, mirrors with precision and care
                    </Typography>
                  </Box>
                </Box>

                {/* Achievements */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#2F6B8E", mb: 3 }}
                  >
                    Achievements
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#374151", lineHeight: 1.6 }}
                  >
                    Bessie Cooper has successfully completed over 150 projects,
                    showcasing her expertise in TV mounting and plumbing. Her
                    dedication to quality and customer satisfaction has earned her
                    numerous accolades, including the "Best Service Provider" award
                    in 2022. Clients consistently praise her attention to detail and
                    professionalism, making her a top choice for home improvement
                    services.
                  </Typography>
                </Box>

                {/* Images of Past Works */}
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#2F6B8E", mb: 3 }}
                  >
                    Images of Past Works
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "75%",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#F3F4F6",
                      }}
                    >
                      <Image
                        src="/image/explore-service-section-1.png"
                        alt="Past work 1"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "75%",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#F3F4F6",
                      }}
                    >
                      <Image
                        src="/image/explore-service-section-2.png"
                        alt="Past work 2"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>

      
    </Box>
  );
}
