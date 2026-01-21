"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditProfile from "./EditProfile";
import { UseSelector } from "react-redux";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface UserData {
  id: string;
  email: string;
  phone_number: string;
  password: string;
  address: string;
  longitude: number | null;
  created_at: string;
  lang: string;
  first_name: string;
  phone_country_code: string;
  last_name: string;
  role: string;
  service_provider_type: string | null;
  profile_photo_id: string | null;
  profile_photo_url: string | null;
  latitude: number | null;
  is_deleted: boolean;
  updated_at: string;
  year_of_experience?: number;
}

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
  };
}

export default function ProfileOverview() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem("role");

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<GetUserApiResponse>(
        API_ENDPOINTS.AUTH.GET_USER,
      );

      if (response.success && response.data) {
        const apiData = response.data;
        if (apiData.data?.user) {
          setUserData(apiData.data.user);
          // Update role in localStorage if needed
          if (apiData.data.user.role) {
            localStorage.setItem("role", apiData.data.user.role);
          }
        } else {
          setError("User data not found");
        }
      } else {
        setError("Failed to load user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (isEditMode) {
    return (
      <EditProfile
        onCancel={() => setIsEditMode(false)}
        onSuccess={() => {
          fetchUserData(); // Refresh user data after successful update
        }}
      />
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !userData) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography sx={{ color: "error.main" }}>
          {error || "Failed to load user data"}
        </Typography>
      </Box>
    );
  }

  // Helper functions to format data
  const getFullName = () => {
    return (
      `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "Unknown"
    );
  };

  const getPhoneNumber = () => {
    const countryCode = userData.phone_country_code || "";
    const phoneNumber = userData.phone_number || "";
    if (countryCode && phoneNumber) {
      return `${countryCode} ${phoneNumber}`;
    }
    return phoneNumber || "N/A";
  };

  const getDisplayName = () => {
    return getFullName();
  };

  const getLocation = () => {
    return userData.address || "N/A";
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Top Section - User Summary */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
          p: "1.5rem",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
        }}
      >
        <Avatar
          src={userData.profile_photo_url || "/icons/testimonilas-1.png"}
          alt={getDisplayName()}
          sx={{
            width: "8.125rem",
            height: "8.125rem",
          }}
        />
        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              width: "100%",
            }}
          >
            {/* LEFT: Name + Location */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0, // 🔑 critical for text overflow in flex
              }}
            >
              <Typography
                variant="h4"
                fontWeight={500}
                sx={{
                  color: "text.primary",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {getDisplayName()}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 400,
                  lineHeight: 1.4,
                  minWidth: 0, // 🔑 flex-safe
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 3, sm: 2 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={getLocation()}
              >
                {getLocation()}
              </Typography>
            </Box>

            {/* RIGHT: Edit Button */}
            <Box
              sx={{
                flexShrink: 0, // 🔑 prevent button shrinking
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              <Button
                variant="outlined"
                endIcon={
                  <EditIcon sx={{ color: "#6D6D6D", fontSize: "1rem" }} />
                }
                onClick={() => setIsEditMode(true)}
                sx={{
                  textTransform: "none",
                  border: "0.03125rem solid #DFE8ED",
                  color: "#6D6D6D",
                  px: "0.75rem",
                  py: "0.625rem",
                  borderRadius: "6.25rem",
                  gap: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: 400,
                  lineHeight: "1.125rem",
                  "&:hover": {
                    borderColor: "#DFE8ED",
                    bgcolor: "transparent",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section - Personal Information */}
      <Box
        sx={{
          p: "1.5rem",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={400}
          sx={{
            color: "primary.main",
            mb: 3,
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Personal Information
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Full Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                {getFullName()}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                {getPhoneNumber()}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Preferred Language
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: "1rem",
                  py: "0.75rem",
                  borderRadius: "14px",
                  border: "1px solid #E0E0E0",
                  bgcolor: "#FFFFFF",
                  minHeight: "2.5rem",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#2C6587",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0%",
                  }}
                >
                  French
                </Typography>
                <Box
                  sx={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    border: "2px solid #2C6587",
                    bgcolor: "#2C6587",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      bgcolor: "#FFFFFF",
                    }}
                  />
                </Box>
              </Box>
            </Box>
            {userData.role !== "elderly_user" && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 0.5,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  Year of Experience
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    fontWeight: 400,
                    fontSize: "1rem",
                  }}
                >
                  {userData.year_of_experience || "N/A"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                E-mail id
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                {userData.email || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 3, sm: 2 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
                title={userData.address || "N/A"}
              >
                {userData.address || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
