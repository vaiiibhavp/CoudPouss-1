"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideocamIcon from "@mui/icons-material/Videocam";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSubmittedModal from "@/components/QuoteSubmittedModal";

export default function RequestViewPage() {
  const router = useRouter();
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Mock data - in real app, fetch based on params.id
  const requestData = {
    id: params.id,
    title: "Furniture Assembly",
    category: "DIY",
    serviceProvider: "DIY Services",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "4517 Washington Ave. Manchester, Kentucky 39495",
    timeAgo: "2 hours ago",
    description:
      "Transform your space with our expert furniture assembly services. Our skilled team will handle everything from unpacking to setup, ensuring your new pieces are perfectly assembled and ready for use. We specialize in a wide range of furniture types, including flat-pack items, complete modular systems, and custom installations. Enjoy a hassle-free experience with professional assembly that saves you time and effort in your newly furnished area. Schedule your assembly today and let us help you create the perfect environment!",
    clientName: "Wade Warren",
    clientAvatar: "/image/main.png",
    images: [
      "/image/main.png",
      "/image/main.png",
      "/image/main.png",
      "/image/main.png",
    ],
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? requestData.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === requestData.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmitQuote = () => {
    // Handle quote submission
    console.log("Quote submitted:", {
      amount: quoteAmount,
      message: personalizedMessage,
    });
    
    // Open success modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally redirect back to explore requests
    // router.push(ROUTES.PROFESSIONAL_EXPLORE_REQUESTS);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      {/* Main Content */}
      <Box  sx={{  mt: "3.375rem", mb:"2.688rem",px:"4.875rem"}}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon  sx={{
            color:"#424242"
          }}  />}
          onClick={() => router.back()}
          sx={{
          color: "#424242",
          fontWeight: 400,
          fontSize: "1rem", // 16px
          lineHeight: "140%",
          textTransform: "none",
          mb: "1.813rem",
          px: 0,
          minWidth: 0,
          "& .MuiButton-startIcon": {
            mr: "0.5rem",
          },
          "&:hover": {
            bgcolor: "transparent",
            color: "#2C6587",
          },
          }}
        >
          Back to All requests
        </Button>

        {/* Main Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
            gap: 4,
          }}
        >
          {/* Left Column - Images and Description */}
          <Box>
            {/* Image Carousel */}
            <Box
              sx={{
                position: "relative",
                borderRadius: "1.25rem",
                overflow: "hidden",
                mb: "1.5rem",
                bgcolor: "#F9FAFB",
                border: "0.0625rem solid #E5E7EB",
              }}
            >
              {/* Category Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "#2F6B8E",
                  color: "white",
                  px: 2,
                  py: "0.543rem",
                  borderRadius: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                gap: "12px",
                  zIndex: 2,
                }}
              >
                  <Image
                    src="/icons/Frame 2087326561.png"
                    alt="Business Icon"
                    width={22.25}
                    height={24}
                  />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 400,
                    fontSize: "1rem", // 16px
                    lineHeight: "140%",
                    letterSpacing: 0,
                  }}
                >
                  {requestData.category}
                </Typography>
              </Box>

              {/* Main Image */}
              <Box
                sx={{
                  position: "relative",
                  height: "31.563rem",
                  width: "100%",
                  bgcolor: "#F3F4F6",
                }}
              >
                <Image
                  src={requestData.images[currentImageIndex]}
                  alt={requestData.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>

              {/* Navigation Arrows */}
              <IconButton
                onClick={handlePreviousImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "45%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "45%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Box>

            {/* Thumbnail Images */}
            <Box sx={{ display: "flex", gap: "1.25rem", mb: "1.5rem" }}>
              {requestData.images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    position: "relative",
                    width: "10.422rem",
                    height: "7.867rem",
                    borderRadius: "0.656rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      currentImageIndex === index
                        ? "0.125rem solid #2F6B8E"
                        : "0.125rem solid #E5E7EB",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                      opacity: 0.9,
                    },
                  }}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>

            {/* Exchange Product and Quantity */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                mb: 4,
              }}
            >
              {/* Exchange Product */}
              <Box
                sx={{
                  border: "1px solid #E6E6E6",
                  borderRadius: "0.75rem", // 12px
                  p: "13px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  bgcolor: "white",
                }}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    fontWeight: 500,
                    fontSize: "1.125rem", // 18px
                    lineHeight: "100%",
                    letterSpacing: 0,
                  }}
                >
                  Exchange Product
                </Typography>
                <Typography
                  sx={{
                    color: "#0F232F",
                    fontWeight: 800,
                    fontSize: "1.6875rem", // 27px
                    lineHeight: "2rem", // 32px
                    letterSpacing: "0.03em",
                    textAlign: "left",
                  }}
                >
                  Shoes
                </Typography>
              </Box>

              {/* Quantity */}
              <Box
                sx={{
                  border: "1px solid #E6E6E6",
                  borderRadius: "0.75rem",
                  p: "13px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  bgcolor: "white",
                }}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    fontWeight: 500,
                    fontSize: "1.125rem", // 18px
                    lineHeight: "100%",
                    letterSpacing: 0,
                  }}
                >
                  Quantity
                </Typography>
                <Typography
                  sx={{
                    color: "#0F232F",
                    fontWeight: 800,
                    fontSize: "1.6875rem", // 27px
                    lineHeight: "2rem", // 32px
                    letterSpacing: "0.03em",
                    textAlign: "left",
                  }}
                >
                  2 Units
                </Typography>
              </Box>
            </Box>

            {/* Product Images */}
            <Box
              sx={{
                mb: 4,
                border: "1px solid #E6E6E6",
                borderRadius: "0.75rem", // 12px
                pt: "13px",
                pb: "13px",
                pl: "16px",
                pr: "16px",
                bgcolor: "white",
              }}
            >
              <Typography
                sx={{
                  color: "#555555",
                  fontWeight: 500,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1", // 100%
                  letterSpacing: 0,
                  mb: 3,
                }}
              >
                Product Images
              </Typography>
              <Box sx={{ display: "flex", gap: "12px" }}>
                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    height: 200,
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    border: "1px solid #E6E6E6",
                    bgcolor: "#FAFAFA",
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src="/image/main.png"
                      alt="Product 1"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    height: 200,
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    border: "1px solid #E6E6E6",
                    bgcolor: "#FAFAFA",
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src="/image/main.png"
                      alt="Product 2"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Service Description */}
            <Box sx={{ mb: 4, border: "0.0625rem solid #E5E7EB", borderRadius: 2, p: 2 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
                sx={{ color: "#1F2937", fontSize: "1.125rem" }}
              >
                Service description
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6B7280", lineHeight: 1.8, fontSize: "0.9rem" }}
              >
                {requestData.description}
              </Typography>
            </Box>

            {/* About Client */}
            <Box sx={{ mb: 4, border: "0.0625rem solid #E5E7EB", borderRadius: 2, p: 2 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
                sx={{ color: "#1F2937", mb: 2, fontSize: "1.125rem" }}
              >
                About client
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={requestData.clientAvatar}
                  alt={requestData.clientName}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography variant="body1" fontWeight="600" sx={{ color: "#1F2937" }}>
                  {requestData.clientName}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Request Details and Quote Form */}
          <Box>
            {/* Request Info Card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#F3F4F6",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h5" fontWeight="600" sx={{ color: "#2F6B8E" }}>
                  {requestData.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  {requestData.timeAgo}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon sx={{ fontSize: "1.2rem", color: "#6B7280" }} />
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    {requestData.serviceProvider}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: "1.2rem", color: "#6B7280" }} />
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    {requestData.date}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: "1.2rem", color: "#6B7280" }} />
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    {requestData.time}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: "1.2rem", color: "#6B7280", mt: 0.2 }} />
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    {requestData.location}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Quote Form */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "white",
              }}
            >
              {/* Enter Quote Amount */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  gutterBottom
                  sx={{ color: "#374151" }}
                >
                  Enter Quote Amount
                </Typography>
                <TextField
                  fullWidth
                  placeholder="€ 499.00"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Personalized Message */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  gutterBottom
                  sx={{ color: "#374151" }}
                >
                  Add personalized short message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description here..."
                  value={personalizedMessage}
                  onChange={(e) => setPersonalizedMessage(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Attach Supporting Documents */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  gutterBottom
                  sx={{ color: "#374151" }}
                >
                  Attach supporting documents
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderColor: "#D1D5DB",
                      color: "#6B7280",
                      textTransform: "none",
                      py: 2,
                      borderRadius: 2,
                      borderStyle: "dashed",
                      "&:hover": {
                        borderColor: "#2F6B8E",
                        bgcolor: "rgba(47, 107, 142, 0.04)",
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <CloudUploadIcon sx={{ fontSize: "2rem", mb: 0.5 }} />
                      <Typography variant="caption" display="block">
                        upload from device
                      </Typography>
                    </Box>
                    <input type="file" hidden multiple accept="image/*,.pdf" />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderColor: "#D1D5DB",
                      color: "#6B7280",
                      textTransform: "none",
                      py: 2,
                      borderRadius: 2,
                      borderStyle: "dashed",
                      "&:hover": {
                        borderColor: "#2F6B8E",
                        bgcolor: "rgba(47, 107, 142, 0.04)",
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <CloudUploadIcon sx={{ fontSize: "2rem", mb: 0.5 }} />
                      <Typography variant="caption" display="block">
                        upload from device
                      </Typography>
                    </Box>
                    <input type="file" hidden multiple accept="image/*,.pdf" />
                  </Button>
                </Box>
              </Box>

              {/* Upload Video */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  gutterBottom
                  sx={{ color: "#374151" }}
                >
                  Upload a short video (max 2 minutes)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                    textTransform: "none",
                    py: 3,
                    borderRadius: 2,
                    borderStyle: "dashed",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                      bgcolor: "rgba(47, 107, 142, 0.04)",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <VideocamIcon sx={{ fontSize: "2.5rem", mb: 0.5 }} />
                    <Typography variant="caption" display="block">
                      upload from device
                    </Typography>
                  </Box>
                  <input type="file" hidden accept="video/*" />
                </Button>
              </Box>

              {/* Submit Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitQuote}
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  textTransform: "none",
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                Submit Quote
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>



      {/* Quote Submitted Modal */}
      <QuoteSubmittedModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}
