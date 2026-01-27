"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Avatar, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import ProfessionalEditProfile from "./ProfessionalEditProfile";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setFullUserProfile } from "@/lib/redux/authSlice";

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
}

interface ProviderInfo {
  id: string;
  services_provider_id: string;
  bio?: string;
  experience_speciality?: string;
  achievements?: string;
  years_of_experience?: number;
  is_docs_verified: boolean;
  docs_status: string;
  [key: string]: any;
}

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
    provider_info?: ProviderInfo;
    past_work_files?: string[];
    recent_reviews?: any[];
    customer_ratings?: any;
    unique_clients_count?: number;
  };
}

export default function ProfessionalProfileOverview() {
  const dispatch = useDispatch();
  const { fullUserProfile, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [pastWorkFiles, setPastWorkFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fullUserProfile && fullUserProfile.user) {
      setUserData(fullUserProfile.user as unknown as UserData);
      setProviderInfo(fullUserProfile.provider_info || null);
      setPastWorkFiles(fullUserProfile.past_work_files || []);
      setLoading(false);
    } else if (isAuthenticated === false) {
      // Not authenticated
      setLoading(false);
    }
  }, [fullUserProfile, isAuthenticated]);

  const fetchUserData = useCallback(async () => {
    // Only fetch if we don't have data in Redux (or if we want to force refresh)
    // Here we will use this mainly for re-fetching after edit
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<GetUserApiResponse>(API_ENDPOINTS.AUTH.GET_USER);

      if (response.success && response.data) {
        const apiData = response.data;
        if (apiData.data?.user) {
          const user = apiData.data.user;
          // Update local state
          setUserData(user);
          if (apiData.data.provider_info) {
            setProviderInfo(apiData.data.provider_info);
          }
          if (apiData.data.past_work_files && Array.isArray(apiData.data.past_work_files)) {
            setPastWorkFiles(apiData.data.past_work_files);
          }

          // Also sync with Redux so other components update (and Header doesn't overwrite with old data if it re-renders?)
          // Generally Header fetches on mount only.
          dispatch(setFullUserProfile({
            user: user as any,
            provider_info: apiData.data.provider_info,
            past_work_files: apiData.data.past_work_files,
            recent_reviews: apiData.data.recent_reviews,
            customer_ratings: apiData.data.customer_ratings,
            unique_clients_count: apiData.data.unique_clients_count
          }));

          // Update role in localStorage if needed
          if (user.role) {
            localStorage.setItem("role", user.role);
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
  }, [dispatch]);

  // Initial load check - if verify Redux has data, rely on the useEffect above.
  // If Redux is empty (e.g. Header hasn't finished yet), we wait. 
  // But purely relying on the existing useEffect [fullUserProfile] covers it.
  // We keep fetchUserData primarily for the "onSuccess" callback of EditProfile.

  if (isEditMode) {
    return (
      <ProfessionalEditProfile
        onCancel={() => setIsEditMode(false)}
        onSuccess={() => {
          setIsEditMode(false);
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
    return `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Unknown";
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
      {/* Profile Header */}
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
            width: { xs: "6rem", sm: "7rem", md: "8.125rem" },
            height: { xs: "6rem", sm: "7rem", md: "8.125rem" },
            bgcolor: "#E5E7EB",
          }}
        />
        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
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
                }}
              >
                {getLocation()}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setIsEditMode(true)}
              endIcon={<EditIcon sx={{ color: "#6D6D6D", fontSize: "1rem" }} />}
              sx={{
                flexShrink: 0,
                textTransform: "none",
                border: "0.03125rem solid #DFE8ED",
                borderColor: "#DFE8ED",
                color: "#6D6D6D",
                px: "0.75rem",
                py: "0.625rem",
                borderRadius: "6.25rem",
                gap: "0.375rem",
                fontSize: "1rem",
                fontWeight: 400,
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                "&:hover": {
                  borderColor: "#DFE8ED",
                  bgcolor: "transparent",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            Professional User
          </Typography>
        </Box>
      </Box>

      {/* Personal Information */}
      <Box
        sx={{
          mb: { xs: "1rem", md: "1.5rem" },
          p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={400}
          sx={{
            color: "primary.normal",
            mb: { xs: "1rem", md: "1.5rem" },
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
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
                }}
              >
                Full Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                {getFullName()}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
                }}
              >
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                {getPhoneNumber()}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
                }}
              >
                Year of Experience
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                {providerInfo?.years_of_experience || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
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
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
                }}
              >
                E-mail id
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                {userData.email || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  mb: 0.5,
                  fontSize: "1.0625rem",
                  lineHeight: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0%",
                }}
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#424242",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                {userData.address || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Public Profile Details */}
      <Box
        sx={{
          mb: { xs: "1rem", md: "1.5rem" },
          p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          fontWeight={500}
          sx={{
            color: "#2C6587",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1rem", md: "1.125rem" },
            lineHeight: "1.5rem",
            letterSpacing: "0%",
          }}
        >
          Public profile Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#939393",
                mb: 0.5,
                fontSize: "1.0625rem",
                lineHeight: "1rem",
                fontWeight: 600,
                letterSpacing: "0%",
              }}
            >
              Bio
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6 }}
            >
              {providerInfo?.bio || "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#939393",
                mb: 0.5,
                fontSize: "1.0625rem",
                lineHeight: "1rem",
                fontWeight: 600,
                letterSpacing: "0%",
              }}
            >
              Experience & Specialties
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6 }}
            >
              {providerInfo?.experience_speciality || "N/A"}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
            <Typography
              variant="body2"
              sx={{
                color: "#939393",
                mb: 0.5,
                fontSize: "1.0625rem",
                lineHeight: "1rem",
                fontWeight: 600,
                letterSpacing: "0%",
              }}
            >
              Achievements
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", lineHeight: 1.6 }}
            >
              {providerInfo?.achievements || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Images of Past Works */}
      <Box
        sx={{
          p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          fontWeight={500}
          sx={{
            color: "#2C6587",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1rem", md: "1.125rem" },
            lineHeight: "1.5rem",
            letterSpacing: "0%",
          }}
        >
          Images of Past Works
        </Typography>
        {pastWorkFiles && pastWorkFiles.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(auto-fill, minmax(15.625rem, 1fr))",
              },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {pastWorkFiles.map((imageUrl, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  paddingTop: "75%",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#F3F4F6",
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`Past work ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{
              color: "text.secondary",
              textAlign: "center",
              py: 4,
            }}
          >
            No images available
          </Typography>
        )}
      </Box>
    </Box>
  );
}

