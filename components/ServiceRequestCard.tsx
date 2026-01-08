"use client";

import React from "react";
import Image from "next/image";
import { Box, Card, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter } from "next/navigation";

interface ServiceRequestCardProps {
  id: number | string;
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
  serviceProvider,
  location,
  estimatedCost,
  timeAgo,
}: ServiceRequestCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/professional/request-view/${id}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        borderRadius: "1.25rem", // 20px
        bgcolor: "#EAF0F3",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem", // 16px
        p: "1rem", // 16px
        transition: "all 0.3s ease",
        cursor: "pointer",
        minWidth: "22.109rem",
        "&:hover": {
          transform: "translateY(-0.25rem)",
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          height: "10.188rem",
          width: "100%",
          bgcolor: "#E5E7EB",
          borderRadius: "1.25rem",
          overflow: "hidden",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
        />
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 0 }}>
        {/* Title and Time Ago */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "1rem",
          }}
        >
          <Typography
            sx={{
              color: "#2C6587",
              fontWeight: 700,
              fontSize: "1.5rem", // 24px
              lineHeight: "1.75rem", // 28px
              letterSpacing: "0rem",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: "#737373",
              fontSize: "0.875rem", // 14px
              lineHeight: "1.125rem", // 18px
              fontWeight: 500,
              letterSpacing: "0rem",
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            {timeAgo}
          </Typography>
        </Box>

        {/* Details */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            columnGap: "1rem",
            rowGap: "0.75rem",
            mb: 2.5,
          }}
        >
          {/* Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box
              component="img"
              src="/icons/calendar.png"
              alt="Date"
              width={24}
              height={24}
              loading="lazy"
            />
            <Typography
              sx={{
                color: "#424242",
                fontSize: "0.875rem", // 14px
                lineHeight: "1.125rem", // 18px
                fontWeight: 500,
                letterSpacing: "0rem",
              }}
            >
              {date}
            </Typography>
          </Box>

          {/* Time */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box
              component="img"
              src="/icons/Clock.png"
              alt="Time"
              width={24}
              height={24}
              loading="lazy"
            />
            <Typography
              sx={{
                color: "#424242",
                fontSize: "0.875rem",
                lineHeight: "1.125rem",
                fontWeight: 500,
                letterSpacing: "0rem",
              }}
            >
              {time}
            </Typography>
          </Box>

          {/* Service Provider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box
              component="img"
              src="/icons/fi_6374086.png"
              alt="Service Provider"
              width={24}
              height={24}
              loading="lazy"
            />
            <Typography
              sx={{
                color: "#424242",
                fontSize: "0.875rem",
                lineHeight: "1.125rem",
                fontWeight: 500,
                letterSpacing: "0rem",
              }}
            >
              {serviceProvider}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box
              component="img"
              src="/icons/MapPin.png"
              alt="Location"
              width={24}
              height={24}
              loading="lazy"
            />
            <Typography
              sx={{
                color: "#424242",
                fontSize: "0.875rem",
                lineHeight: "1.125rem",
                fontWeight: 500,
                letterSpacing: "0rem",
              }}
            >
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
              sx={{
                color: "#424242",
                fontSize: "0.875rem", // 14px
                lineHeight: "1.125rem", // 18px
                fontWeight: 500,
                letterSpacing: "0rem",
                display: "block",
                mb: 0.25,
              }}
            >
              Estimated Cost
            </Typography>
            <Typography
              sx={{
                color: "#2C6587",
                fontWeight: 800,
                fontSize: "1.6875rem", // 27px
                lineHeight: "2rem", // 32px
                letterSpacing: "0.03em", // 3%
                textAlign: "left",
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
              bgcolor: "#214C65",
              color: "#FFFFFF",
              textTransform: "none",
              borderRadius: "0.75rem", // 12px
              px: "3.75rem", // 60px
              py: "0.625rem", // 10px
              fontWeight: 600,
              fontSize: "1rem", // 16px
              lineHeight: 1.5, // 150%
              letterSpacing: "0rem",
              "&:hover": {
                bgcolor: "#1C4358",
              },
            }}
          >
            Quote
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
