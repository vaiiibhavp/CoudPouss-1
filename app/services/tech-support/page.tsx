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
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function TechSupportPage() {
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

  // Tech support service cards data
  const techSupportServices = [
    {
      id: 1,
      title: "Other Computer Job",
      image: "/image/service-image-1.png",
    },
    {
      id: 2,
      title: "Computer Courses",
      image: "/image/service-image-2.png",
    },
    {
      id: 3,
      title: "Installing a Printer",
      image: "/image/service-image-1.png",
    },
    {
      id: 4,
      title: "Computer Cleaning",
      image: "/image/service-image-1.png",
    },
    {
      id: 5,
      title: "Internet Box Setup",
      image: "/image/service-image-1.png",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      {/* Hero Section - Tech Support Banner */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              minHeight: { xs: 300, md: 400 },
            }}
          >
            {/* Left Side - Dark Blue/Grey Background with Text */}
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 2,
                  color: "white",
                }}
              >
                Seeking Expert Tech Assistance?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Lorem ipsum dit.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  maxWidth: 200,
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Book Now
              </Button>
            </Box>

            {/* Right Side - Image */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: { xs: 300, md: 400 },
              }}
            >
              <Image
                src="/image/tech-support-hero-section.png"
                alt="Tech Support Service"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          </Box>
        </Card>

        {/* All Services Section */}
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#2F6B8E",
              mb: 4,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            All Services
          </Typography>

          {/* Service Cards Grid - 2 rows, 3 columns (5 cards total) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {techSupportServices.map((service) => (
              <Card
                key={service.id}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                  transition: "all 0.2s ease",
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
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ mb: 2, color: "text.primary" }}
                  >
                    {service.title}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    endIcon={<ArrowOutwardIcon sx={{ fontSize: "0.9rem" }} />}
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
      </Container>


    </Box>
  );
}

