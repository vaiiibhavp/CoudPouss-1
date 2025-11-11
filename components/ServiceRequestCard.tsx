"use client";

import React from "react";
import Image from "next/image";
import { Box, Card, Typography, Button, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";

interface ServiceRequestCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  serviceProvider: string;
  location: string;
  estimatedCost: string;
  timeAgo: string;
}

export default function ServiceRequestCard({
  title,
  image,
  date,
  time,
  serviceProvider,
  location,
  estimatedCost,
  timeAgo,
}: ServiceRequestCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#F3F4F6",
        boxShadow: "none",
        border: "1px solid #E5E7EB",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          height: 180,
          width: "100%",
          bgcolor: "#E5E7EB",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2.5 }}>
        {/* Title and Time Ago */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#2F6B8E",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#6B7280",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            {timeAgo}
          </Typography>
        </Box>

        {/* Details Grid */}
        <Box sx={{ mb: 2.5 }}>
          {/* Date and Time Row */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarTodayIcon
                sx={{ fontSize: "1rem", color: "#6B7280" }}
              />
              <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.875rem" }}>
                {date}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AccessTimeIcon sx={{ fontSize: "1rem", color: "#6B7280" }} />
              <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.875rem" }}>
                {time}
              </Typography>
            </Box>
          </Box>

          {/* Service Provider and Location Row */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <PeopleIcon sx={{ fontSize: "1rem", color: "#6B7280" }} />
              <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.875rem" }}>
                {serviceProvider}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <LocationOnIcon sx={{ fontSize: "1rem", color: "#6B7280" }} />
              <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.875rem" }}>
                {location}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Price and Quote Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#6B7280",
                fontSize: "0.75rem",
                display: "block",
                mb: 0.25,
              }}
            >
              Estimated Cost
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#2F6B8E",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              {estimatedCost}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2F6B8E",
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: "0.9rem",
              "&:hover": {
                bgcolor: "#25608A",
              },
            }}
          >
            Quote
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
