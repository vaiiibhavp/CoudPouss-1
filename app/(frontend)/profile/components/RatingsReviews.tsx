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
          width: "1rem",
          height: "1rem",
          fontSize: "1rem",
          color: index < count ? "#FBBF24" : "grey.300",
        }}
      />
    ))}
  </Box>
);

export default function RatingsReviews() {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 3,
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
     
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: "0.5rem",
        }}
      >
        {reviews.map((review) => (
          <Box
            key={review.id}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "0.0625rem solid #D5D5D5",
              borderRadius: "0.5rem",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={review.avatar}
                alt={review.name}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#131313",
                    mb: 0.5,
                  }}
                >
                  {review.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "0.6875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#707D85",
                  }}
                >
                  {review.timeAgo}
                </Typography>
              </Box>
              {renderRating(review.rating)}
            </Box>

            <Typography
              sx={{
                fontWeight: 400,
                fontStyle: "regular",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
                color: "#131313",
              }}
            >
              {review.summary}
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                fontStyle: "regular",
                fontSize: "0.6875rem",
                lineHeight: "1rem",
                letterSpacing: "0%",
                color: "#436A00",
                cursor: "pointer",
              }}
            >
              {review.ctaLabel}
            </Typography>


            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <ThumbUpOffAltIcon fontSize="small" />
                  ###
                </IconButton>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <ThumbDownOffAltIcon fontSize="small" />
                  ###
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


