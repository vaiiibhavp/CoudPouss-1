"use client";

import React from "react";
import {
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

const reviews = [
  {
    id: "1",
    name: "Reviewer Name",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 5,
    summary:
      "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for future projects.",
    ctaLabel: "See Full Review",
  },
  {
    id: "2",
    name: "Reviewer Name",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 5,
    summary:
      "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for future projects.",
    ctaLabel: "See Full Review",
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 4,
    summary:
      "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
    ctaLabel: "Show Less",
  },
  {
    id: "4",
    name: "Alice Johnson",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 4,
    summary:
      "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
    ctaLabel: "Show Less",
  },
  {
    id: "5",
    name: "John Smith",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 5,
    summary:
      "A fantastic experience from start to finish. The team was communicative and delivered on time.",
    ctaLabel: "Read More",
  },
  {
    id: "6",
    name: "John Smith",
    avatar: "/icons/testimonilas-1.png",
    timeAgo: "2 days ago",
    rating: 5,
    summary:
      "A fantastic experience from start to finish. The team was communicative and delivered on time.",
    ctaLabel: "Read More",
  },
];

const renderRating = (count: number) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        sx={{
          fontSize: "1rem",
          color: index < count ? "#FBBF24" : "grey.300",
        }}
      />
    ))}
  </Box>
);

export default function RatingsReviews() {
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#2F6B8E", fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          Ratings & Reviews
        </Typography>
        <Chip
          label="4.7 Overall"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
            px: 1.5,
            py: 2,
            borderRadius: 2,
          }}
          icon={<StarIcon sx={{ color: "#FBBF24" }} />}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {reviews.map((review) => (
          <Card
            key={review.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={review.avatar}
                alt={review.name}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "text.primary", mb: 0.5 }}
                >
                  {review.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {review.timeAgo}
                </Typography>
              </Box>
              {renderRating(review.rating)}
            </Box>

            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6 }}
            >
              {review.summary}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#2F6B8E", fontWeight: 600, cursor: "pointer" }}
            >
              {review.ctaLabel}
            </Typography>

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <ThumbUpOffAltIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <ThumbDownOffAltIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Card>
  );
}


