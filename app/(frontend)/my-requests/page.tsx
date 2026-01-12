"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import RejectServiceRequestModal from "@/components/RejectServiceRequestModal";
import ConfirmServiceRequestModal from "@/components/ConfirmServiceRequestModal";
import ProceedToPaymentModal from "@/components/ProceedToPaymentModal";
import ServiceConfirmSummaryModal from "@/components/ServiceConfirmSummaryModal";
import CompletedSection from "@/components/task-management/CompletedSection";
import ConfirmByElderSection from "@/components/my-request/ConfirmByElderSection";

interface Request {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "Open Proposal" | "Responded";
  image: string;
  category: string;
  location: string;
  quote: number;
  professional: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  message: string;
  videos: string[];
}

interface ApiServiceRequest {
  id: string;
  category_id: string;
  sub_category_id: string;
  is_professional: boolean;
  status: string;
  amount: number | null;
  quoteid: string | null;
  total_renegotiated: string | null;
  chosen_datetime: string;
  created_at: string;
  service_type_photo_url: string;
  category_name: string;
  category_logo: string;
  sub_category_name: string;
  sub_category_logo: string;
  created_date: string;
}

interface ServiceRequestsApiResponse {
  message: string;
  data: {
    recent_requests: {
      total_items: number;
      page: number;
      limit: number;
      items: ApiServiceRequest[];
    };
  };
  success: boolean;
  status_code: number;
}

interface LifecycleItem {
  id: number;
  name: string;
  time: string | null;
  completed: boolean;
}

interface ServiceMedia {
  photos: string[];
  videos: string[];
}

interface ServiceDetailData {
  service_id: string;
  task_status: string;
  service_description: string;
  chosen_datetime: string;
  category_name: string;
  category_logo: string;
  sub_category_name: string;
  sub_category_logo: string;
  elder_address: string;
  lifecycle: LifecycleItem[];
  total_renegotiated: number;
  media: ServiceMedia;
}

interface ServiceDetailApiResponse {
  message: string;
  data: ServiceDetailData;
  success: boolean;
  status_code: number;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [openReject, setOpenReject] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openProceed, setOpenProceed] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailData | null>(null);
  const [serviceDetailLoading, setServiceDetailLoading] = useState(false);

  // Format date from ISO string to "16 Aug 2025" format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format time from ISO string to "10:00 am" format
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${period}`;
  };

  // Map API status to UI status
  const mapStatus = (apiStatus: string): "Open Proposal" | "Responded" => {
    if (apiStatus === "pending") {
      return "Responded";
    }
    return "Open Proposal";
  };

  // Get status query param based on active filter
  const getStatusParam = (filter: string): string => {
    switch (filter) {
      case "Open Proposal":
        return "open";
      case "Responses":
        return "pending";
      case "Validation":
        return "accepted"; // Assuming this is the status for validation
      case "Completed":
        return "completed";
      case "Cancelled":
        return "cancelled";
      case "All":
      default:
        return "all";
    }
  };

  // Map API response to Request interface
  const mapApiRequestToRequest = (apiRequest: ApiServiceRequest): Request => {
    return {
      id: apiRequest.id,
      serviceName: apiRequest.sub_category_name || apiRequest.category_name,
      date: formatDate(apiRequest.chosen_datetime),
      time: formatTime(apiRequest.chosen_datetime),
      status: mapStatus(apiRequest.status),
      image: apiRequest.sub_category_logo || apiRequest.service_type_photo_url || "/image/service-image-1.png",
      category: apiRequest.category_name,
      location: "Paris, 75001", // TODO: Get from API if available
      quote: apiRequest.amount || 0,
      professional: {
        name: "Bessie Cooper", // TODO: Get from API if available
        avatar: "/icons/testimonilas-1.png", // TODO: Get from API if available
        verified: true, // TODO: Get from API if available
      },
      message: "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time. Whether it's a complex wardrobe or a simple table, we handle it all with care and professionalism.", // TODO: Get from API if available
      videos: [
        "/image/service-image-1.png",
        "/image/service-image-2.png",
        "/image/service-image-3.png",
      ], // TODO: Get from API if available
    };
  };

  // Fetch requests from API
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status = getStatusParam(activeFilter);
      const endpoint = `${API_ENDPOINTS.SERVICE_REQUEST.GET_SERVICES}?page=1&limit=30&status=${status}`;

      const response = await apiGet<ServiceRequestsApiResponse>(endpoint);

      if (response.success && response.data?.data?.recent_requests?.items) {
        const apiRequests = response.data.data.recent_requests.items;
        const mappedRequests = apiRequests.map(mapApiRequestToRequest);
        setRequests(mappedRequests);
        
        // Auto-select first request if available
        setSelectedRequest((prevSelected) => {
          if (mappedRequests.length > 0 && !prevSelected) {
            return mappedRequests[0].id;
          } else if (mappedRequests.length > 0 && prevSelected) {
            // Check if selected request still exists
            const exists = mappedRequests.find(r => r.id === prevSelected);
            return exists ? prevSelected : mappedRequests[0].id;
          } else {
            return null;
          }
        });
      } else {
        setRequests([]);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      setRequests([]);
      setSelectedRequest(null);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // Fetch service details when a request is selected
  const fetchServiceDetail = useCallback(async (serviceId: string) => {
    setServiceDetailLoading(true);
    try {
      const response = await apiPost<ServiceDetailApiResponse>(
        API_ENDPOINTS.SERVICE_REQUEST.GET_SERVICE_DETAIL,
        { service_id: serviceId }
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
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    } else {
      fetchRequests();
    }
  }, [router, fetchRequests]);

  // Fetch service details when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      fetchServiceDetail(selectedRequest);
    } else {
      setServiceDetail(null);
    }
  }, [selectedRequest, fetchServiceDetail]);

  const filters = ["All", "Open Proposal", "Responses", "Validation", "Completed", "Cancelled"];

  // Requests are already filtered by API based on activeFilter
  const filteredRequests = requests;

  const selectedRequestData = requests.find(
    (req) => req.id === selectedRequest
  );

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Header /> */}
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
            lineHeight: { xs: "1.5rem", md: "1.75rem" },
            letterSpacing: "0%",
            fontWeight: 600,
            color: "primary.normal",
            mb: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          Request Management
        </Typography>

        {/* Filters + Search */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 0 },
            pr: { xs: 0, md: 4 },
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 0.75, sm: 1 },
                mb: { xs: 2, sm: 2.5, md: 3 },
                flexWrap: "wrap",
              }}
            >
              {filters.map((filter) => (
                <Button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setSelectedRequest(null); // Reset selection when filter changes
                  }}
                  variant={activeFilter === filter ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                    fontWeight: 500,
                    bgcolor:
                      activeFilter === filter
                        ? "primary.normal"
                        : "transparent",
                    color: activeFilter === filter ? "white" : "text.secondary",
                    borderColor:
                      activeFilter === filter ? "primary.normal" : "grey.300",
                    "&:hover": {
                      bgcolor:
                        activeFilter === filter ? "primary.normal" : "grey.50",
                      borderColor: "primary.normal",
                    },
                  }}
                >
                  {filter}
                </Button>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", sm: "flex-end" },
              mb: { xs: 0, sm: 4 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", sm: 300, md: 478 },
                bgcolor: "white",
                borderRadius: { xs: 1.5, sm: 2 },
                border: "0.0625rem solid",
                borderColor: "grey.300",
                overflow: "hidden",
              }}
            >
              <InputBase
                placeholder="Search"
                startAdornment={
                  <Image
                    src={"/icons/Loupe.png"}
                    alt="searchIcon"
                    width={20}
                    height={20}
                    style={{
                      marginRight: "0.625rem",
                    }}
                  />
                }
                sx={{
                  flex: 1,
                  px: { xs: 0.75, sm: 1 },
                  py: { xs: 0.75, sm: 1 },
                  "& .MuiInputBase-input": {
                    color: "text.primary",
                    fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#555555",
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ pr: { xs: 0, md: 4 } }}>
          <Divider sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            flexDirection: { xs: "column", lg: "row" },
            flex: 1,
          }}
        >
          {/* LEFT LIST */}
          <Box
            sx={{
              width: { xs: "100%", lg: 400 },
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
              {loading ? (
                <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4 } }}>
                  <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" } }}>Loading requests...</Typography>
                </Box>
              ) : filteredRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4 } }}>
                  <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" } }}>No requests found</Typography>
                </Box>
              ) : (
                filteredRequests.map((request) => (
                <Box
                  key={request.id}
                  onClick={() => setSelectedRequest(request.id)}
                  sx={{
                    py: { xs: "0.5rem", sm: "0.65625rem" },
                    pl: { xs: "0.5rem", sm: "0.625rem" },
                    pr: { xs: "0.5rem", sm: "0.625rem" },
                    borderRadius: { xs: "0.5rem", sm: "0.75rem" },
                    cursor: "pointer",
                    border: "0.0625rem solid",
                    borderColor:
                      selectedRequest === request.id ? "#2F6B8E" : "grey.200",
                    bgcolor:
                      selectedRequest === request.id
                        ? "rgba(47, 107, 142, 0.05)"
                        : "white",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 } }}>
                    <Box
                      sx={{
                        width: { xs: "4rem", sm: "5.5rem" },
                        height: { xs: "3.5rem", sm: "4.625rem" },
                        borderRadius: { xs: "0.5rem", sm: "0.75rem" },
                        overflow: "hidden",
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={request.image}
                        alt={request.serviceName}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: { xs: 0.25, sm: 0.5 },
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                            lineHeight: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                            letterSpacing: "0%",
                            color: "#424242",
                            fontWeight: 600,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {request.serviceName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            bgcolor:
                              request.status === "Responded"
                                ? "rgba(245, 158, 11, 0.1)"
                                : "rgba(16, 185, 129, 0.1)",
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.125, sm: 0.25 },
                            borderRadius: { xs: "0.375rem", sm: "0.5rem" },
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 5, sm: 6 },
                              height: { xs: 5, sm: 6 },
                              borderRadius: "50%",
                              bgcolor:
                                request.status === "Responded"
                                  ? "#F59E0B"
                                  : "#10B981",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                              color:
                                request.status === "Responded"
                                  ? "#F59E0B"
                                  : "#10B981",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {request.status === "Responded"
                              ? "Responded"
                              : request.status}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                          lineHeight: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                          letterSpacing: "0%",
                          color: "#555555",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        {request.date}
                        <Box
                          component="span"
                          sx={{
                            width: { xs: 3, sm: 4 },
                            height: { xs: 3, sm: 4 },
                            borderRadius: "50%",
                            bgcolor: "#2F6B8E",
                            display: "inline-block",
                          }}
                        />
                        {request.time}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                ))
              )}
            </Box>
          </Box>

          {/* RIGHT DETAILS */}

          {showTracking ? (
            <ConfirmByElderSection />
          ) : (
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
                  <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    Loading service details...
                  </Typography>
                </Box>
              ) : selectedRequestData ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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
                          borderRadius: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={serviceDetail?.sub_category_logo || serviceDetail?.category_logo || selectedRequestData.image}
                          alt={serviceDetail?.sub_category_name || selectedRequestData.serviceName}
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
                            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                            lineHeight: { xs: "1.375rem", sm: "1.5rem", md: "1.75rem" },
                            letterSpacing: "0%",
                            color: "#424242",
                            fontWeight: "bold",
                            mb: { xs: 0.5, sm: 0.75 },
                          }}
                        >
                          {serviceDetail?.sub_category_name || selectedRequestData.serviceName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                            lineHeight: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                            letterSpacing: "0%",
                            color: "#6D6D6D",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.category_name || selectedRequestData.category}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DATE / TIME / CATEGORY / LOCATION */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                        bgcolor: "#FBFBFB",
                        p: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        borderRadius: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                        rowGap: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
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
                            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                            lineHeight: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.chosen_datetime ? formatDate(serviceDetail.chosen_datetime) : selectedRequestData.date}
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
                            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                            lineHeight: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.chosen_datetime ? formatTime(serviceDetail.chosen_datetime) : selectedRequestData.time}
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
                            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                            lineHeight: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.category_name || selectedRequestData.category}
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
                            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                            lineHeight: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#2C6587",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.elder_address || selectedRequestData.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* QUOTE ROW */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                          lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                          letterSpacing: "0%",
                          color: "#323232",
                          fontWeight: 400,
                          mb: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
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
                          borderRadius: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                          border: "0.0625rem solid #D5D5D5",
                          pt: { xs: "0.75rem", sm: "0.875rem" },
                          pr: { xs: "0.75rem", sm: "1rem" },
                          pb: { xs: "0.75rem", sm: "0.875rem" },
                          pl: { xs: "0.75rem", sm: "1rem" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "1.25rem", sm: "1.4375rem", md: "1.6875rem" },
                            lineHeight: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                            letterSpacing: "3%",
                            textAlign: { xs: "left", sm: "center" },
                            color: "#0F232F",
                            fontWeight: "bold",
                            mb: { xs: 1, sm: 0 },
                          }}
                        >
                          €{serviceDetail?.total_renegotiated || selectedRequestData.quote}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            borderRadius: { xs: "0.375rem", sm: "0.5rem" },
                            pt: { xs: "0.5rem", sm: "0.625rem" },
                            pr: { xs: "1rem", sm: "1.25rem" },
                            pb: { xs: "0.5rem", sm: "0.625rem" },
                            pl: { xs: "1rem", sm: "1.25rem" },
                            gap: "0.625rem",
                            bgcolor: "#214C65",
                            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
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

                    {/* PROFESSIONAL ROW */}
                    <Box
                      sx={{
                        border: "0.0625rem solid #E6E6E6",
                        borderRadius: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
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
                            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                            lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#323232",
                            fontWeight: 400,
                          }}
                        >
                          About professional
                        </Typography>

                        <IconButton size="small">
                          <FavoriteBorderIcon fontSize="small" />
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
                          sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}
                        >
                          <Box
                            sx={{
                              width: { xs: "3rem", sm: "3.25rem", md: "3.5rem" },
                              height: { xs: "3rem", sm: "3.25rem", md: "3.5rem" },
                              borderRadius: "50%",
                              overflow: "hidden",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={selectedRequestData.professional.avatar}
                              alt={selectedRequestData.professional.name}
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
                                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                  lineHeight: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                                  letterSpacing: "0%",
                                  color: "#0F232F",
                                  fontWeight: 500,
                                }}
                              >
                                {selectedRequestData.professional.name}
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

                        <Box sx={{ display: "flex", gap: { xs: "0.5rem", sm: "0.75rem" }, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
                          <Button
                            variant="contained"
                            sx={{
                              textTransform: "none",
                              borderRadius: { xs: "0.375rem", sm: "0.5rem" },
                              pt: { xs: "0.5rem", sm: "0.625rem" },
                              pr: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                              pb: { xs: "0.5rem", sm: "0.625rem" },
                              pl: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                              gap: "0.625rem",
                              bgcolor: "#214C65",
                              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                              width: { xs: "100%", sm: "auto" },
                              minWidth: { xs: "auto", sm: "120px", md: "200px" },
                              "&:hover": {
                                bgcolor: "#214C65",
                              },
                            }}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              textTransform: "none",
                              borderRadius: { xs: "0.375rem", sm: "0.5rem" },
                              pt: { xs: "0.5rem", sm: "0.625rem" },
                              pr: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                              pb: { xs: "0.5rem", sm: "0.625rem" },
                              pl: { xs: "1rem", sm: "2rem", md: "3.75rem" },
                              gap: "0.625rem",
                              bgcolor: "#214C65",
                              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
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

                    {/* PERSONALIZED MESSAGE */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
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
                          border: "0.0625rem solid #D5D5D5",
                          borderRadius: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                          pt: { xs: "0.75rem", sm: "0.875rem" },
                          pr: { xs: "0.75rem", sm: "1rem" },
                          pb: { xs: "0.75rem", sm: "0.875rem" },
                          pl: { xs: "0.75rem", sm: "1rem" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                            lineHeight: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                            letterSpacing: "0%",
                            color: "#6D6D6D",
                            fontWeight: 400,
                          }}
                        >
                          {serviceDetail?.service_description || selectedRequestData.message}
                        </Typography>
                      </Box>
                    </Box>

                    {/* SHORT VIDEOS */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
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
                          <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            Loading videos...
                          </Typography>
                        </Box>
                      ) : (serviceDetail?.media?.videos && serviceDetail.media.videos.length > 0) || (selectedRequestData.videos && selectedRequestData.videos.length > 0) ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: "0.75rem", sm: "1rem", md: "1.125rem" },
                          }}
                        >
                          {(serviceDetail?.media?.videos || selectedRequestData.videos).map((video, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: "100%",
                                height: { xs: "8rem", sm: "8.5rem", md: "9rem" },
                                borderRadius: { xs: 1.5, sm: 2 },
                                overflow: "hidden",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={video}
                                alt={`Video ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                            No videos available
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* PHOTOS */}
                    {serviceDetail?.media?.photos && serviceDetail.media.photos.length > 0 && (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                            lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
                            letterSpacing: "0%",
                            color: "#323232",
                            fontWeight: 400,
                            mb: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                          }}
                        >
                          Job Photos
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: "0.75rem", sm: "1rem", md: "1.125rem" },
                          }}
                        >
                          {serviceDetail.media.photos.map((photo, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: "100%",
                                height: { xs: "8rem", sm: "8.5rem", md: "9rem" },
                                borderRadius: { xs: 1.5, sm: 2 },
                                overflow: "hidden",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* SUPPORTING DOCUMENTS */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
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
                              flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 0.5rem)", md: "1 1 12.5rem" },
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
                                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                                lineHeight: { xs: "1.0625rem", sm: "1.125rem" },
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
                        onClick={() => setOpenReject(true)}
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          width: { xs: "100%", sm: "192px" },
                          height: { xs: "48px", sm: "56px" },
                          borderRadius: { xs: "0.5rem", sm: "0.75rem", md: "12px" },
                          border: "1px solid #214C65",
                          borderColor: "#214C65",
                          p: { xs: "8px", sm: "10px" },
                          gap: "10px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => setOpenConfirm(true)}
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          width: { xs: "100%", sm: "12.8125rem" },
                          height: { xs: "48px", sm: "3.5rem" },
                          borderRadius: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
                          p: { xs: "0.5rem", sm: "0.625rem" },
                          gap: "0.625rem",
                          bgcolor: "#214C65",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                          "&:hover": {
                            bgcolor: "#214C65",
                          },
                        }}
                      >
                        Accept
                      </Button>
                    </Box>
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
          )}
        </Box>
      </Container>
      <RejectServiceRequestModal
        open={openReject}
        onClose={() => setOpenReject(false)}
        onReject={(reason) => {
          console.log("Rejected with reason:", reason);
        }}
      />
      ;
      <ConfirmServiceRequestModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          setOpenPayment(true);
        }}
        rate={499}
        providerName="Wade Warren"
      />
      ;
      <ProceedToPaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        onProceed={() => {
          setOpenProceed(false);
          setOpenSummary(true);
        }}
        finalizedQuoteAmount={499}
        platformFeePercent={10}
        taxes={12}
      />
      <ServiceConfirmSummaryModal
        open={openSummary}
        onClose={() => setOpenSummary(false)}
        onTrackService={() => {
          // navigate to tracking page
          setOpenSummary(false);
          setOpenPayment(false);
          setShowTracking(true);
        }}
        serviceTitle="Furniture Assembly"
        serviceCategory="DIY Services"
        location="Paris, 75001"
        dateLabel="16 Aug, 2025"
        timeLabel="10:00 am"
        providerName="Wade Warren"
        providerPhone="+97125111111"
        finalizedQuoteAmount={499}
        platformFeePercent={10}
        taxes={12}
      />
    </Box>
  );
}
