"use client";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Rating,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useParams, useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { useEffect, useState } from "react";
import { Professional, ProfessionalResponse } from "./helper";
import { ApiResponse } from "@/types";
import Image from "next/image";

const ratingBar = (label: string, value: number) => (
  <Box key={label} sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography fontSize={13}>{label}</Typography>
      <Typography fontSize={13}>{value}</Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value * 20}
      sx={{
        height: 6,
        borderRadius: 10,
        bgcolor: "#F1F5F9",
        "& .MuiLinearProgress-bar": {
          borderRadius: 10,
        },
      }}
    />
  </Box>
);

export default function ProfessionalDetails() {
  const { id } = useParams();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  console.log("professional", professional);

  const fetchProfessional = async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const payload = { user_id: id };

      const response = await apiPost<ProfessionalResponse>(
        API_ENDPOINTS.SERVICE_REQUEST.PROFESSIONAL_DETAIL,
        payload,
      );

      if (response.success) {
        setProfessional(response.data?.data || null); //  Professional
      } else {
        setError(response.error?.message || ""); //  exists on ApiResponse
      }
    } catch (err) {
      setError("Failed to fetch professional details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessional();
  }, [id]);

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        border: "1px solid #EAF5F4",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2, p: 1, alignItems: "center" }}>
        <IconButton sx={{ p: 0 }} onClick={()=>router.back()}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography
          fontSize={{ xs: 16, sm: 20 }}
          fontWeight={600}
          color="#323232"
        >
          About professional
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #EAF5F4",
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Avatar + Name */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              src={professional?.profile_photo_url ?? ""}
              alt="profile"
              sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 } }}
            />

            <Box>
              <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
                {professional?.full_name ?? ""}
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Professional User • Manchester, Kentucky
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              ml: { md: "auto" },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 120px)",
              },
              gap: 1.5,
              mt: { xs: 2, md: 0 },
            }}
          >
            {[
              {
                label: "Overall rating",
                value: professional?.overall_ratings ?? "0",
              },
              {
                label: "Certified",
                value: professional?.is_certified ? "Yes" : "No",
              },
              {
                label: "Clients",
                value: professional?.unique_clients_served ?? "",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  border: "1px solid #BECFDA",
                  borderRadius: "6.68px",
                  p: "8px 12px",
                  textAlign: "center",
                }}
              >
                <Typography fontWeight={700} fontSize={16} color="#1D7885">
                  {item.value}
                </Typography>
                <Typography fontSize={12} color="#214C65">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* INFO */}
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #EAF5F4",
          p: 2,
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        {/* Bio */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#2C6587">
            Public Profile Details
          </Typography>

          <Typography color="#939393" fontSize={14} fontWeight={600} mt={1}>
            Bio
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            {professional?.provider_info?.bio ?? ""}
          </Typography>
        </Box>

        {/* Experience */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#939393">
            Experience & Specialization
          </Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>
            {professional?.provider_info?.experience}
          </Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>
            {professional?.provider_info?.speciality}
          </Typography>
        </Box>
        {/* Achievements */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#939393">
            Achievements
          </Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>
            {professional?.provider_info.achievements}
          </Typography>
        </Box>
      </Box>

      {/* Images */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={500} mb={1} color="#2C6587">
          Images of Past Works
        </Typography>

        <Grid container spacing={2}>
          {professional?.past_work_photos?.length ? (
            professional.past_work_photos.map((photo, index) => {
              if (!photo) return null; // ✅ Prevent crash

              return (
                <Grid item xs={12} sm={6} md={4} key={`${photo}-${index}`}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#E5E7EB",
                    }}
                  >
                    <Image
                      src={photo}
                      alt={`Past work ${index + 1}`}
                      fill
                      sizes="(max-width: 600px) 100vw,
                     (max-width: 900px) 50vw,
                     33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                No past work images available
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Ratings */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={600} mb={2} color="#2C6587">
          Customer Ratings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
              <Typography fontSize={32} fontWeight={600}>
                4.6
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Rating value={4.6} precision={0.1} readOnly />
                <Typography fontSize={12} color="text.secondary">
                  Based on 471 ratings
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {ratingBar("Work quality", 4.9)}
            {ratingBar("Reliability", 4.9)}
            {ratingBar("Punctuality", 4.8)}
            {ratingBar("Solution", 5.0)}
            {ratingBar("Politeness", 4.5)}
          </Grid>
        </Grid>
      </Box>

      {/* Reviews */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={600} mb={2} color="#2C6587">
          Recent Works & Reviews
        </Typography>

        <Grid container spacing={2}>
          {professional?.recent_works_and_reviews?.length ? (
            professional.recent_works_and_reviews.map((review, index) => (
              <Grid item xs={12} sm={6} md={4} key={`${review.id}-${index}`}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography fontWeight={600} noWrap>
                        {review.full_name}
                      </Typography>

                      <Rating
                        value={Number(review.rating) || 0}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                    </Box>

                    {/* Review text */}
                    <Typography
                      fontSize={13}
                      color="text.secondary"
                      mt={1}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.review || "No review provided"}
                    </Typography>

                    {/* Footer */}
                    <Typography fontSize={12} color="text.disabled" mt={1}>
                      {review.days_ago ?? ""} days ago
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                No reviews available yet
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
