"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  daysAgo: number;
  rating: number;
  reviewText: string;
  fullReviewText: string;
  serviceName: string;
}

export default function RatingsAndReviews() {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set()
  );

  const reviews: Review[] = [
    {
      id: "1",
      reviewerName: "Reviewer Name",
      reviewerAvatar: "/icons/testimonilas-1.png",
      daysAgo: 2,
      rating: 3,
      reviewText:
        "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for futu...",
      fullReviewText:
        "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for future projects. They were professional, timely, and delivered exactly what was promised.",
      serviceName: "See Full Review",
    },
    {
      id: "2",
      reviewerName: "Alice Johnson",
      reviewerAvatar: "/icons/testimonilas-2.png",
      daysAgo: 3,
      rating: 3,
      reviewText:
        "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
      fullReviewText:
        "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
      serviceName: "Snow Lock",
    },
    {
      id: "3",
      reviewerName: "John Smith",
      reviewerAvatar: "/icons/testimonilas-3.png",
      daysAgo: 5,
      rating: 3,
      reviewText:
        "A fantastic experience from start to finish. The team was communicative and delivered on time.",
      fullReviewText:
        "A fantastic experience from start to finish. The team was communicative and delivered on time.",
      serviceName: "Read More",
    },
    {
      id: "4",
      reviewerName: "Reviewer Name",
      reviewerAvatar: "/icons/testimonilas-1.png",
      daysAgo: 2,
      rating: 3,
      reviewText:
        "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for futu...",
      fullReviewText:
        "This project exceeded my expectations! The attention to detail and the quality of work was outstanding. I highly recommend this team for future projects.",
      serviceName: "See Full Review",
    },
    {
      id: "5",
      reviewerName: "Alice Johnson",
      reviewerAvatar: "/icons/testimonilas-2.png",
      daysAgo: 3,
      rating: 3,
      reviewText:
        "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
      fullReviewText:
        "The service was prompt and professional. I was very pleased with the outcome and would definitely work with them again.",
      serviceName: "Snow Lock",
    },
    {
      id: "6",
      reviewerName: "John Smith",
      reviewerAvatar: "/icons/testimonilas-3.png",
      daysAgo: 5,
      rating: 3,
      reviewText:
        "A fantastic experience from start to finish. The team was communicative and delivered on time.",
      fullReviewText:
        "A fantastic experience from start to finish. The team was communicative and delivered on time.",
      serviceName: "Read More",
    },
  ];

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "white",
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "28px",
          letterSpacing: "0%",
          color: "#2C6587",
          mb: 3,
        }}
      >
        Recent works reviews
      </Typography>

      {/* Reviews Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: "16px",
        }}
      >
        {reviews.map((review) => (
          <Box
            key={review.id}
            sx={{
              p: "16px",
              borderRadius: "8px",
              border: "1px solid #D5D5D5",
              bgcolor: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
              },
            }}
          >
            {/* Reviewer Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Avatar
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                  sx={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "15px",
                      lineHeight: "18px",
                      letterSpacing: "0%",
                      color: "#1B1B1B",
                    }}
                  >
                    {review.reviewerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#9CA3AF", fontSize: "0.75rem" }}
                  >
                    {review.daysAgo} days ago
                  </Typography>
                </Box>
              </Box>

              {/* Rating Stars */}
              <Box sx={{ display: "flex", gap: 0.25 }}>
                {[...Array(review.rating)].map((_, index) => (
                  <StarIcon
                    key={index}
                    sx={{ color: "#FCD34D", fontSize: "1.25rem" }}
                  />
                ))}
              </Box>
            </Box>

            {/* Review Text */}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0%",
                color: "#1B1B1B",
                mb: 1.5,
              }}
            >
              {expandedReviews.has(review.id)
                ? review.fullReviewText
                : review.reviewText}
            </Typography>

            {/* Service Name / Read More Link */}
            <Typography
              onClick={() => toggleExpand(review.id)}
              sx={{
                fontWeight: 400,
                fontSize: "11px",
                lineHeight: "16px",
                letterSpacing: "0%",
                color: "#436A00",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {review.serviceName}
            </Typography>

            {/* Action Icons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "#9CA3AF",
                    "&:hover": {
                      color: "#2F6B8E",
                    },
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: "#9CA3AF", fontSize: "0.75rem" }}
                >
                  Reply
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "#9CA3AF",
                    "&:hover": {
                      color: "#2F6B8E",
                    },
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: "#9CA3AF", fontSize: "0.75rem" }}
                >
                  Reply
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
