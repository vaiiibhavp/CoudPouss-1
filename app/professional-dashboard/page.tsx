"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServiceRequestCard from "@/components/ServiceRequestCard";

export default function DashboardPage() {
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

  // Service request data
  const serviceRequests = [
    {
      id: 1,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 3,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 4,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box>
            <Box sx={{ position: "relative", mb: 3, overflow: "visible" }}>
              <Card
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  padding: "23px",
                  paddingLeft: "265px",
                  minHeight: "175px",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Floating Image */}
                <Box
                  component="div"
                  sx={{
                    position: "absolute",
                    left: "2px",
                    top: "-20px",
                    width: "186px",
                    height: "209px",
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    zIndex: 2,
                  }}
                >
                  <Image
                    src="/image/how-work-img-3.png"
                    alt="Professional"
                    fill
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    sizes="(max-width: 600px) 140px, (max-width: 960px) 180px, 220px"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                        lineHeight: 1,
                      }}
                    >
                      10
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      Professionals
                      <br />
                      Connected Today
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    Lorem ipsum a pharetra mattis dilt pulvinar tortor amet
                    vulputate.
                  </Typography>
                </Box>
              </Card>
            </Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                color: "text.primary",
                mb: 2,
              }}
            >
              Home Services At Your Doorstep
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 8,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Making home care simple, safe, and accessible for seniors. Find
              trusted professionals for repairs, cleaning, and more — right at
              your doorstep.
            </Typography>
          </Box>

          {/* Right side - Image */}
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-1.png"
                  alt="Service - TV Installation"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-2.png"
                  alt="Service - Tools and Equipment"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-3.png"
                  alt="Service - Beauty Treatment"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  bgcolor: "grey.200",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <Image
                  src="/image/service-image-4.png"
                  alt="Service - Delivery and Assistance"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Explore Service Requests Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          fontWeight="600"
          gutterBottom
          sx={{ mb: 4, color: "#1F2937" }}
        >
          Explore Service Requests
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            overflowY: "hidden",
            scrollBehavior: "smooth",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#F3F4F6",
              borderRadius: 2,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D1D5DB",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#9CA3AF",
              },
            },
          }}
        >
          {serviceRequests.map((request) => (
            <Box
              key={request.id}
              sx={{
                minWidth: { xs: "280px", sm: "320px", md: "300px" },
                flexShrink: 0,
              }}
            >
              <ServiceRequestCard
                id={request.id}
                title={request.title}
                image={request.image}
                date={request.date}
                time={request.time}
                serviceProvider={request.serviceProvider}
                location={request.location}
                estimatedCost={request.estimatedCost}
                timeAgo={request.timeAgo}
              />
            </Box>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "grey.200", py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 6,
              alignItems: "center",
            }}
          >
            {/* Left Side - Phone Mockups */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                gap: 2,
              }}
            >
              {/* Left Phone */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 150, md: 220 },
                  height: { xs: 300, md: 440 },
                  transform: "rotate(-5deg)",
                  zIndex: 2,
                }}
              >
                <Image
                  src="/icons/iPhone-left.png"
                  alt="CoudPouss App - Home Screen"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 150px, 220px"
                />
              </Box>

              {/* Right Phone */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 150, md: 220 },
                  height: { xs: 300, md: 440 },
                  transform: "rotate(5deg)",
                  zIndex: 1,
                  mt: { xs: 4, md: 6 },
                }}
              >
                <Image
                  src="/icons/iPhone-right.png"
                  alt="CoudPouss App - Task Details Screen"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 150px, 220px"
                />
              </Box>
            </Box>

            {/* Right Side - Text and Download Links */}
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#374151",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  mb: 3,
                }}
              >
                Download the new CoudPouss app
              </Typography>

              {/* Download For Free Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F59E0B",
                  color: "white",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  mb: 3,
                  "&:hover": {
                    bgcolor: "#D97706",
                  },
                }}
              >
                Download For Free
              </Button>

              {/* App Store Badges */}
              <Stack
                direction="row"
                spacing={2}
                sx={{ flexWrap: "wrap", gap: 2 }}
              >
                {/* Apple App Store Badge */}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#000000",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    textDecoration: "none",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#1F2937",
                    },
                    minWidth: { xs: "100%", sm: 180 },
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.65rem", display: "block" }}
                    >
                      Download on the
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                    >
                      App Store
                    </Typography>
                  </Box>
                </Box>

                {/* Google Play Badge */}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#000000",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    textDecoration: "none",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#1F2937",
                    },
                    minWidth: { xs: "100%", sm: 180 },
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm-4.81-4.81L6.05 2.66l10.76 6.44-2.81 2.81zM20.16 12.45l-2.85-2.85-2.85 2.85 2.85 2.85 2.85-2.85z" />
                    </svg>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.65rem", display: "block" }}
                    >
                      GET IT ON
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                    >
                      Google Play
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
