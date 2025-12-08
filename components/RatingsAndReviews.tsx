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
        p: 4,
        bgcolor: "white",
        borderRadius: 2,
        border: "0.0625rem solid #E5E7EB",
        boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
        width: "100%",
        minHeight: "calc(100vh - 18.75rem)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#2F6B8E", mb: 3 }}
      >
        Recent works reviews
      </Typography>

      {/* Reviews Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 3,
        }}
      >
        {reviews.map((review) => (
          <Card
            key={review.id}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "0.0625rem solid #E5E7EB",
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
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{ color: "#1F2937" }}
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
              variant="body2"
              sx={{
                color: "#374151",
                mb: 1.5,
                lineHeight: 1.6,
              }}
            >
              {expandedReviews.has(review.id)
                ? review.fullReviewText
                : review.reviewText}
            </Typography>

            {/* Service Name / Read More Link */}
            <Typography
              variant="body2"
              onClick={() => toggleExpand(review.id)}
              sx={{
                color: "#10B981",
                fontWeight: "500",
                mb: 2,
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
                pt: 1,
                borderTop: "0.0625rem solid #F3F4F6",
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
          </Card>
        ))}
      </Box>
    </Box>
  );
}
