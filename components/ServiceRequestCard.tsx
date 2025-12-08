"use client";

import React from "react";
import Image from "next/image";
import { Box, Card, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter } from "next/navigation";

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
  id,
  title,
  image,
  date,
  time,
  location,
  estimatedCost,
  timeAgo,
}: ServiceRequestCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/professional/request-view/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "white",
        boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.08)",
        border: "0.0625rem solid #E5E7EB",
        transition: "all 0.3s ease",
        cursor: "pointer",
        maxWidth: 320,
        "&:hover": {
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.12)",
          transform: "translateY(-0.25rem)",
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          height: 200,
          width: "100%",
          bgcolor: "#E5E7EB",
        }}
      >
        {/* Category Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "#2F6B8E",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            zIndex: 2,
          }}
        >
          <PeopleIcon sx={{ fontSize: "0.9rem" }} />
          <Typography variant="caption" fontWeight="600" sx={{ fontSize: "0.75rem" }}>
            DIY
          </Typography>
        </Box>
        
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
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
              fontSize: "1.125rem",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#9CA3AF",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            {timeAgo}
          </Typography>
        </Box>

        {/* Details */}
        <Box sx={{ mb: 2.5 }}>
          {/* Date and Time */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
            <AccessTimeIcon sx={{ fontSize: "1.1rem", color: "#1F2937" }} />
            <Typography variant="body2" sx={{ color: "#1F2937", fontSize: "0.875rem" }}>
              {date}, {time}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
            <LocationOnIcon sx={{ fontSize: "1.1rem", color: "#1F2937", mt: 0.1 }} />
            <Typography variant="body2" sx={{ color: "#1F2937", fontSize: "0.875rem", lineHeight: 1.5 }}>
              {location}
            </Typography>
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
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/professional/request-view/${id}`);
            }}
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
