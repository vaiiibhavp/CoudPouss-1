"use client";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface FavoriteProfessional {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo_url: string | null;
  total_reviews: number;
  average_rating: number;
}

interface HomeApiResponse {
  message: string;
  data: {
    services: any[];
    user_data: any;
    professional_connected_count: number;
    recent_requests: any;
    favorite_professionals: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
      records: FavoriteProfessional[];
    };
  };
  success: boolean;
  status_code: number;
}

const page = () => {
  const router = useRouter();
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<
    FavoriteProfessional[]
  >([]);
  const [favoriteProfessionalsLoading, setFavoriteProfessionalsLoading] =
    useState(false);

  const fetchFavoriteProfessionals = useCallback(async () => {
    // Don't call API if user is not authenticated
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedInitial || !storedEmail) {
      return;
    }

    setFavoriteProfessionalsLoading(true);
    try {
      const response = await apiGet<HomeApiResponse>(API_ENDPOINTS.HOME.HOME);
      if (response.success && response.data) {
        const apiData = response.data;

        // Handle favorite professionals
        if (apiData?.data?.favorite_professionals?.records) {
          setFavoriteProfessionals(apiData.data.favorite_professionals.records);
        } else {
          setFavoriteProfessionals([]);
        }
      }
    } catch (error) {
      console.error("Error fetching favorite professionals:", error);
    } finally {
      setFavoriteProfessionalsLoading(false);
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Fetch favorite professionals
    fetchFavoriteProfessionals();
  }, [router, fetchFavoriteProfessionals]);

  return (
    <Box sx={{ bgcolor: "white", px: "5rem", py: "4.625rem" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "2rem",
          }}
        >
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: "1.2rem", md: "1.688rem" },
              fontWeight: 700,
            }}
          >
            Favorite Professionals
          </Typography>
        </Box>

        {/* Professionals Rows */}
        {favoriteProfessionalsLoading ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Box
                key={`loading-${index}`}
                sx={{
                  width: "100%",
                  maxWidth: "308px",
                  borderRadius: "1.125rem",
                  p: "0.875rem",
                  textAlign: "center",
                  position: "relative",
                  border: "0.0625rem solid #DFE8ED",
                  bgcolor: "grey.100",
                }}
              >
                <Box
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    bgcolor: "grey.300",
                    margin: "0 auto 0.75rem",
                  }}
                />
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            ))}
          </Box>
        ) : favoriteProfessionals.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              No favorite professionals yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {favoriteProfessionals.map((professional) => {
              const fullName =
                `${professional.first_name || ""} ${
                  professional.last_name || ""
                }`.trim() || "Unknown";
              const rating = professional.average_rating || 0;
              const reviews = professional.total_reviews || 0;

              return (
                <Box
                  key={professional.id}
                  onClick={() =>
                    router.push(`/about-professional/${professional.id}`)
                  }
                  sx={{
                    width: "100%",
                    maxWidth: "308px",
                    borderRadius: "1.125rem",
                    p: "0.875rem",
                    textAlign: "center",
                    position: "relative",
                    border: "0.0625rem solid #DFE8ED",
                    cursor: "pointer",
                  }}
                >
                  {/* Heart Icon */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#2C6587",
                      p: 0.5,
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  {/* Profile Picture */}
                  <Box
                    sx={{
                      width: 92,
                      height: 92,
                      borderRadius: "50%",
                      bgcolor: "grey.300",
                      margin: "0 auto 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {professional.profile_photo_url ? (
                      <Image
                        src={professional.profile_photo_url}
                        alt={fullName}
                        width={92}
                        height={92}
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <AccountCircleIcon
                        sx={{ fontSize: 80, color: "grey.500" }}
                      />
                    )}
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      mb: 1,
                      textAlign: "left",
                      color: "#323232",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                    }}
                  >
                    {fullName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: "0.375rem",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "left",
                          color: "secondary.naturalGray",
                          fontSize: "1.063rem",
                          lineHeight: "20px",
                        }}
                      >
                        {rating > 0 ? rating.toFixed(1) : "0.0"}
                      </Typography>
                      <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    </Box>

                    {/* Reviews */}
                    <Typography
                      variant="caption"
                      color="#999999"
                      sx={{
                        fontSize: "0.688rem",
                        lineHeight: "1rem",
                      }}
                    >
                      ({reviews} {reviews === 1 ? "Review" : "Reviews"})
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default page;
