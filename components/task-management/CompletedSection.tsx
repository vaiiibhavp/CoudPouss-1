"use client";

import React from "react";
import { Box, Typography, Button, Card, Avatar, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TaskImageCard from "@/components/TaskImageCard";

interface CompletedData {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  finalizedQuoteAmount: string;
  securityCode: string[];
  description: string;
  jobPhotos: string[];
  paymentBreakdown: {
    finalizedQuoteAmount: string;
    platformFee: string;
    taxes: string;
    total: string;
  };
  serviceTimeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
  review: {
    clientName: string;
    clientAvatar: string;
    rating: number;
    comment: string;
  };
}

interface CompletedSectionProps {
  data?: CompletedData;
}

export default function CompletedSection({ data }: CompletedSectionProps) {
  const router = useRouter();

  // Mock data if not provided
  const completedData: CompletedData = data || {
    id: 1,
    title: "Furniture Assembly",
    image: "/image/main.png",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "Paris 75001",
    clientName: "Wade Warren",
    clientAvatar: "/image/main.png",
    clientPhone: "+91 7222201100",
    finalizedQuoteAmount: "€499",
    securityCode: ["3", "2", "5", "5", "5", "8"],
    description:
      "Transform your space with our expert furniture assembly services. Our skilled team will handle everything from unpacking to setup, ensuring your new pieces are perfectly assembled and ready for use. We specialize in a wide range of furniture types, including flat-pack items, complete modular systems, and custom installations. Enjoy a hassle-free experience with professional assembly that saves you time and effort in your newly furnished area. Schedule your assembly today and let us help you create the perfect environment!",
    jobPhotos: ["/image/main.png", "/image/main.png"],
    paymentBreakdown: {
      finalizedQuoteAmount: "€499",
      platformFee: "€74.85",
      taxes: "€12.0",
      total: "€340.00",
    },
    serviceTimeline: [
      { status: "Quote Sent", date: "Wed, 16 Jan' 2025 - 7:07pm", completed: true },
      { status: "Quote Accepted", date: "Wed, 16 Jan' 2025 - 7:07pm", completed: true },
      { status: "Out for Service", date: "Wed, 18 Jan' 2025 - 7:07pm", completed: true },
      { status: "Started Service", date: "Wed, 18 Jan' 2025 - 7:07pm", completed: true },
      { status: "Renegotiated the amount", date: "Wed, 18 Jan' 2025 - 7:07pm", completed: true },
      { status: "Service Completed", date: "Wed, 18 Jan' 2025 - 7:07pm", completed: true },
      { status: "Payment Received", date: "Wed, 18 Jan' 2025 - 7:07pm", completed: true },
    ],
    review: {
      clientName: "Wade Warren",
      clientAvatar: "/image/main.png",
      rating: 4,
      comment:
        "I was thoroughly impressed with the furniture assembly service provided by this team. Their punctuality, professionalism, and incredible efficiency. They handled my new furniture with care and ensured everything was set up perfectly. I couldn't be happier with the results. I highly recommend their services to anyone in need of expert furniture assembly.",
    },
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(ROUTES.PROFESSIONAL_EXPLORE_REQUESTS)}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          mb: 3,
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
      >
        Back to All requests
      </Button>

      {/* Main Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* Left Column */}
        <Box>
          {/* Task Image Card */}
          <TaskImageCard
            image={completedData.image}
            title={completedData.title}
            date={completedData.date}
            time={completedData.time}
            serviceProvider="DIY Services"
            location={completedData.location}
          />

          {/* Service Description */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Service description
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", lineHeight: 1.8, textAlign: "justify" }}
            >
              {completedData.description}
            </Typography>
          </Card>

          {/* Job Photos */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Job photos
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {completedData.jobPhotos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 180,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={photo}
                    alt={`Job photo ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Payment Breakdown */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Payment Breakdown
            </Typography>
            <Box sx={{ bgcolor: "#F9FAFB", p: 2, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Finalized Quote Amount
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {completedData.paymentBreakdown.finalizedQuoteAmount}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Platform Fee (15%)
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {completedData.paymentBreakdown.platformFee}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Taxes
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {completedData.paymentBreakdown.taxes}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderTop: "0.0625rem dashed #D1D5DB",
                  pt: 2,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ color: "#2F6B8E" }}
                >
                  {completedData.paymentBreakdown.total}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Client Review */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={completedData.review.clientAvatar}
                alt={completedData.review.clientName}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="600">
                  {completedData.review.clientName}
                </Typography>
                <Rating
                  value={completedData.review.rating}
                  readOnly
                  size="small"
                  sx={{ color: "#FCD34D" }}
                />
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", lineHeight: 1.8, textAlign: "justify" }}
            >
              {completedData.review.comment}
            </Typography>
          </Card>
        </Box>

        {/* Right Column */}
        <Box>
          {/* Finalized Quote Amount */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Finalized Quote Amount
            </Typography>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "#2F6B8E", mb: 3 }}
            >
              {completedData.finalizedQuoteAmount}
            </Typography>
          </Card>

          {/* Security Code */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Security Code
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {completedData.securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    borderRadius: 2,
                    bgcolor: "#F3F4F6",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="500"
                    sx={{ color: "#1F2937" }}
                  >
                    {digit}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Note: Final 3 digits will be given to you on service date
            </Typography>
          </Card>

          {/* About Client Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              About client
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={completedData.clientAvatar}
                  alt={completedData.clientName}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                    {completedData.clientName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                        fill="#6B7280"
                      />
                    </svg>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {completedData.clientPhone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Chat Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  textTransform: "none",
                  py: 1.25,
                  px: 3,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                Chat
              </Button>
            </Box>
          </Card>

          {/* Address Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Address
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <LocationOnIcon
                sx={{ fontSize: "1.2rem", color: "#6B7280", mt: 0.2 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#374151", lineHeight: 1.6 }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Card>

          {/* Service Status Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 3 }}
            >
              Service Status
            </Typography>

            {/* Timeline */}
            {completedData.serviceTimeline.map((item, index) => (
              <Box key={index} sx={{ mb: 3, position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: item.completed ? "#10B981" : "#4B5563",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.completed ? (
                      <CheckCircleIcon
                        sx={{ fontSize: "1.1rem", color: "white" }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ color: "white" }}
                      >
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{
                        color: "#1F2937",
                        mb: 0.5,
                      }}
                    >
                      {item.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                      {item.date}
                    </Typography>
                  </Box>
                </Box>
                {index < completedData.serviceTimeline.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 13.5,
                      top: 36,
                      width: "0.5%",
                      height: 40,
                      bgcolor: "#E5E7EB",
                    }}
                  />
                )}
              </Box>
            ))}
          </Card>

          {/* Information Message */}
          <Box
            sx={{
              mt: 4,
              p: 2.5,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="#F59E0B"
                  />
                </svg>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                  Information message:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.6, fontSize: "0.8rem" }}
                >
                  CoudPouss does not guarantee the quality of services exchanged
                  from this point onward. Our role is to connect you with
                  professionals and secure your transactions through escrow. All
                  providers on our platform issue their own invoices directly to
                  clients. Once you provide the validation code to your provider,
                  you must request an invoice or receipt from them for your
                  payment.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
