"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function RatingsAndReviews() {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set()
  );

  const { fullUserProfile } = useSelector((state: RootState) => state.auth);
  const reviews = fullUserProfile?.recent_reviews || [];


  console.log({ fullUserProfile })

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

  if (!reviews || reviews.length === 0) {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "white",
          width: "100%",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography sx={{ color: "text.secondary" }}>No reviews yet.</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 2, sm: 3, md: 4 },
        pt: 0,
        bgcolor: "white",
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
        borderRadius: "0.75rem",
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
        {reviews.map((review, index) => {
          // Determine if we should show "Read More"
          const isLongReview = review.review.length > 100;
          // Use index or user_id as key, ideally review should have a unique ID. 
          // The API provides user_id, which might be same if same user reviews multiple times?
          // Let's use user_id + index to be safe.
          const uniqueKey = `${review.user_id}-${index}`;

          return (
            <Box
              key={uniqueKey}
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
                    src={review.profile_photo_url || "/icons/testimonilas-1.png"}
                    alt={review.name}
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
                      {review.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#9CA3AF", fontSize: "0.75rem" }}
                    >
                      {review.days_ago} days ago
                    </Typography>
                  </Box>
                </Box>

                {/* Rating Stars */}
                <Box sx={{ display: "flex", gap: 0.25 }}>
                  {[...Array(5)].map((_, starIndex) => (
                    <StarIcon
                      key={starIndex}
                      sx={{
                        color:
                          starIndex < Math.round(review.rating)
                            ? "#FCD34D"
                            : "#E0E0E0",
                        fontSize: "1.25rem",
                      }}
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
                {expandedReviews.has(uniqueKey)
                  ? review.review
                  : isLongReview
                    ? `${review.review.substring(0, 100)}...`
                    : review.review}
              </Typography>

              {/* Read More Link */}
              {isLongReview && (
                <Typography
                  onClick={() => toggleExpand(uniqueKey)}
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
                    display: "inline-block", // improved layout
                    mt: 0.5
                  }}
                >
                  {expandedReviews.has(uniqueKey) ? "Show Less" : "See Full Review"}
                </Typography>
              )}



              {/* Action Icons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent"
                      },
                    }}
                  >
                    <Image
                      src="/icons/ThumbsDown.png"
                      alt="Dislike"
                      width={64}
                      height={64}
                      style={{
                        height: "16px",
                        width: "16px",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{ color: "#707D85", fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    ###
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent"
                      },
                    }}
                  >
                    <Image
                      src="/icons/ThumbsUp.png"
                      alt="Like"
                      width={64}
                      height={64}
                      style={{
                        height: "16px",
                        width: "16px",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{ color: "#707D85", fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    ###
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  );
}
