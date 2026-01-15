"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServiceRequestCard from "@/components/ServiceRequestCard";
import RecentTaskCard from "@/components/RecentTaskCard";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface ServiceRequest {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  serviceProvider: string;
  location: string;
  estimatedCost: string;
  timeAgo: string;
}

interface ApiServiceRequest {
  service_id: string;
  date: string;
  time: string;
  category_info: {
    category_id: string;
    category_name: {
      name: string;
      logo_url: string;
    };
  };
  subcategory_info: {
    sub_category_id: string;
    sub_category_name: {
      name: string;
      img_url: string;
    };
  };
  estimated_cost: number;
  location: string;
}

interface ApiResponse {
  status: boolean;
  msg: string;
  count: number;
  data: ApiServiceRequest[];
}

// Format date from "2026-01-05" to "16 Aug, 2025"
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
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

// Format time from "13:27" to "1:27 pm"
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Calculate time ago from date and time
const calculateTimeAgo = (dateString: string, timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date(dateString);
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  }
};

// Transform API response to ServiceRequest format
const transformServiceRequest = (
  apiRequest: ApiServiceRequest
): ServiceRequest => {
  // Format cost - remove trailing zeros if it's a whole number
  const cost = apiRequest.estimated_cost;
  const formattedCost =
    cost % 1 === 0 ? `€${cost.toFixed(0)}` : `€${cost.toFixed(2)}`;

  return {
    id: apiRequest.service_id,
    title: apiRequest.subcategory_info.sub_category_name.name,
    image:
      apiRequest.subcategory_info.sub_category_name.img_url ||
      "/image/main.png",
    date: formatDate(apiRequest.date),
    time: formatTime(apiRequest.time),
    serviceProvider: apiRequest.category_info.category_name.name,
    location: apiRequest.location,
    estimatedCost: formattedCost,
    timeAgo: calculateTimeAgo(apiRequest.date, apiRequest.time),
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service requests from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet<ApiResponse>(
          API_ENDPOINTS.SERVICE_REQUEST.OPEN_SERVICES
        );

        if (response.success && response.data) {
          const apiData = response.data.data || response.data;
          if (Array.isArray(apiData)) {
            const transformed = apiData.map(transformServiceRequest);
            setServiceRequests(transformed);
          } else {
            setError("Invalid response format");
            setServiceRequests([]);
          }
        } else {
          setError(
            response.error?.message || "Failed to fetch service requests"
          );
          setServiceRequests([]);
        }
      } catch (err) {
        console.error("Error fetching service requests:", err);
        setError("Failed to load service requests");
        setServiceRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  // Recent tasks data
  const recentTasks = {
    startedService: [
      {
        id: 1,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
      {
        id: 2,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
      {
        id: 3,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
      {
        id: 4,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
    ],
    outForService: [
      {
        id: 2,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
    ],
    quoteAccepted: [
      {
        id: 3,
        title: "Furniture Assembly",
        image: "/image/main.png",
        date: "16 Aug, 2025",
        time: "10:00 am",
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      {/* <Box
        sx={{
          mt: "9.375rem",
          px: "5.0625rem",
        }}
      >
        <Box
          sx={{
            bgcolor: "#2C6587",
            color: "white",
            borderRadius: "3.125rem",
            position: "relative",
            maxHeight: "22.5rem",
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >


            <Image
              src="/image/worker-with-side.png"
              alt="Professional"
              width={345}
              height={514}
              style={{
                marginTop: "-9.375rem",
              }}
            />


            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography
                  variant="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: "6.077rem",
                    lineHeight: "4.052rem",
                    letterSpacing: "0rem",
                    color: "#FFFFFF",
                  }}
                >
                  10
                </Typography>
                <Typography
                  fontWeight="600"
                  sx={{
                    fontSize: "2.532rem", 
                    lineHeight: "3.039rem", 
                    letterSpacing: "0rem",
                    color: "#FFFFFF",
                    whiteSpace: "pre-line",
                  }}
                >
                  {`Professionals\nConnected Today`}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#EAF0F3",
                    fontSize: "1.519rem", 
                    lineHeight: "2.279rem",     
                    letterSpacing: "0rem",
                    fontWeight: 400,
                    maxWidth: "28.125rem",
                  }}
                >
                  Lorem ipsum a pharetra mattis dilt pulvinar tortor amet
                  vulputate.
                </Typography>
              </Box>
            </Box>

            <Image
              src="/image/half-blue-circle.png"
              alt="Professional"
              width={350}
              height={262}
              style={{
                width: "auto",
                height: "16.375rem",
                borderRadius: "3.125rem",
                marginBottom: "auto",
              }}
            />
          </Box>
        </Box>
      </Box> */}

      <Box
        sx={{
          px: { xs: "1rem", md: "5.063rem" },
        }}
      >
        <Image
          src="/image/professionalHomeBanner.png"
          alt="Professional"
          style={{
            width: "100%",
          }}
          width={1278}
          height={514}
        />
      </Box>

      {/* Explore Service Requests Section */}
      <Box sx={{ mt: "3.688rem", px: { xs: "1rem", md: "5.063rem" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            mb: "2rem",
          }}
        >
          <Typography
            fontWeight={800}
            sx={{
              color: "#323232",
              fontSize: "1.688rem", // 27px
              lineHeight: "2rem", // 32px
              letterSpacing: "0.03em", // 3%
            }}
          >
            Explore Service Requests
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "#2C6587",
              borderColor: "#BECFDA",
              borderRadius: "0.5rem", // 8px
              px: "1.25rem", // 20px
              py: "0.5rem", // 8px
              minHeight: "2.5rem",
              fontSize: "1.1875rem", // 19px
              lineHeight: "1.75rem", // 28px
              fontWeight: 500,
              letterSpacing: "0em",
              textTransform: "none",
              boxShadow: "0px 10px 13.2px rgba(44, 101, 135, 0.06)",
              bgcolor: "#FFFFFF",
              "&:hover": {
                bgcolor: "#F5F8FA",
                borderColor: "#BECFDA",
              },
            }}
          >
            View all
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: "4rem",
            }}
          >
            <CircularProgress sx={{ color: "#2C6587" }} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: "4rem",
            }}
          >
            <Typography sx={{ color: "#737373", fontSize: "1rem" }}>
              {error}
            </Typography>
          </Box>
        ) : serviceRequests.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: "4rem",
            }}
          >
            <Typography sx={{ color: "#737373", fontSize: "1rem" }}>
              No service requests available
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              overflowX: "auto",
              overflowY: "hidden",
              scrollBehavior: "smooth",

              "&::-webkit-scrollbar": {
                height: 0,
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
                borderRadius: 0,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "transparent",
                borderRadius: 0,
                "&:hover": {
                  bgcolor: "transparent",
                },
              },
              msOverflowStyle: "none", // IE/Edge
              scrollbarWidth: "none", // Firefox
            }}
          >
            {serviceRequests.map((request) => (
              <Box
                key={request.id}
                sx={{
                  minWidth: { xs: "17.5rem", sm: "20rem", md: "18.75rem" },
                  flexShrink: 0,
                }}
              >
                <ServiceRequestCard
                  id={request.id}
                  title={request.title}
                  image={request.image}
                  date={request.date}
                  time={request.time}
                  serviceProvider={request.serviceProvider}
                  location={request.location}
                  estimatedCost={request.estimatedCost}
                  timeAgo={request.timeAgo}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Recent Tasks Section */}
      <Box sx={{ px: { xs: "1rem", md: "5.063rem" }, mt: "3rem", mb: "9.25rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            mb: "2.5rem",
          }}
        >
          <Typography
            fontWeight={800}
            sx={{
              color: "#323232",
              fontSize: "1.688rem", // 27px
              lineHeight: "2rem", // 32px
              letterSpacing: "0.03em", // 3%
            }}
          >
            Recent Task
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "#2C6587",
              borderColor: "#BECFDA",
              borderRadius: "0.5rem", // 8px
              px: "1.25rem", // 20px
              py: "0.5rem", // 8px
              minHeight: "2.5rem",
              fontSize: "1.1875rem", // 19px
              lineHeight: "1.75rem", // 28px
              fontWeight: 500,
              letterSpacing: "0em",
              textTransform: "none",
              boxShadow: "0px 10px 13.2px rgba(44, 101, 135, 0.06)",
              bgcolor: "#FFFFFF",
              "&:hover": {
                bgcolor: "#F5F8FA",
                borderColor: "#BECFDA",
              },
            }}
          >
            View all
          </Button>
        </Box>

        {/* Task Cards */}
        <Box
          sx={{
            display: "flex",
            gap: "1.25rem",
            justifyContent: "space-between",
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: 0,
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
              borderRadius: 0,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "transparent",
              borderRadius: 0,
              "&:hover": {
                bgcolor: "transparent",
              },
            },
            msOverflowStyle: "none", // IE/Edge
            scrollbarWidth: "none", // Firefox
          }}
        >
          {/* Started Service Card */}
          {recentTasks.startedService.map((task) => (
            <RecentTaskCard
              key={task.id}
              title={task.title}
              image={task.image}
              date={task.date}
              time={task.time}
              category="Started Service"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
