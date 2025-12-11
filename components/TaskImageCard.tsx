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
    <Box
      sx={{
        borderRadius: "1.25rem",
        p: "1.25rem",
        overflow: "hidden",
        mb: "1.5rem",
        border: "0.0625rem solid #E5E7EB",
        boxShadow: "none",
        bgcolor: "#F9FAFB",
      }}
    >
      {/* Main Image */}
      <Box
        sx={{
          position: "relative",
          height: "15rem",
          width: "100%",
          borderRadius: "1.25rem",
          overflow: "hidden",
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
      <Box sx={{ mt:"0.75rem" }}>
        {/* Title */}
        <Typography
          fontWeight={700}
          sx={{
            mb: "1.5rem",
            color: "#2C6587",
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
            letterSpacing: 0,
          }}
        >
          {title}
        </Typography>

        {/* Details Grid */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            px: "1rem",
            py: "0.8125rem",
            display: "grid",
            border: "0.0625rem solid #E6E6E6",
            borderRadius: "0.75rem",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: "1rem",
          }}
        >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <Image
                    src="/icons/fi_6374086.png"
                    alt="Service"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {serviceProvider}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <Image
                    src="/icons/Calendar.png"
                    alt="Date"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {date}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <Image
                    src="/icons/Clock.png"
                    alt="Time"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {time}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <Image
                    src="/icons/MapPin.png"
                    alt="Location"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {location}
                  </Typography>
                </Box>
              </Box>
      </Box>
    </Box>
  );
}
