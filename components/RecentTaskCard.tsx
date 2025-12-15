"use client";

import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import Image from "next/image";

interface RecentTaskCardProps {
  title: string;
  image: string;
  date: string;
  time: string;
  category: string;
  onTaskStatusClick?: () => void;
  onChatClick?: () => void;
}

export default function RecentTaskCard({
  title,
  image,
  date,
  time,
  category,
  onTaskStatusClick,
  onChatClick,
}: RecentTaskCardProps) {
  return (
    <Box
      sx={{
        minWidth: { xs: "18.75rem", sm: "20rem", md: "25.813rem" },
        flexShrink: 0,
        borderRadius: "1.5rem",
        overflow: "hidden",
        border: "1px solid #F2F2F2",
      }}
    >
      {/* Category Header */}
      <Box
        sx={{
          bgcolor: "#F2F2F2",
          py: "0.875rem",
          px: 2,
          textAlign: "center",
        }}
      >
      <Typography
        fontWeight={600}
        sx={{
          color: "#214C65",
          fontSize: "1.125rem", // 18px
          lineHeight: "1.25rem", // 20px
          letterSpacing: "0rem",
          textAlign: "center",
        }}
      >
        {category}
      </Typography>
      </Box>

      {/* Card Content */}
      <Box
        sx={{
          borderRadius: "0 0 0.75rem 0.75rem",
          borderTop: "none",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2.5,
            borderBottom: "0.0625rem solid #E5E7EB",
          }}
        >
          {/* Left Side - Task Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#2C6587",
                fontWeight: 600,
                fontSize: "1.375rem", // 22px
                lineHeight: "1.875rem", // 30px
                letterSpacing: "0rem",
                textTransform: "capitalize",
                mb: 2,
              }}
            >
              {title}
            </Typography>

            {/* Date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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
                  color: "#2C6587",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  color: "#2C6587",
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1.125rem", // 18px
                  fontWeight: 500,
                  letterSpacing: "0rem",
                }}
              >
                {time}
              </Typography>
            </Box>
          </Box>

          {/* Right Side - Image */}
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 80,
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            variant="text"
            fullWidth
            onClick={onTaskStatusClick}
            sx={{
              borderRadius: 0,
              borderRight: "0.0625rem solid #E5E7EB",
              textTransform: "none",
              color: "#2C6587",
              fontWeight: 600,
              fontSize: "0.875rem", // 14px
              lineHeight: "1rem", // 16px
              letterSpacing: "0rem",
              textAlign: "right",
              py:"1rem",
              "&:hover": {
                bgcolor: "#F3F4F6",
              },
            }}
          >
            Task Status
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={onChatClick}
            sx={{
              borderRadius: 0,
              textTransform: "none",
              color: "#2C6587",
              fontWeight: 600,
              fontSize: "0.875rem", // 14px
              lineHeight: "1rem", // 16px
              letterSpacing: "0rem",
              textAlign: "right",
              "&:hover": {
                bgcolor: "#F3F4F6",
              },
            }}
          >
            Chat
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
