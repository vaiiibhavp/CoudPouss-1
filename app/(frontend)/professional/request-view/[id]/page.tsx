"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideocamIcon from "@mui/icons-material/Videocam";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPostFormData, apiPost } from "@/lib/api";
import { toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';
import { ROUTES } from "@/constants/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSubmittedModal from "@/components/QuoteSubmittedModal";

export default function RequestViewPage() {
  const router = useRouter();
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // formik will manage quote amount and message
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Supporting files (images / pdf) and their previews
  const [supportFiles, setSupportFiles] = useState<File[]>([]);
  const [supportFilePreviews, setSupportFilePreviews] = useState<Array<string | null>>([]);

  // Video file + preview
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Dynamic request data fetched from API
  const [requestData, setRequestData] = useState<any | null>(null);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<string | null>(null);

  // File upload handlers
  const handleSupportFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for images
      let previewURL: string | null = null;
      if (file.type.startsWith("image/")) {
        previewURL = URL.createObjectURL(file);
      }

      setSupportFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setSupportFilePreviews((prev) => {
        const newPreviews = [...prev];
        // Clean up old preview URL if it exists
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = previewURL;
        return newPreviews;
      });
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for video
      let previewURL: string | null = null;
      if (file.type.startsWith("video/")) {
        previewURL = URL.createObjectURL(file);
      }

      setVideoFile(file);
      
      // Clean up old video preview URL if it exists
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(previewURL);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      supportFilePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [supportFilePreviews, videoPreview]);

  useEffect(() => {
    let mounted = true;
    const fetchRequest = async () => {
      setLoadingRequest(true);
      setRequestError(null);
      try {
        if (!params?.id) {
          setRequestError("Invalid request id");
          setRequestData(null);
          return;
        }

        const res = await apiGet<any>(`quote_request/service-info/${params.id}`);
        if (!mounted) return;
        if (res.success && res.data) {
          const payload = (res.data.data || res.data) as any;
          // payload is expected to be the object described in the API sample
          const item = payload || {};

          const mapped = {
            id: item.service_id || item.serviceId || item.id || params.id,
            title:
              item?.subcategory_info?.sub_category_name?.name ||
              item?.subcategory_info?.sub_category_name ||
              item?.service_description?.slice(0, 60) ||
              "Service Request",
            category:
              (item?.category_info?.category_name &&
                (typeof item.category_info.category_name === "string"
                  ? item.category_info.category_name
                  : item.category_info.category_name?.name)) ||
              item?.category_info?.category_name ||
              "",
            categoryLogo:
              item?.category_info?.category_name?.logo_url ||
              item?.category_info?.category_logo_url ||
              item?.category_info?.category_logo ||
              "",
            serviceProvider: "",
            date: item.date || "",
            time: item.time || "",
            location: item?.about_client?.address || item.location || "",
            timeAgo: "",
            description: item.service_description || item.description || "",
            clientName: item?.about_client?.name || "",
            clientAvatar:
              item?.about_client?.profile_photo || item?.about_client?.profile_photo_url || "",
            images: item.job_photos || item.jobPhotos || item.job_photos || [],
            estimatedCost:
              typeof item.estimated_cost === "number"
                ? `€${item.estimated_cost.toFixed(2)}`
                : item.estimated_cost || "",
          };

          setRequestData(mapped);
        } else {
          setRequestError(res.error?.message || "Failed to load request");
          setRequestData(null);
        }
      } catch (err) {
        console.error(err);
        setRequestError("Failed to load request");
        setRequestData(null);
      } finally {
        setLoadingRequest(false);
      }
    };

    fetchRequest();
    return () => {
      mounted = false;
    };
  }, [params?.id]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => {
      const len = requestData?.images?.length || 0;
      if (len === 0) return 0;
      return prev === 0 ? len - 1 : prev - 1;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const len = requestData?.images?.length || 0;
      if (len === 0) return 0;
      return prev === len - 1 ? 0 : prev + 1;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadFileAndGetId = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiPostFormData<any>('quote_request/upload-job-file', fd);
      if (res.success && res.data) {
        const data = res.data;
        return data?.id || data?.storage_key || (data?.data && (data.data.id || data.data.storage_key)) || null;
      }
      return null;
    } catch (err) {
      console.error('Upload error', err);
      return null;
    }
  };

  const handleSubmitQuote = async (values: { quoteAmount: string; personalizedMessage: string }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const photoIds: string[] = [];
      const filesToUpload = supportFiles.filter(Boolean) as File[];
      for (const f of filesToUpload) {
        const id = await uploadFileAndGetId(f);
        if (id) photoIds.push(id);
        else {
          toast.error('Failed to upload an attachment');
          setIsSubmitting(false);
          return;
        }
      }

      const videoIds: string[] = [];
      if (videoFile) {
        const vid = await uploadFileAndGetId(videoFile);
        if (vid) videoIds.push(vid);
        else {
          toast.error('Failed to upload video');
          setIsSubmitting(false);
          return;
        }
      }

      const numericAmount = parseFloat((values.quoteAmount || '').toString().replace(/[^0-9.\-]/g, '')) || 0;
      const payload = {
        servicesid: requestData?.id || params?.id,
        provider_quote_amount: numericAmount,
        offer_photoids: photoIds,
        offer_videoids: videoIds,
        description: values.personalizedMessage,
      };

      const submitRes = await apiPost<any>('quote_request/quoterequest', payload);
      if (submitRes.success && submitRes.data) {
        const message = submitRes.data?.message || (submitRes.data?.data && submitRes.data.data.message) || 'Quote sent successfully';
        toast.success(message);
        setIsModalOpen(true);
      } else {
        const errMsg = submitRes.error?.message || 'Failed to submit quote';
        toast.error(errMsg);
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: { quoteAmount: '', personalizedMessage: '' },
    validationSchema: Yup.object({
      quoteAmount: Yup.string()
        .required('Quote amount is required')
        .test('is-number', 'Enter a valid amount greater than 0', (val) => {
          if (!val) return false;
          const n = parseFloat(val.replace(/[^0-9.\-]/g, ''));
          return !isNaN(n) && n > 0;
        }),
      personalizedMessage: Yup.string().max(1000, 'Message is too long'),
    }),
    onSubmit: handleSubmitQuote,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally redirect back to explore requests
    // router.push(ROUTES.PROFESSIONAL_EXPLORE_REQUESTS);
  };

  // Auto-close the submitted modal after 2 seconds
  useEffect(() => {
    if (!isModalOpen) return;
    const t = setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [isModalOpen]);



  
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Main Content */}
      <Box
        sx={{
          mt: { xs: "2rem", md: "3.375rem" },
          mb: { xs: "2rem", md: "2.688rem" },
          px: { xs: "1rem", sm: "1.5rem", md: "4.875rem" },
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={
            <ArrowBackIcon
              sx={{
                color: "#424242",
              }}
            />
          }
          onClick={() => router.back()}
          sx={{
            color: "#214C65",
            fontWeight: 500,
            fontSize: "1rem", // 16px
            lineHeight: "140%",
            textTransform: "none",
            mb: "1.813rem",
            px: 0,
            minWidth: 0,
            "& .MuiButton-startIcon": {
              mr: "0.5rem",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: "#2C6587",
            },
          }}
        >
          Back to All requests
        </Button>

        {/* Main Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
            gap: { xs: 2, md: 4 },
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* Left Column - Images and Description */}
          <Box sx={{ minWidth: 0 }}>
            {/* Image Carousel */}
            <Box
              sx={{
                position: "relative",
                borderRadius: "1.25rem",
                overflow: "hidden",
                mb: "1.5rem",
                bgcolor: "#F9FAFB",
                border: "0.0625rem solid #E5E7EB",
              }}
            >
              {/* Category Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "#2F6B8E",
                  color: "white",
                  px: 2,
                  py: "0.543rem",
                  borderRadius: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  zIndex: 2,
                }}
              >
                <Image
                  src="/icons/Frame 2087326561.png"
                  alt="Business Icon"
                  width={22.25}
                  height={24}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 400,
                    fontSize: "1rem", // 16px
                    lineHeight: "140%",
                    letterSpacing: 0,
                  }}
                >
                    {requestData?.category || ""}
                </Typography>
              </Box>

              {/* Main Image */}
              <Box
                sx={{
                  position: "relative",
                  height: "31.563rem",
                  width: "100%",
                  bgcolor: "#F3F4F6",
                }}
              >
                {(requestData?.images?.[currentImageIndex] || requestData?.images?.[0]) && (
                  <Image
                    src={requestData?.images?.[currentImageIndex] || requestData?.images?.[0]}
                    alt={requestData?.title || "Service Image"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Box>

              {/* Navigation Arrows */}
              <IconButton
                onClick={handlePreviousImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "45%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "45%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Box>

            {/* Thumbnail Images */}
            <Box sx={{ display: "flex", gap: "1.25rem", mb: "1.5rem" }}>
              {(requestData?.images || []).map((image: string, index: number) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    position: "relative",
                    width: "10.422rem",
                    height: "7.867rem",
                    borderRadius: "0.656rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      currentImageIndex === index
                        ? "0.125rem solid #2F6B8E"
                        : "0.125rem solid #E5E7EB",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                      opacity: 0.9,
                    },
                  }}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>

            {/* Service Description */}
            <Box
              sx={{
                mb: 4,
                border: "0.0625rem solid #E5E7EB",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#323232",
                  fontWeight: 600,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1.25rem", // 20px
                  letterSpacing: 0,
                  mb: 1.5,
                }}
              >
                Service description
              </Typography>
              <Typography
                sx={{
                  color: "#555555",
                  fontWeight: 400,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1.4",
                  letterSpacing: 0,
                  textAlign: "justify",
                  overflowWrap: "break-word", // This handles long unbroken text
      wordBreak: "break-word", // Additional breaking for very long strings
                }}
              >
                {requestData?.description || ""}
              </Typography>
            </Box>

            {/* About Client */}
            <Box
              sx={{
                mb: 4,
                border: "0.0625rem solid #E5E7EB",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#0F232F",
                  fontWeight: 600,
                  fontSize: "1.25rem", // 20px
                  lineHeight: "1.5rem", // 24px
                  letterSpacing: 0,
                  mb: 2,
                }}
              >
                About client
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <Avatar
                  src={requestData?.clientAvatar || "/image/main.png"}
                  alt={requestData?.clientName || "Client"}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {requestData?.clientName || ""}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Request Details and Quote Form */}
          <Box sx={{ minWidth: 0 }}>
            {/* Request Info Card */}
            <Box
              sx={{
                p: "16px",
                borderRadius: "1rem", // 16px
                bgcolor: "#FBFBFB",
                border: "1px solid #E6E6E6",
                mb: "1.25rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: "16px",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ color: "#2F6B8E" }}
                >
                  {requestData?.title || ""}
                </Typography>
                <Typography
                  sx={{
                    color: "#555555",
                    fontWeight: 500,
                    fontSize: "0.875rem", // 14px
                    lineHeight: "1.125rem", // 18px
                    letterSpacing: 0,
                  }}
                >
                  {requestData?.timeAgo || `${requestData?.date || ""}${requestData?.time ? `, ${requestData.time}` : ""}`}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "white",
                  p: "16px",
                  display: "grid",
                  borderRadius: "16px",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: { xs: "10px", md: "12px 16px" },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Image
                    src="/icons/fi_6374086.png"
                    alt="Service"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem", // 14px
                      lineHeight: "1.125rem", // 18px
                      letterSpacing: 0,
                    }}
                  >
                    {requestData?.serviceProvider || ""}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Image
                    src="/icons/Calendar.png"
                    alt="Date"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {requestData?.date || ""}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Image
                    src="/icons/Clock.png"
                    alt="Time"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {requestData?.time || ""}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <Image
                    src="/icons/MapPin.png"
                    alt="Location"
                    width={24}
                    height={24}
                  />
                  <Typography
                    sx={{
                      color: "#555555",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      lineHeight: "1.125rem",
                      letterSpacing: 0,
                    }}
                  >
                    {requestData?.location || ""}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider
              sx={{
                color: "#EAF0F3",
                mb: "1.25rem",
              }}
            />

            {/* Quote Form */}
            <Box
              sx={{
                borderRadius: 3,
                bgcolor: "white",
              }}
            >
              {/* Enter Quote Amount */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    fontWeight: 500,
                    fontSize: "1.0625rem", // 17px
                    lineHeight: "1.25rem", // 20px
                    letterSpacing: 0,
                    mb: "0.35rem",
                  }}
                >
                  Enter Quote Amount
                </Typography>
                <TextField
                  fullWidth
                  placeholder="€ 499.00"
                  {...formik.getFieldProps('quoteAmount')}
                  error={Boolean(formik.touched.quoteAmount && formik.errors.quoteAmount)}
                  helperText={formik.touched.quoteAmount && formik.errors.quoteAmount}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#939393",
                      fontSize: "1.125rem", // 18px
                      lineHeight: "140%",
                      fontWeight: 400,
                      letterSpacing: 0,
                    },
                  }}
                />
              </Box>

              {/* Personalized Message */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    fontWeight: 500,
                    fontSize: "1.0625rem", // 17px
                    lineHeight: "1.25rem", // 20px
                    letterSpacing: 0,
                    mb: "0.35rem",
                  }}
                >
                  Add personalized short message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description here..."
                  {...formik.getFieldProps('personalizedMessage')}
                  error={Boolean(
                    formik.touched.personalizedMessage && formik.errors.personalizedMessage
                  )}
                  helperText={
                    formik.touched.personalizedMessage && formik.errors.personalizedMessage
                      ? String(formik.errors.personalizedMessage)
                      : undefined
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem", // 12px
                      "& fieldset": {
                        borderColor: "#D5D5D5",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D5D5D5",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D5D5D5",
                      },
                    },
                    "& textarea": {
                      padding: "14px 16px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#939393",
                      fontSize: "1.125rem", // 18px
                      lineHeight: "140%",
                      fontWeight: 400,
                      letterSpacing: 0,
                    },
                  }}
                />
              </Box>

              {/* Attach Supporting Documents */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    fontWeight: 500,
                    fontSize: "1.0625rem", // 17px
                    lineHeight: "1.25rem", // 20px
                    letterSpacing: 0,
                    mb: "0.35rem",
                  }}
                >
                  Attach supporting documents
                </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {/* First Upload Box */}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "calc(50% - 5px)" },
                    height: "144px",
                    borderColor: supportFiles[0] ? "#2F6B8E" : "#D5D5D5",
                    color: "#6B7280",
                    textTransform: "none",
                    py: "10px",
                    borderRadius: "12px",
                    borderStyle: supportFiles[0] ? "solid" : "dashed",
                    position: "relative",
                    overflow: "hidden",
                    p: 0,
                    "&:hover": {
                      borderColor: "#214C65",
                      bgcolor: supportFiles[0] ? "transparent" : "rgba(33, 76, 101, 0.04)",
                    },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => handleSupportFileChange(e, 0)}
                  />
                  {supportFiles[0] ? (
                    supportFilePreviews[0] && supportFiles[0].type.startsWith("image/") ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        <Image
                          src={supportFilePreviews[0]}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {supportFiles[0].name.length > 20
                              ? `${supportFiles[0].name.substring(0, 20)}...`
                              : supportFiles[0].name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          bgcolor: "#FBFBFB",
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#2F6B8E",
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "1",
                            letterSpacing: 0,
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {supportFiles[0].name.length > 20
                            ? `${supportFiles[0].name.substring(0, 20)}...`
                            : supportFiles[0].name}
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Image
                        src="/icons/folder-upload-line.png"
                        alt="Upload"
                        width={24}
                        height={24}
                      />
                      <Typography
                        sx={{
                          color: "#818285",
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: "1",
                          letterSpacing: 0,
                        }}
                      >
                        upload from device
                      </Typography>
                    </Box>
                  )}
                </Button>
                
                {/* Second Upload Box */}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    flex: 1,
                    minWidth: { xs: "100%", sm: "calc(50% - 5px)" },
                    height: "144px",
                    borderColor: supportFiles[1] ? "#2F6B8E" : "#D5D5D5",
                    color: "#6B7280",
                    textTransform: "none",
                    py: "10px",
                    borderRadius: "12px",
                    borderStyle: supportFiles[1] ? "solid" : "dashed",
                    position: "relative",
                    overflow: "hidden",
                    p: 0,
                    "&:hover": {
                      borderColor: "#214C65",
                      bgcolor: supportFiles[1] ? "transparent" : "rgba(33, 76, 101, 0.04)",
                    },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => handleSupportFileChange(e, 1)}
                  />
                  {supportFiles[1] ? (
                    supportFilePreviews[1] && supportFiles[1].type.startsWith("image/") ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        <Image
                          src={supportFilePreviews[1]}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {supportFiles[1].name.length > 20
                              ? `${supportFiles[1].name.substring(0, 20)}...`
                              : supportFiles[1].name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          bgcolor: "#FBFBFB",
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#2F6B8E",
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "1",
                            letterSpacing: 0,
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {supportFiles[1].name.length > 20
                            ? `${supportFiles[1].name.substring(0, 20)}...`
                            : supportFiles[1].name}
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Image
                        src="/icons/folder-upload-line.png"
                        alt="Upload"
                        width={24}
                        height={24}
                      />
                      <Typography
                        sx={{
                          color: "#818285",
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: "1",
                          letterSpacing: 0,
                        }}
                      >
                        upload from device
                      </Typography>
                    </Box>
                  )}
                </Button>
              </Box>
            </Box>

              {/* Upload Video */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    fontWeight: 500,
                    fontSize: "1.0625rem", // 17px
                    lineHeight: "1.25rem", // 20px
                    letterSpacing: 0,
                    mb: "0.35rem",
                  }}
                >
                  Upload a short video (max 2 minutes)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    width: "100%",
                    height: "144px",
                    borderColor: videoFile ? "#2F6B8E" : "#D5D5D5",
                    color: "#6B7280",
                    textTransform: "none",
                    py: "10px",
                    borderRadius: "12px",
                    borderStyle: videoFile ? "solid" : "dashed",
                    position: "relative",
                    overflow: "hidden",
                    p: 0,
                    "&:hover": {
                      borderColor: "#214C65",
                      bgcolor: videoFile ? "transparent" : "rgba(33, 76, 101, 0.04)",
                    },
                  }}
                >
                  <input type="file" hidden accept="video/*" onChange={handleVideoFileChange} />
                  {videoFile ? (
                    videoPreview && videoFile.type.startsWith("video/") ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        {/* Video preview with play button overlay */}
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            borderRadius: "8px",
                            overflow: "hidden",
                            bgcolor: "#000",
                          }}
                        >
                          <video
                            src={videoPreview}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              bgcolor: "rgba(255, 255, 255, 0.8)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <PlayArrowIcon sx={{ fontSize: 24 }} />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {videoFile.name.length > 20
                              ? `${videoFile.name.substring(0, 20)}...`
                              : videoFile.name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          bgcolor: "#FBFBFB",
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#2F6B8E",
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "1",
                            letterSpacing: 0,
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {videoFile.name.length > 20
                            ? `${videoFile.name.substring(0, 20)}...`
                            : videoFile.name}
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Image
                        src="/icons/folder-upload-line.png"
                        alt="Upload Video"
                        width={24}
                        height={24}
                      />
                      <Typography
                        sx={{
                          color: "#818285",
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: "1",
                          letterSpacing: 0,
                        }}
                      >
                        upload from device
                      </Typography>
                    </Box>
                  )}
                </Button>
              </Box>

              {/* Submit Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => formik.handleSubmit()}
                disabled={isSubmitting || !formik.isValid}
                sx={{
                  bgcolor: "#214C65",
                  color: "#FFFFFF",
                  textTransform: "none",
                  py: "1.125rem",
                  borderRadius: 2,
                  fontSize: "1.1875rem", // 19px
                  lineHeight: "1.25rem", // 20px
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Submit Quote'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Quote Submitted Modal */}
      <QuoteSubmittedModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}