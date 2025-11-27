"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HomeAssistancePage() {
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Service categories
  const serviceCategories = [
    { name: "DIY", icon: "/icons/diy.png" },
    { name: "Gardening", icon: "/icons/gardening.png" },
    { name: "Housekeeping", icon: "/icons/housekeeping.png" },
    { name: "Childcare", icon: "/icons/childcare.png" },
    { name: "Pets", icon: "/icons/pets.png" },
    { name: "Homecare", icon: "/icons/homecare.png" },
  ];

  // Service cards data
  const serviceCards = [
    {
      id: 1,
      title: "Furniture Assembly",
      image: "/image/service-image-1.png",
    },
    {
      id: 2,
      title: "Other Installation",
      image: "/image/service-image-2.png",
    },
    {
      id: 3,
      title: "Furniture Assembly",
      image: "/image/service-image-1.png",
    },
    {
      id: 4,
      title: "Furniture Assembly",
      image: "/image/service-image-1.png",
    },
    {
      id: 5,
      title: "Furniture Assembly",
      image: "/image/service-image-2.png",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Left Section - Text and Service Categories */}
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                color: "text.primary",
                mb: 4,
              }}
            >
              Home Assistance Services At Your Doorstep
            </Typography>

            {/* Service Categories Card */}
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  mb: 3,
                  color: "#1F2937",
                  fontSize: "1.1rem",
                  fontFamily: "sans-serif",
                }}
              >
                What are you looking for
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                {serviceCategories.map((category) => (
                  <Card
                    key={category.name}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: "#F3F4F6",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={50}
                        height={50}
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        color: "#1F2937",
                        fontSize: "0.85rem",
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Card>
          </Box>

          {/* Right Section - Image Collage */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: 3, md: "0 12px 0 0" },
                overflow: "hidden",
                aspectRatio: "1 / 1",
                bgcolor: "grey.200",
              }}
            >
              <Image
                src="/image/service-image-1.png"
                alt="TV Installation"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: 3, md: "12px 0 0 0" },
                overflow: "hidden",
                aspectRatio: "1 / 1",
                bgcolor: "grey.200",
              }}
            >
              <Image
                src="/image/service-image-2.png"
                alt="Kitchen Cleaning"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: 3, md: "0 0 0 12px" },
                overflow: "hidden",
                aspectRatio: "1 / 1",
                bgcolor: "grey.200",
              }}
            >
              <Image
                src="/image/service-image-3.png"
                alt="Beauty Treatment"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: 3, md: "0 0 12px 0" },
                overflow: "hidden",
                aspectRatio: "1 / 1",
                bgcolor: "grey.200",
              }}
            >
              <Image
                src="/image/service-image-4.png"
                alt="Beauty Treatment"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>
        </Box>

        {/* Service Sections */}
        <Box sx={{ mt: 8 }}>
          {[
            "DIY Services",
            "Gardening",
            "Housekeeping",
            "Childcare",
            "Pets",
            "Homecare",
          ].map((serviceName) => (
            <Box key={serviceName} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#2F6B8E",
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {serviceName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  overflowX: "auto",
                  pb: 2,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                }}
              >
                {serviceCards.map((card) => (
                  <Card
                    key={`${serviceName}-${card.id}`}
                    sx={{
                      minWidth: 280,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 200,
                        bgcolor: "grey.200",
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                        {card.title}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontSize: "0.85rem",
                          py: 0.75,
                        }}
                      >
                        Create Request
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>


    </Box>
  );
}
