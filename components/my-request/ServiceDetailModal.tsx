"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Card,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSafeImageSrc,
  ProviderInfo,
  ServiceDetailApiResponse,
  ServiceDetailData,
} from "@/app/(frontend)/my-requests/helper";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import Image from "next/image";
import { formatDate, formatTime } from "@/utils/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import ConfirmByElderSection from "./ConfirmByElderSection";

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  onReject?: () => void;
  service_id: string; // Changed to camelCase (Standard JS practice)
}

export default function ServiceDetailModal({
  open,
  onClose,
  onReject,
  service_id,
}: ServiceDetailModalProps) {
  const router = useRouter();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailData | null>(
    null,
  );
  const [serviceDetailLoading, setServiceDetailLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const fetchServiceDetail = useCallback(async (serviceId: string) => {
    setServiceDetailLoading(true);
    try {
      const response = await apiPost<ServiceDetailApiResponse>(
        API_ENDPOINTS.SERVICE_REQUEST.GET_SERVICE_DETAIL,
        { service_id: serviceId },
      );

      if (response.success && response.data?.data) {
        setServiceDetail(response.data.data);
      } else {
        setServiceDetail(null);
      }
    } catch (error) {
      console.error("Error fetching service detail:", error);
      setServiceDetail(null);
    } finally {
      setServiceDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (service_id) {
      fetchServiceDetail(service_id);
    }
  }, [service_id, fetchServiceDetail]);
  // Debugging log (Remove in final production build)

  const handleFavorite = async (
    professionalId?: string,
    isFavorite?: boolean,
  ) => {
    if (!professionalId || favoriteLoading) return;

    setFavoriteLoading(true);

    // 🔹 Snapshot for rollback

    // 🔹 Optimistic update
    // setRequests((prev) =>
    //   prev.map((req) =>
    //     req.professional?.id === professionalId
    //       ? {
    //           ...req,
    //           professional: {
    //             ...req.professional,
    //             is_favorate: !isFavorite,
    //           },
    //         }
    //       : req,
    //   ),
    // );
  };

  const handleNavigate = () => {
    const provider: ProviderInfo | undefined = serviceDetail?.provider;
    if (provider) {
      router.push(ROUTES.CHAT_id.replace(":id", provider?.id || ""));
    }
  };
  console.log("serviceDetail", serviceDetail);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
          maxWidth="md"
        fullWidth
        aria-labelledby="service-detail-title"
        PaperProps={{
          sx: {
            borderRadius: "1rem",
            p: 1, // Reduced padding here to manage within DialogContent
          },
        }}
      >
        {/* Header Section */}
        <DialogTitle id="service-detail-title">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              Service Details
            </Typography>
            <IconButton onClick={onClose} size="small" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
            //   gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              bgcolor: "white",
              zIndex: 10,
            //   minHeight: "100vh",
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                flex: 1,
                bgcolor: "white",
                borderRadius: { xs: 2, sm: 2.5, md: 3 },
                pt: 0,
                position: "relative",
                minHeight: { xs: 400, sm: 500, md: 600 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              {serviceDetailLoading ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Loading service details...
                  </Typography>
                </Box>
              ) : serviceDetail ? (
                <Box
                  sx={{
                    display: "flex",
                    overflowY: "auto",
                    flexDirection: "column",
                    "::-webkit-scrollbar": { display: "none" },
                    gap: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: { xs: 2, sm: 2.5, md: 3 },
                      border: "0.0625rem solid",
                      borderColor: "grey.200",
                      p: { xs: 1.5, sm: 2, md: "1.25rem" },
                      flex: 1,
                      // overflowY:"auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    {/* IMAGE + TITLE */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 2.5, md: 3 },
                        alignItems: { xs: "flex-start", sm: "center" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", sm: "8rem", md: "10.3125rem" },
                          height: { xs: "12rem", sm: "7rem", md: "8.625rem" },
                          borderRadius: {
                            xs: "0.5rem",
                            sm: "0.625rem",
                            md: "0.75rem",
                          },
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={
                            serviceDetail?.sub_category_logo ||
                            serviceDetail?.category_logo ||
                            ""
                          }
                          alt={serviceDetail?.sub_category_name || "image"}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "1.125rem",
                              sm: "1.25rem",
                              md: "1.5rem",
                            },
                            lineHeight: {
                              xs: "1.375rem",
                              sm: "1.5rem",
                              md: "1.75rem",
                            },
                            letterSpacing: "0%",
                            color: "#424242",
                            fontWeight: "bold",
                            mb: { xs: 0.5, sm: 0.75 },
                          }}
                        >
                          {serviceDetail?.sub_category_name || ""}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.9375rem",
                              sm: "1rem",
                              md: "1.125rem",
                            },
                            lineHeight: {
                              xs: "1.25rem",
                              sm: "1.375rem",
                              md: "1.5rem",
                            },
                            letterSpacing: "0%",
                            color: "#6D6D6D",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.category_name || ""}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DATE / TIME / CATEGORY / LOCATION */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                        },
                        bgcolor: "#FBFBFB",
                        p: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        borderRadius: {
                          xs: "0.75rem",
                          sm: "0.875rem",
                          md: "1rem",
                        },
                        rowGap: {
                          xs: "0.5rem",
                          sm: "0.625rem",
                          md: "0.75rem",
                        },
                        columnGap: { xs: 1.5, sm: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.75, sm: 1 },
                        }}
                      >
                        <Image
                          src="/icons/Calendar.png"
                          alt="Calendar"
                          width={20}
                          height={20}
                          style={{ width: "auto", height: "auto" }}
                          sizes="(max-width: 600px) 18px, 24px"
                        />
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8125rem",
                              md: "0.875rem",
                            },
                            lineHeight: {
                              xs: "1rem",
                              sm: "1.0625rem",
                              md: "1.125rem",
                            },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.chosen_datetime
                            ? formatDate(serviceDetail.chosen_datetime)
                            : ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.75, sm: 1 },
                        }}
                      >
                        <Image
                          src="/icons/Clock.png"
                          alt="Time"
                          width={20}
                          height={20}
                          style={{ width: "auto", height: "auto" }}
                          sizes="(max-width: 600px) 18px, 24px"
                        />
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8125rem",
                              md: "0.875rem",
                            },
                            lineHeight: {
                              xs: "1rem",
                              sm: "1.0625rem",
                              md: "1.125rem",
                            },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.chosen_datetime
                            ? formatTime(serviceDetail.chosen_datetime)
                            : ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.75, sm: 1 },
                        }}
                      >
                        <Image
                          src="/icons/fi_6374086.png"
                          alt="Category"
                          width={20}
                          height={20}
                          style={{ width: "auto", height: "auto" }}
                          sizes="(max-width: 600px) 18px, 24px"
                        />
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8125rem",
                              md: "0.875rem",
                            },
                            lineHeight: {
                              xs: "1rem",
                              sm: "1.0625rem",
                              md: "1.125rem",
                            },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.category_name || ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.75, sm: 1 },
                        }}
                      >
                        <Image
                          src="/icons/MapPin.png"
                          alt="Location"
                          width={20}
                          height={20}
                          style={{ width: "auto", height: "auto" }}
                          sizes="(max-width: 600px) 18px, 24px"
                        />
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8125rem",
                              md: "0.875rem",
                            },
                            lineHeight: {
                              xs: "1rem",
                              sm: "1.0625rem",
                              md: "1.125rem",
                            },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                            minWidth: 0, // 🔑 flex-safe
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                            display: "-webkit-box",
                            WebkitLineClamp: { xs: 3, sm: 2 },
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={serviceDetail?.elder_address || ""}
                        >
                          {serviceDetail?.elder_address || ""}
                        </Typography>
                      </Box>
                    </Box>
                    {/*finalized quated amount*/}
                    {serviceDetail?.task_status === "accepted" && (
                      <Card
                        sx={{
                          borderRadius: "0.75rem",
                          border: "0.0625rem solid #E6E6E6",
                          bgcolor: "#FFFFFF",
                          padding: "0.8125rem 1rem 0.8125rem 1rem",
                          mb: "1rem",
                          boxShadow: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.25rem",
                          "&:hover": {
                            border: "0.0625rem solid #E6E6E6",
                          },
                        }}
                      >
                        <Typography
                          fontWeight="500"
                          sx={{
                            color: "#323232",
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                            letterSpacing: "0%",
                          }}
                        >
                          Finalized Quote Amount
                        </Typography>
                        <Typography
                          fontWeight="700"
                          sx={{
                            color: "#0F232F",
                            fontSize: "1.6875rem",
                            lineHeight: "2rem",
                            letterSpacing: "3%",
                            textAlign: "left",
                          }}
                        >
                          €
                          {serviceDetail.payment_breakdown
                            .finalize_quote_amount ?? 0}
                        </Typography>
                      </Card>
                    )}

                    {/* QUOTE ROW */}
                    {serviceDetail?.task_status === "pending" && (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.9375rem",
                              md: "1rem",
                            },
                            lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#323232",
                            fontWeight: 400,
                            mb: {
                              xs: "0.5rem",
                              sm: "0.625rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          Quote Amount
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: { xs: 1, sm: 0 },
                            borderRadius: {
                              xs: "0.5rem",
                              sm: "0.625rem",
                              md: "0.75rem",
                            },
                            border: "0.0625rem solid #D5D5D5",
                            pt: { xs: "0.75rem", sm: "0.875rem" },
                            pr: { xs: "0.75rem", sm: "1rem" },
                            pb: { xs: "0.75rem", sm: "0.875rem" },
                            pl: { xs: "0.75rem", sm: "1rem" },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "1.25rem",
                                sm: "1.4375rem",
                                md: "1.6875rem",
                              },
                              lineHeight: {
                                xs: "1.5rem",
                                sm: "1.75rem",
                                md: "2rem",
                              },
                              letterSpacing: "3%",
                              textAlign: { xs: "left", sm: "center" },
                              color: "#0F232F",
                              fontWeight: "bold",
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            €{serviceDetail?.total_renegotiated || ""}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() =>
                              router.push(
                                `/chat/${serviceDetail?.provider?.id}`,
                              )
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: { xs: "0.375rem", sm: "0.5rem" },
                              pt: { xs: "0.5rem", sm: "0.625rem" },
                              pr: { xs: "1rem", sm: "1.25rem" },
                              pb: { xs: "0.5rem", sm: "0.625rem" },
                              pl: { xs: "1rem", sm: "1.25rem" },
                              gap: "0.625rem",
                              bgcolor: "#214C65",
                              fontSize: {
                                xs: "0.875rem",
                                sm: "0.9375rem",
                                md: "1rem",
                              },
                              width: { xs: "100%", sm: "auto" },
                              "&:hover": {
                                bgcolor: "#214C65",
                              },
                            }}
                          >
                            Negotiate
                          </Button>
                        </Box>
                      </Box>
                    )}
                    {/* Security Code */}
                    {(serviceDetail?.task_status === "accepted" ||
                      serviceDetail?.task_status === "completed") &&
                      serviceDetail && (
                        <Card
                          sx={{
                            borderRadius: "0.75rem",
                            border: "0.0625rem solid #E6E6E6",
                            bgcolor: "#FFFFFF",
                            padding: "0.8125rem 1rem",
                            mb: "1rem",
                            boxShadow: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.25rem",
                          }}
                        >
                          <Typography
                            fontWeight={500}
                            sx={{
                              color: "#323232",
                              fontSize: "1.125rem",
                              lineHeight: "1.25rem",
                            }}
                          >
                            Security Code
                          </Typography>

                          <Box sx={{ display: "flex", gap: "1.25rem" }}>
                            {(serviceDetail?.service_code || "")
                              .split("")
                              .map((digit, index, arr) => (
                                <Box
                                  key={index}
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "1.25rem",
                                    bgcolor: "rgba(234, 240, 243, 0.3)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "#0F232F",
                                      fontSize: "1.25rem",
                                      lineHeight: 1,
                                    }}
                                  >
                                    {index >= arr.length - 3 ? "*" : digit}
                                  </Typography>
                                </Box>
                              ))}
                          </Box>

                          <Typography
                            fontWeight={400}
                            sx={{
                              color: "#424242",
                              fontSize: "0.6875rem",
                              lineHeight: "1rem",
                            }}
                          >
                            Note: Final 3 digits will be given to you on service
                            date.
                          </Typography>
                        </Card>
                      )}

                    {/* PROFESSIONAL ROW */}
                    {serviceDetail?.task_status === "pending" && (
                      <Box
                        sx={{
                          border: "0.0625rem solid #E6E6E6",
                          borderRadius: {
                            xs: "0.5rem",
                            sm: "0.625rem",
                            md: "0.75rem",
                          },
                          pt: { xs: "0.75rem", sm: "0.8125rem" },
                          pr: { xs: "0.75rem", sm: "1rem" },
                          pb: { xs: "0.75rem", sm: "0.8125rem" },
                          pl: { xs: "0.75rem", sm: "1rem" },
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: "0.75rem", sm: "1rem" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.875rem",
                                sm: "0.9375rem",
                                md: "1rem",
                              },
                              lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                              letterSpacing: "0%",
                              color: "#323232",
                              fontWeight: 400,
                            }}
                          >
                            About professional
                          </Typography>

                          {/* <IconButton size="small">
                            <FavoriteBorderIcon fontSize="small" />
                          </IconButton> */}
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleFavorite(
                                serviceDetail.provider.id,
                                serviceDetail.provider?.is_favorate,
                              )
                            }
                          >
                            {serviceDetail.provider?.is_favorate ? (
                              <FavoriteIcon
                                fontSize="small"
                                sx={{ color: "#E0245E" }}
                              />
                            ) : (
                              <FavoriteBorderIcon
                                fontSize="small"
                                sx={{ color: "#6B7280" }}
                              />
                            )}
                          </IconButton>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: { xs: 1.5, sm: 2 },
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: { xs: 1.5, sm: 2 },
                            }}
                          >
                            <Box
                              sx={{
                                width: {
                                  xs: "3rem",
                                  sm: "3.25rem",
                                  md: "3.5rem",
                                },
                                height: {
                                  xs: "3rem",
                                  sm: "3.25rem",
                                  md: "3.5rem",
                                },
                                borderRadius: "50%",
                                overflow: "hidden",
                                position: "relative",
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src={getSafeImageSrc(
                                  serviceDetail.provider?.profile_photo_url,
                                )}
                                alt={serviceDetail.provider?.first_name || ""}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>

                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: { xs: 0.75, sm: 1 },
                                  flexWrap: "wrap",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: {
                                      xs: "1rem",
                                      sm: "1.125rem",
                                      md: "1.25rem",
                                    },
                                    lineHeight: {
                                      xs: "1.25rem",
                                      sm: "1.375rem",
                                      md: "1.5rem",
                                    },
                                    letterSpacing: "0%",
                                    color: "#0F232F",
                                    fontWeight: 500,
                                  }}
                                >
                                  {serviceDetail.provider?.full_name}
                                </Typography>

                                <Image
                                  src="/icons/verify.png"
                                  alt="Verified"
                                  width={20}
                                  height={20}
                                  style={{ width: "auto", height: "auto" }}
                                  sizes="(max-width: 600px) 18px, 24px"
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              gap: { xs: "0.5rem", sm: "0.75rem" },
                              flexDirection: { xs: "column", sm: "row" },
                              width: { xs: "100%", sm: "auto" },
                            }}
                          >
                            <Button
                              onClick={handleNavigate}
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                borderRadius: {
                                  xs: "0.375rem",
                                  sm: "0.5rem",
                                },
                                pt: { xs: "0.5rem", sm: "0.625rem" },
                                pr: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                                pb: { xs: "0.5rem", sm: "0.625rem" },
                                pl: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                                gap: "0.625rem",
                                bgcolor: "#214C65",
                                fontSize: {
                                  xs: "0.875rem",
                                  sm: "0.9375rem",
                                  md: "1rem",
                                },
                                width: { xs: "100%", sm: "auto" },
                                minWidth: {
                                  xs: "auto",
                                  sm: "120px",
                                  md: "200px",
                                },
                                "&:hover": {
                                  bgcolor: "#214C65",
                                },
                              }}
                            >
                              Chat
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() =>
                                router.push(
                                  `/about-professional/${serviceDetail.provider?.id}`,
                                )
                              }
                              sx={{
                                textTransform: "none",
                                borderRadius: {
                                  xs: "0.375rem",
                                  sm: "0.5rem",
                                },
                                pt: { xs: "0.5rem", sm: "0.625rem" },
                                pr: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                                pb: { xs: "0.5rem", sm: "0.625rem" },
                                pl: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                                gap: "0.625rem",
                                bgcolor: "#214C65",
                                fontSize: {
                                  xs: "0.875rem",
                                  sm: "0.9375rem",
                                  md: "1rem",
                                },
                                width: { xs: "100%", sm: "auto" },
                                "&:hover": {
                                  bgcolor: "#214C65",
                                },
                              }}
                            >
                              View Profile
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* PERSONALIZED MESSAGE */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.875rem",
                            sm: "0.9375rem",
                            md: "1rem",
                          },
                          lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                          letterSpacing: "0%",
                          color: "#323232",
                          fontWeight: 400,
                          mb: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                        }}
                      >
                        Personalized short message
                      </Typography>
                      <Box
                        sx={{
                          maxHeight: "400px",
                          overflow: "auto",
                          border: "0.0625rem solid #D5D5D5",
                          borderRadius: {
                            xs: "0.5rem",
                            sm: "0.625rem",
                            md: "0.75rem",
                          },
                          pt: { xs: "0.75rem", sm: "0.875rem" },
                          pr: { xs: "0.75rem", sm: "1rem" },
                          pb: { xs: "0.75rem", sm: "0.875rem" },
                          pl: { xs: "0.75rem", sm: "1rem" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.9375rem",
                              md: "1rem",
                            },
                            lineHeight: {
                              xs: "1.25rem",
                              sm: "1.375rem",
                              md: "1.5rem",
                            },
                            letterSpacing: "0%",
                            color: "#6D6D6D",
                            fontWeight: 400,
                            wordBreak: "break-all",
                            overflowWrap: "anywhere",

                            /* safety */
                            whiteSpace: "normal",
                          }}
                        >
                          {serviceDetail?.service_description ||
                            serviceDetail.category_name}
                        </Typography>
                      </Box>
                    </Box>

                    {/* SHORT VIDEOS */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.875rem",
                            sm: "0.9375rem",
                            md: "1rem",
                          },
                          lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                          letterSpacing: "0%",
                          color: "#323232",
                          fontWeight: 400,
                          mb: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                        }}
                      >
                        Short videos
                      </Typography>
                      {serviceDetailLoading ? (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            Loading videos...
                          </Typography>
                        </Box>
                      ) : serviceDetail?.media?.videos &&
                        serviceDetail.media.videos.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: {
                              xs: "0.75rem",
                              sm: "1rem",
                              md: "1.125rem",
                            },
                          }}
                        >
                          {(serviceDetail?.media?.videos).map(
                            (video, index) => (
                              <Box
                                key={index}
                                sx={{
                                  // width: "100%",
                                  height: {
                                    xs: "8rem",
                                    sm: "8.5rem",
                                    md: "9rem",
                                  },
                                  borderRadius: { xs: 1.5, sm: 2 },
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <video
                                  src={video}
                                  controls
                                  preload="metadata"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ),
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            No videos available
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* PHOTOS */}
                    {serviceDetail?.media?.photos &&
                      serviceDetail.media.photos.length > 0 && (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.875rem",
                                sm: "0.9375rem",
                                md: "1rem",
                              },
                              lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                              letterSpacing: "0%",
                              color: "#323232",
                              fontWeight: 400,
                              mb: {
                                xs: "0.5rem",
                                sm: "0.625rem",
                                md: "0.75rem",
                              },
                            }}
                          >
                            Job Photos
                          </Typography>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "1fr", // mobile
                                sm: "repeat(2, 1fr)", // tablet
                                md: "repeat(3, 1fr)", // desktop
                              },
                              gap: {
                                xs: "0.75rem",
                                sm: "1rem",
                                md: "1.125rem",
                              },
                            }}
                          >
                            {serviceDetail.media.photos.map((photo, index) => (
                              <Box
                                key={index}
                                //   onClick={() => setPreviewIndex(index)}
                                sx={{
                                  width: "100%",
                                  aspectRatio: "16 / 9",
                                  borderRadius: { xs: 1.5, sm: 2 },
                                  overflow: "hidden",
                                  position: "relative",
                                  bgcolor: "grey.100",
                                  cursor: "pointer",
                                }}
                              >
                                <Image
                                  src={photo}
                                  alt={`Photo ${index + 1}`}
                                  fill
                                  style={{
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                    {(serviceDetail?.task_status === "accepted" ||
                      serviceDetail?.task_status === "completed") && (
                      <Box
                        sx={{
                          mb: "1.5rem",
                          bgcolor: "#FFFFFF",
                          border: "0.0625rem solid #E6E6E6",
                          borderRadius: "0.75rem",
                          px: "1rem",
                          py: "0.8125rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          sx={{
                            color: "#323232",
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                            letterSpacing: 0,
                          }}
                        >
                          Payment Breakdown
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#6B7280" }}
                            >
                              Finalized Quote Amount
                            </Typography>
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#595959",
                                fontSize: "0.875rem",
                                lineHeight: "1rem",
                                letterSpacing: 0,
                              }}
                            >
                              €
                              {serviceDetail.payment_breakdown
                                .finalize_quote_amount ?? 0}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#6B7280" }}
                            >
                              Platform Fee (15%)
                            </Typography>
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#595959",
                                fontSize: "0.875rem",
                                lineHeight: "1rem",
                                letterSpacing: 0,
                              }}
                            >
                              €
                              {serviceDetail.payment_breakdown.platform_fees ??
                                0}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#6B7280" }}
                            >
                              Taxes
                            </Typography>
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#595959",
                                fontSize: "0.875rem",
                                lineHeight: "1rem",
                                letterSpacing: 0,
                              }}
                            >
                              €{serviceDetail.payment_breakdown.tax ?? 0}
                            </Typography>
                          </Box>
                          <Divider
                            sx={{
                              mb: "0.25rem",
                              mt: "-0.25rem",
                              borderColor: "#2C6587",
                              borderStyle: "dashed",
                              borderWidth: "0.0625rem",
                              borderRadius: "0.0625rem",
                            }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#0F232F",
                                fontSize: "1.25rem",
                                lineHeight: "1.5rem",
                                letterSpacing: 0,
                              }}
                            >
                              Total
                            </Typography>
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#2C6587",
                                fontSize: "1.25rem",
                                lineHeight: "1",
                                letterSpacing: 0,
                              }}
                            >
                              €
                              {serviceDetail.payment_breakdown
                                .total_renegotiated ?? 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* SUPPORTING DOCUMENTS */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.875rem",
                            sm: "0.9375rem",
                            md: "1rem",
                          },
                          lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                          letterSpacing: "0%",
                          color: "#323232",
                          fontWeight: 400,
                          mb: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                        }}
                      >
                        Supporting documents
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: { xs: 1.5, sm: 2 },
                          flexWrap: "wrap",
                          bgcolor: "white",
                        }}
                      >
                        {[1, 2].map((doc) => (
                          <Box
                            key={doc}
                            sx={{
                              flex: {
                                xs: "1 1 100%",
                                sm: "1 1 calc(50% - 0.5rem)",
                                md: "1 1 12.5rem",
                              },
                              borderRadius: { xs: 1.5, sm: 2 },
                              border: "0.0625rem dashed",
                              borderColor: "grey.300",
                              bgcolor: "white",
                              p: { xs: 2, sm: 2.5, md: 3 },
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: { xs: 0.75, sm: 1 },
                            }}
                          >
                            <Image
                              src="/icons/codicon_file-pdf.png"
                              alt="Document"
                              width={32}
                              height={32}
                              style={{ width: "auto", height: "auto" }}
                              sizes="(max-width: 600px) 32px, 40px"
                            />
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "0.875rem",
                                  sm: "0.9375rem",
                                  md: "1rem",
                                },
                                lineHeight: {
                                  xs: "1.0625rem",
                                  sm: "1.125rem",
                                },
                                letterSpacing: "0%",
                                color: "#818285",
                                fontWeight: 400,
                              }}
                            >
                              View Document
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* ACTION BUTTONS */}
                    {serviceDetail?.task_status === "pending" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: "0.75rem", sm: "1rem" },
                          justifyContent: { xs: "stretch", sm: "flex-end" },
                          mt: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Button
                          // onClick={() => setOpenReject(true)}
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            width: { xs: "100%", sm: "192px" },
                            height: { xs: "48px", sm: "56px" },
                            borderRadius: {
                              xs: "0.5rem",
                              sm: "0.75rem",
                              md: "12px",
                            },
                            border: "1px solid #214C65",
                            borderColor: "#214C65",
                            p: { xs: "8px", sm: "10px" },
                            gap: "10px",
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.9375rem",
                              md: "1rem",
                            },
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          // onClick={() => setOpenConfirm(true)}
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            width: { xs: "100%", sm: "12.8125rem" },
                            height: { xs: "48px", sm: "3.5rem" },
                            borderRadius: {
                              xs: "0.5rem",
                              sm: "0.625rem",
                              md: "0.75rem",
                            },
                            p: { xs: "0.5rem", sm: "0.625rem" },
                            gap: "0.625rem",
                            bgcolor: "#214C65",
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.9375rem",
                              md: "1rem",
                            },
                            "&:hover": {
                              bgcolor: "#214C65",
                            },
                          }}
                        >
                          Accept
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 200, sm: 260 },
                      height: { xs: 200, sm: 260 },
                      position: "relative",
                    }}
                  >
                    <Image
                      src="/icons/vector.png"
                      alt="No request selected"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textAlign: "center", maxWidth: 400 }}
                  >
                    No requests selected. Choose a request from the list to view
                    details.
                  </Typography>
                </Box>
              )}
            </Box>
            {/* {service_id && serviceDetail && (
            <ConfirmByElderSection
            //   selectedRequestData={selectedRequestData}
              serviceDetail={serviceDetail}
              handleFavorite={handleFavorite}
              onCancelSuccess={() => {
                fetchRequests();
              }}
            />
          )} */}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
