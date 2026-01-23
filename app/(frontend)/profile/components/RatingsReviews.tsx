"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface Review {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  summary: string;
  ctaLabel: string;
}

interface ApiReview {
  id?: string;
  review_id?: string;
  reviewer_name?: string;
  reviewerName?: string;
  name?: string;
  reviewer_avatar?: string;
  reviewerAvatar?: string;
  avatar?: string;
  profile_picture?: string;
  days_ago?: number;
  daysAgo?: number;
  time_ago?: string;
  timeAgo?: string;
  created_at?: string;
  createdAt?: string;
  rating?: number;
  review_rating?: number;
  review_text?: string;
  reviewText?: string;
  summary?: string;
  description?: string;
  service_name?: string;
  serviceName?: string;
  cta_label?: string;
  ctaLabel?: string;
  provider_id?: string;
  full_name?: string;
  profile_photo_url?: string;
  average_rating?: string;
  review_description?: string;
  expanded?: boolean;
}

interface RatingsReviewsApiResponse {
  message?: string;
  data?: {
    reviews?: ApiReview[];
    ratings_reviews?: ApiReview[];
    [key: string]: any; // Allow for flexible response structure
  };
  success?: boolean;
  status_code?: number;
}

// Helper function to calculate days ago from date string
const getDaysAgo = (dateString?: string): string => {
  if (!dateString) return "Recently";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  } catch {
    return "Recently";
  }
};

// Helper function to map API response to component format
const mapApiReviewToReview = (apiReview: ApiReview): Review => {
  const id = apiReview.provider_id || apiReview.id || apiReview.review_id || "";
  const name =
    apiReview.full_name ||
    apiReview.reviewerName ||
    apiReview.name ||
    "Anonymous";
  const avatar =
    apiReview.profile_photo_url ||
    apiReview.reviewerAvatar ||
    apiReview.avatar ||
    apiReview.profile_picture ||
    "/icons/testimonilas-1.png";

  let timeAgo: string = "Recently";
  if (apiReview.time_ago || apiReview.timeAgo) {
    timeAgo = apiReview.time_ago || apiReview.timeAgo || "Recently";
  } else if (apiReview.days_ago !== undefined) {
    timeAgo =
      apiReview.days_ago === 1 ? "1 day ago" : `${apiReview.days_ago} days ago`;
  } else if (apiReview.created_at || apiReview.createdAt) {
    timeAgo = getDaysAgo(apiReview.created_at || apiReview.createdAt);
  }

  const rating = apiReview.average_rating || apiReview.review_rating || 5;
  const summary =
    apiReview.review_description ||
    apiReview.reviewText ||
    apiReview.summary ||
    apiReview.description ||
    "";
  const ctaLabel =
    apiReview.cta_label ||
    apiReview.ctaLabel ||
    apiReview.service_name ||
    apiReview.serviceName ||
    "See Full Review";

  return {
    id,
    name,
    avatar,
    timeAgo,
    rating: Math.min(5, Math.max(1, Number(rating))), // Ensure rating is between 1-5
    summary,
    ctaLabel,
  };
};

const renderRating = (rating: number) => {
  const rounded = Math.round(rating);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          sx={{
            fontSize: "1rem",
            color: index < rounded ? "#FBBF24" : "grey.300",
          }}
        />
      ))}
    </Box>
  );
};

export default function RatingsReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("reviews", reviews);

  const fetchRatingsReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = `${API_ENDPOINTS.PROFILE.USER_PROFILE}?section=ratings_reviews`;
      const response = await apiGet<RatingsReviewsApiResponse>(endpoint);

      if (response.success && response.data) {
        // Handle nested data structure: response.data.data contains the actual data
        const apiData = (response.data.data || response.data) as any;
        console.log({ apiData });
        // Handle different possible response structures
        const apiReviews: ApiReview[] = apiData?.results || [];

        if (Array.isArray(apiReviews) && apiReviews.length > 0) {
          const mappedReviews = apiReviews.map(mapApiReviewToReview);
          setReviews(mappedReviews);
        } else {
          setReviews([]);
        }
      } else {
        setError("Failed to load reviews");
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching ratings and reviews:", err);
      setError("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRatingsReviews();
  }, [fetchRatingsReviews]);

  return (
    <Box
      sx={{
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
      ></Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Typography sx={{ color: "error.main" }}>{error}</Typography>
        </Box>
      ) : reviews.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Typography sx={{ color: "text.secondary" }}>
            No reviews available
          </Typography>
        </Box>
      ) : (
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
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  color: "#131313",
                  display: "-webkit-box",
                  WebkitLineClamp: expandedReviews[review.id] ? "unset" : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {review.summary
                  ? review.summary
                  : "No review description provided."}
              </Typography>

              {review.summary.length > 120 && (
                <Typography
                  onClick={() => toggleExpand(review.id)}
                  sx={{
                    fontSize: "0.6875rem",
                    lineHeight: "1rem",
                    color: "#436A00",
                    cursor: "pointer",
                    width: "fit-content",
                    fontWeight: 500,
                  }}
                >
                  {expandedReviews[review.id] ? "Show less" : "See full review"}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <ThumbDownOffAltIcon fontSize="small" />
                    ###
                  </IconButton>
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <ThumbUpOffAltIcon fontSize="small" />
                    ###
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
