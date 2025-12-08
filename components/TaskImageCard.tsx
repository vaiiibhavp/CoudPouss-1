"use client";

import React from "react";
import { Box, Card, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import Image from "next/image";

interface TaskImageCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
  serviceProvider: string;
  location: string;
}

export default function TaskImageCard({
  image,
  title,
  date,
  time,
  serviceProvider,
  location,
}: TaskImageCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
        border: "0.0625rem solid #E5E7EB",
        boxShadow: "none",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* Main Image */}
      <Box
        sx={{
          position: "relative",
          height: 240,
          width: "100%",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>

      {/* Card Content */}
      <Box sx={{ p: 3 }}>
        {/* Title */}
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ mb: 3, color: "#2F6B8E" }}
        >
          {title}
        </Typography>

        {/* Details Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {/* Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: "1.2rem", color: "#2F6B8E" }} />
            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
              {date}
            </Typography>
          </Box>

          {/* Time */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: "1.2rem", color: "#2F6B8E" }} />
            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
              {time}
            </Typography>
          </Box>

          {/* Service Provider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon sx={{ fontSize: "1.2rem", color: "#2F6B8E" }} />
            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
              {serviceProvider}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: "1.2rem", color: "#2F6B8E" }} />
            <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500 }}>
              {location}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
