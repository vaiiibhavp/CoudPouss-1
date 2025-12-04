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
    <Box sx={{ minWidth: { xs: "18.75rem", sm: "20rem", md: "25rem" }, flexShrink: 0 }}>
      {/* Category Header */}
      <Box
        sx={{
          bgcolor: "#E5E7EB",
          borderRadius: "0.75rem 0.75rem 0 0",
          py: 1.5,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight="600"
          sx={{ color: "#2F6B8E" }}
        >
          {category}
        </Typography>
      </Box>

      {/* Card Content */}
      <Card
        sx={{
          borderRadius: "0 0 0.75rem 0.75rem",
          border: "0.0625rem solid #E5E7EB",
          borderTop: "none",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, p: 2.5, borderBottom: "0.0625rem solid #E5E7EB" }}>
          {/* Left Side - Task Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: "#2F6B8E", mb: 2 }}
            >
              {title}
            </Typography>

            {/* Date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"
                  fill="#2F6B8E"
                />
              </svg>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                {date}
              </Typography>
            </Box>

            {/* Time */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                  fill="#2F6B8E"
                />
              </svg>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
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
              color: "#2F6B8E",
              fontWeight: 600,
              fontSize: "0.9rem",
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
              color: "#2F6B8E",
              fontWeight: 600,
              fontSize: "0.9rem",
              "&:hover": {
                bgcolor: "#F3F4F6",
              },
            }}
          >
            Chat
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
