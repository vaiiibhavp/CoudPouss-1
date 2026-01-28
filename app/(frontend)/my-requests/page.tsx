"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import RejectServiceRequestModal from "@/components/RejectServiceRequestModal";
import ConfirmServiceRequestModal from "@/components/ConfirmServiceRequestModal";
import ProceedToPaymentModal from "@/components/ProceedToPaymentModal";
import ServiceConfirmSummaryModal from "@/components/ServiceConfirmSummaryModal";
import CompletedSection from "@/components/task-management/CompletedSection";
import ConfirmByElderSection from "@/components/my-request/ConfirmByElderSection";
import { request } from "http";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  ApiServiceRequest,
  getSafeImageSrc,
  ProviderInfo,
  ServiceDetailData,
  ServiceRequestsApiResponse,
  ServiceSearchApiResponse,
  ServiceSearchItem,
  STATUS_CONFIG,
  Request,
  ServiceDetailApiResponse,
  FavoriteResponse,
} from "./helper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "sonner";
import { ApiResponse } from "@/types";
import { log } from "console";
import RejectServiceModal from "@/components/cancel-service/RejectServiceModal";

export default function MyRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useSelector((state: RootState) => state.auth);
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
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailData | null>(
    null,
  );
  const [serviceDetailLoading, setServiceDetailLoading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const paymentRedirectIdRef = React.useRef<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ServiceSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rejectService, setRejectService] = useState(false);
  // const statusConfig =
  // STATUS_CONFIG[request.status] || STATUS_CONFIG.open;

  // Format date from ISO string to "16 Aug 2025" format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
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
      status: apiRequest.status as Request["status"],
      image:
        apiRequest.sub_category_logo ||
        apiRequest.service_type_photo_url ||
        "/image/service-image-1.png",
      category: apiRequest.category_name,
      location: "Paris, 75001", // TODO: Get from API if available
      quote: apiRequest.amount || 0,
      // professional: {
      //   name: "Bessie Cooper", // TODO: Get from API if available
      //   avatar: "/icons/testimonilas-1.png", // TODO: Get from API if available
      //   verified: true, // TODO: Get from API if available
      // },
      message:
        "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time. Whether it's a complex wardrobe or a simple table, we handle it all with care and professionalism.", // TODO: Get from API if available
      videos: [
        "/image/service-image-1.png",
        "/image/service-image-2.png",
        "/image/service-image-3.png",
      ], // TODO: Get from API if available
      quoteId: apiRequest.quoteid || undefined,
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
          // Check for payment redirect first
          const redirectId = paymentRedirectIdRef.current;
          if (redirectId) {
            const found = mappedRequests.find((r) => r.id === redirectId);
            if (found) {
              setOpenSummary(true);
              paymentRedirectIdRef.current = null;
              localStorage.removeItem("justPaidServiceId");
              return redirectId;
            }
          }

          if (mappedRequests.length > 0 && !prevSelected) {
            return mappedRequests[0].id;
          } else if (mappedRequests.length > 0 && prevSelected) {
            // Check if selected request still exists
            const exists = mappedRequests.find((r) => r.id === prevSelected);
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
    if (!serviceDetail) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === serviceDetail.service_id &&
        (serviceDetail.task_status === "pending" ||
          serviceDetail.task_status === "accepted" ||
          serviceDetail.task_status === "completed" ||
          serviceDetail.task_status === "cancelled") &&
        serviceDetail.provider
          ? {
              ...req,
              professional: {
                id: serviceDetail.provider.id,
                full_name: serviceDetail.provider?.full_name,
                profile_photo_url:
                  serviceDetail.provider?.profile_photo_url ||
                  serviceDetail.provider.profile_image_url,
                profile_image_url:
                  serviceDetail.provider?.profile_image_url ||
                  serviceDetail.provider.profile_photo_url,
                is_verified: serviceDetail.provider.is_verified,
                is_favorate: serviceDetail.provider.is_favorate,
                email: serviceDetail.provider.email,
                first_name: serviceDetail.provider.first_name,
                last_name: serviceDetail.provider.last_name,
              },
            }
          : req,
      ),
    );
  }, [serviceDetail]);

  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // Check for payment return
    const justPaidId = localStorage.getItem("justPaidServiceId");
    const paymentStatus = searchParams.get("payment_status");

    if (justPaidId) {
      if (paymentStatus === "success") {
        // Success: Trigger the success flow (switch tab, open modal)
        paymentRedirectIdRef.current = justPaidId;
        setActiveFilter("Validation");
      } else if (paymentStatus === "cancelled") {
        // Cancelled: Just select the request again so user lands on details
        setSelectedRequest(justPaidId);
        // Clean up immediately as we aren't waiting for a fetch loop to trigger a modal
        localStorage.removeItem("justPaidServiceId");
      }
      // If no status param (e.g. manual refresh), do nothing or keep default behavior
    }

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    } else if (accessToken) {
      fetchRequests();
    }
    // }, [router, fetchRequests]);

    // apiCallToGetAllCreatedRequests()
  }, [router, accessToken, fetchRequests]);

  // Fetch service details when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      fetchServiceDetail(selectedRequest);
    }
  }, [selectedRequest, fetchServiceDetail]);

  // API call to get service requests details
  const apiCallToGetDetailsOfCreatedRequests = async (requestId: string) => {
    try {
      let response = await apiGet(
        API_ENDPOINTS.SERVICE_REQUESTS.REQUEST_DETAILS(requestId),
      );

      console.log(response);
    } catch (error) {
      console.log("Error fetching service requests:", error);
    }
  };

  // const apiCallToGetAllCreatedRequests = async() => {
  //   // API call to fetch all created service requests
  //   try{
  //     let response = await apiGet(API_ENDPOINTS.SERVICE_REQUESTS.CREATE_REQUEST);

  //     console.log(response)
  //   }catch(error){
  //     console.log("Error fetching service requests:", error);
  //   }
  // }

  // // API call to get service requests details
  // const apiCallToGetDetailsOfCreatedRequests = async(requestId : string) => {
  //   try{
  //     let response = await apiGet(API_ENDPOINTS.SERVICE_REQUESTS.REQUEST_DETAILS(requestId));

  //     console.log(response)
  //   }catch(error){
  //     console.log("Error fetching service requests:", error);
  //   }
  // }

  const filters = [
    "All",
    "Open Proposal",
    "Responses",
    "Validation",
    "Completed",
    "Cancelled",
  ];

  // Requests are already filtered by API based on activeFilter
  const filteredRequests = requests;

  const selectedRequestData = requests.find(
    (req) => req.id === selectedRequest,
  );

  const handleNavigate = () => {
    const provider: ProviderInfo | undefined = serviceDetail?.provider;
    if (provider) {
      router.push(ROUTES.CHAT_id.replace(":id", provider?.id || ""));
    }
  };

  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavorite = async (
    professionalId?: string,
    isFavorite?: boolean,
  ) => {
    if (!professionalId || favoriteLoading) return;

    setFavoriteLoading(true);

    // 🔹 Snapshot for rollback
    const prevRequests = requests;

    // 🔹 Optimistic update
    setRequests((prev) =>
      prev.map((req) =>
        req.professional?.id === professionalId
          ? {
              ...req,
              professional: {
                ...req.professional,
                is_favorate: !isFavorite,
              },
            }
          : req,
      ),
    );

    try {
      let response: ApiResponse<FavoriteResponse>;

      if (isFavorite) {
        const endpoint =
          API_ENDPOINTS.FAVORITE_REAQUEST.DELETE_FAVORITE(professionalId);

        response = await apiDelete<FavoriteResponse>(endpoint);
      } else {
        const endpoint =
          API_ENDPOINTS.FAVORITE_REAQUEST.UPDATE_FAVORITE(professionalId);

        response = await apiPost<FavoriteResponse>(endpoint, {});
      }

      if (
        !response.success ||
        !Array.isArray(response.data?.data?.favorite_list)
      ) {
        throw new Error(response.data?.message || "Invalid favorite response");
      }

      const favoriteList = response.data.data?.favorite_list || [];

      setRequests((prev) =>
        prev.map((req) =>
          req.professional
            ? {
                ...req,
                professional: {
                  ...req.professional,
                  is_favorate: favoriteList.includes(req.professional.id),
                },
              }
            : req,
        ),
      );
    } catch (error) {
      console.error("Failed to update favorite status", error);

      // 🔹 Rollback UI on any failure
      setRequests(prevRequests);
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    const delay = setTimeout(async () => {
      try {
        const queryParams = new URLSearchParams({
          status: getStatusParam(activeFilter) || "all",
          search: search.trim(),
          page: "1",
          limit: "100",
        });

        const response = await apiGet<ServiceSearchApiResponse>(
          `${API_ENDPOINTS.SERVICE_REQUEST.SEARCH_REQUEST}?${queryParams
            .toString()
            .toLowerCase()}`,
        );

        if (response?.success && response.data) {
          setSearchResults(response.data.data?.recent_requests?.items || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search API error:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(delay);
      setSearchLoading(false);
    };
  }, [search, activeFilter]);

  console.log("searchResults", searchResults);

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
              position: "relative",
              justifyContent: { xs: "stretch", sm: "flex-end" },
              mb: { xs: 0, sm: 4 },
              width: { xs: "100%", sm: "auto" },
              flexDirection: "column",
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            {(searchLoading || searchResults.length > 0 || search.trim()) && (
              <Box
                sx={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  width: "100%",
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 1300,
                  maxHeight: 320,
                  overflowY: "auto",
                  p: 1,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {searchLoading && (
                  <Typography sx={{ color: "text.secondary", px: 1, py: 0.5 }}>
                    Searching...
                  </Typography>
                )}
                {!searchLoading &&
                  searchResults.length === 0 &&
                  search.trim() && (
                    <Typography
                      sx={{ color: "text.secondary", px: 1, py: 0.5 }}
                    >
                      No results found
                    </Typography>
                  )}
                {!searchLoading &&
                  searchResults.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => {
                        setSelectedRequest(item?.id);
                        setSearch("");
                        setSearchResults([]);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1,
                        py: 0.75,
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={
                            item.category_logo ||
                            "/icons/home_assistance_icon_home.svg"
                          }
                          alt={item.category_name || "Service"}
                          width={32}
                          height={32}
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#214C65",
                            lineHeight: 1.2,
                          }}
                        >
                          {item.sub_category_name}
                        </Typography>
                        <Typography
                          sx={{ color: "#6D6D6D", fontSize: "0.85rem" }}
                        >
                          {item.category_name}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
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
              position: "sticky",
              top: "20px",
              overflowY: "auto",
              maxHeight: "calc(100dvh - 40px)",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {loading ? (
                <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4 } }}>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Loading requests...
                  </Typography>
                </Box>
              ) : filteredRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4 } }}>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    No requests found
                  </Typography>
                </Box>
              ) : (
                filteredRequests.map((request) => {
                  const statusConfig =
                    STATUS_CONFIG[request.status || "pending"] ||
                    STATUS_CONFIG.open;
                  if (!statusConfig) return;

                  return (
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
                          selectedRequest === request.id
                            ? "#2F6B8E"
                            : "grey.200",
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
                                bgcolor: statusConfig.bgColor,
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
                                  bgcolor: statusConfig.dotColor,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: {
                                    xs: "0.625rem",
                                    sm: "0.6875rem",
                                    md: "0.75rem",
                                  },
                                  color: statusConfig.textColor,
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {statusConfig.label}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            component="span"
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
                  );
                })
              )}
            </Box>
          </Box>

          {/* RIGHT DETAILS */}

          {/* {showTracking ? ( */}
          {/* // <ConfirmByElderSection /> */}
          {/* // ) : ( */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              bgcolor: "white",
              zIndex: 10,
              minHeight: "100vh",
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
              ) : selectedRequestData ? (
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
                            selectedRequestData.image
                          }
                          alt={
                            serviceDetail?.sub_category_name ||
                            selectedRequestData.serviceName
                          }
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
                          {serviceDetail?.sub_category_name ||
                            selectedRequestData.serviceName}
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
                          {serviceDetail?.category_name ||
                            selectedRequestData.category}
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
                            : selectedRequestData.date}
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
                            : selectedRequestData.time}
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
                          {serviceDetail?.category_name ||
                            selectedRequestData.category}
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
                          title={
                            serviceDetail?.elder_address ||
                            selectedRequestData.location
                          }
                        >
                          {serviceDetail?.elder_address ||
                            selectedRequestData.location}
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
                            €
                            {serviceDetail?.total_renegotiated ||
                              selectedRequestData.quote}
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
                    {selectedRequestData.professional &&
                      serviceDetail?.task_status === "pending" && (
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
                                  selectedRequestData.professional?.id,
                                  selectedRequestData.professional?.is_favorate,
                                )
                              }
                            >
                              {selectedRequestData.professional?.is_favorate ? (
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
                                    selectedRequestData.professional
                                      ?.profile_photo_url,
                                  )}
                                  alt={
                                    selectedRequestData.professional
                                      ?.first_name || ""
                                  }
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
                                    {
                                      selectedRequestData.professional
                                        ?.full_name
                                    }
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
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: "0.5rem",
                                    // Reduced padding for a professional look
                                    px: { xs: 2, md: 4 },
                                    py: { xs: 1, sm: 1.25 },
                                    bgcolor: "#214C65",
                                    fontSize: {
                                      xs: "0.875rem",
                                      sm: "0.9375rem",
                                      md: "1rem",
                                    },
                                    width: { xs: "100%", sm: "auto" },
                                    // Optional: set a smaller minWidth if you want them uniform
                                    minWidth: { sm: "140px" },
                                    "&:hover": { bgcolor: "#214C65" },
                                  }}
                                >
                                  Chat
                                </Button>

                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    router.push(
                                      `/about-professional/${selectedRequestData.professional?.id}`,
                                    )
                                  }
                                  sx={{
                                    textTransform: "none",
                                    borderRadius: "0.5rem",
                                    px: { xs: 2, md: 4 },
                                    py: { xs: 1, sm: 1.25 },
                                    bgcolor: "#214C65",
                                    whiteSpace: "nowrap",
                                    fontSize: {
                                      xs: "0.875rem",
                                      sm: "0.9375rem",
                                      md: "1rem",
                                    },
                                    width: { xs: "100%", sm: "auto" },
                                    minWidth: { sm: "140px" },
                                    "&:hover": { bgcolor: "#214C65" },
                                  }}
                                >
                                  View Profile
                                </Button>
                              </Box>
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
                            selectedRequestData.message}
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
                          {(
                            serviceDetail?.media?.videos ||
                            selectedRequestData.videos
                          ).map((video, index) => (
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
                          ))}
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
                                onClick={() => setPreviewIndex(index)}
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
                          onClick={() => setRejectService(true)}
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
                          onClick={() => setOpenConfirm(true)}
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
            {selectedRequestData && serviceDetail && (
              <ConfirmByElderSection
                selectedRequestData={selectedRequestData}
                serviceDetail={serviceDetail}
                handleFavorite={handleFavorite}
                onCancelSuccess={() => {
                  fetchRequests();
                }}
              />
            )}
          </Box>
          {/* )} */}
        </Box>
      </Container>
      <Dialog
        open={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {previewIndex !== null && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "70vh", md: "80vh" },
              bgcolor: "black",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image
              src={serviceDetail?.media.photos[previewIndex] || ""}
              alt={`Preview ${previewIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
            />

            {/* Close */}
            <IconButton
              onClick={() => setPreviewIndex(null)}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Previous */}
            {previewIndex > 0 && (
              <IconButton
                onClick={() => setPreviewIndex((i) => (i! > 0 ? i! - 1 : i))}
                sx={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.5)",
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            {/* Next */}
            {serviceDetail &&
              previewIndex < serviceDetail.media.photos.length - 1 && (
                <IconButton
                  onClick={() =>
                    setPreviewIndex((i) =>
                      i! < serviceDetail.media.photos.length - 1 ? i! + 1 : i,
                    )
                  }
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
          </Box>
        )}
      </Dialog>
      <RejectServiceRequestModal
        serviceId={serviceDetail?.service_id || ""}
        open={openReject}
        onClose={() => setOpenReject(false)}
        onReject={(reason) => {}}
        onCancelSuccess={() => {
          fetchRequests();
        }}
      />
      <ConfirmServiceRequestModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          setOpenPayment(true);
        }}
        rate={serviceDetail?.total_renegotiated ?? 0}
        providerName="Wade Warren"
      />
      <ProceedToPaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        onProceed={() => {
          setOpenProceed(false);
          setOpenSummary(true);
        }}
        finalizedQuoteAmount={serviceDetail?.total_renegotiated ?? 0}
        platformFeePercent={10}
        taxes={12}
        serviceId={selectedRequestData?.id}
        quoteId={selectedRequestData?.quoteId}
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
        serviceTitle={
          serviceDetail?.sub_category_name ||
          serviceDetail?.category_name ||
          "Service"
        }
        serviceCategory={serviceDetail?.category_name || "Category"}
        serviceImage={
          serviceDetail?.sub_category_logo ||
          serviceDetail?.category_logo ||
          "/image/service-image-1.png"
        }
        location={serviceDetail?.elder_address || "Location not available"}
        dateLabel={selectedRequestData?.date || "Date"}
        timeLabel={selectedRequestData?.time || "Time"}
        providerName={serviceDetail?.provider?.full_name || "Provider"}
        providerId={serviceDetail?.provider?.id || null}
        providerPhone={serviceDetail?.provider?.email || ""} // Using email as phone fallback or just empty
        providerAvatar={
          serviceDetail?.provider?.profile_photo_url ||
          "/icons/testimonilas-1.png"
        }
        finalizedQuoteAmount={selectedRequestData?.quote || 0}
        platformFeePercent={10}
        taxes={12} // TODO: Calculate or fetch dynamically
      />
      <RejectServiceModal
        open={rejectService}
        onClose={() => setRejectService(false)}
        data={{
          service_id: serviceDetail?.service_id,
          quote_id: selectedRequestData?.quoteId,
        }}
        onSubmit={() => fetchRequests()}
      />
    </Box>
  );
}
