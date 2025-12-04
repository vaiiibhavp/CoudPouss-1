"use client";

import React from "react";
import { Box, Typography, Button, Card, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TaskImageCard from "@/components/TaskImageCard";

interface QuoteSentData {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  serviceStatus: string;
  statusDate: string;
  waitingStatus: string;
  description: string;
  jobPhotos: string[];
}

interface QuoteSentSectionProps {
  data: QuoteSentData;
}

export default function QuoteSentSection({ data }: QuoteSentSectionProps) {
  const router = useRouter();

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
            color: "primary.main",
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
        {/* Left Column - Image and Description */}
        <Box>
          {/* Task Image Card */}
          <TaskImageCard
            image={data.image}
            title={data.title}
            date={data.date}
            time={data.time}
            serviceProvider="DIY Services"
            location={data.location}
          />

          {/* Service Description */}
          <Box sx={{ mb: 3 }}>
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
              sx={{ color: "#6B7280", lineHeight: 1.8 }}
            >
              {data.description}
            </Typography>
          </Box>

          {/* Job Photos */}
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", fontSize: "1.125rem", mb: 2 }}
            >
              Job photos
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {data.jobPhotos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "0.0625rem solid #E5E7EB",
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
          </Box>
        </Box>

        {/* Right Column - Client Info and Status */}
        <Box>
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={data.clientAvatar}
                  alt={data.clientName}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography variant="body1" fontWeight="600">
                  {data.clientName}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2F6B8E",
                  color: "white",
                  textTransform: "none",
                  py: 1,
                  width: "fit-content",
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

            {/* Chat Button */}
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
            {/* Quote Sent Status */}
            <Box sx={{ mb: 3, position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: "1.1rem", color: "white" }}
                  />
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
                    {data.serviceStatus}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                    {data.statusDate}
                  </Typography>
                </Box>
              </Box>
              {/* Connector Line */}
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
            </Box>

            {/* Waiting Status */}
            <Box sx={{ mb: 3, position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#4B5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: "white" }}
                  >
                    2
                  </Typography>
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
                    {data.waitingStatus}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                    Pending
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
