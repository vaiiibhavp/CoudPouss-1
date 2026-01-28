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

interface ApiRecentTask {
  service_id: string;
  category: {
    name: string;
    image_url: string;
  };
  subcategory: {
    name: string;
    image_url: string;
  };
  date: string;
  time: string;
}

interface RecentTask {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
}

interface ApiResponse {
  status: boolean;
  msg: string;
  data: {
    stats: {
      verified_providers_today: {
        status: boolean;
        count: number;
      };
    };
    open_services: ApiServiceRequest[];
    recent_tasks: {
      count: number;
      data: ApiRecentTask[];
    };
  };
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

// Transform API recent task to RecentTask format
const transformRecentTask = (apiTask: ApiRecentTask): RecentTask => {
  return {
    id: apiTask.service_id,
    title: apiTask.subcategory.name,
    image: apiTask.subcategory.image_url || "/image/main.png",
    date: formatDate(apiTask.date),
    time: apiTask.time,
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [verifiedProvidersCount, setVerifiedProvidersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service requests and recent tasks from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet<ApiResponse>(
          API_ENDPOINTS.SERVICE_REQUEST.OPEN_SERVICES
        );

        console.log({ response })

        if (response.success && response.data) {
          // Extract open services
          const openServices = response.data.data?.open_services;
          if (Array.isArray(openServices)) {
            const transformedServices = openServices.map(transformServiceRequest);
            setServiceRequests(transformedServices);
          } else {
            setServiceRequests([]);
          }

          // Extract recent tasks
          const recentTasksData = response.data.data?.recent_tasks?.data;
          if (Array.isArray(recentTasksData)) {
            const transformedTasks = recentTasksData.map(transformRecentTask);
            setRecentTasks(transformedTasks);
          } else {
            setRecentTasks([]);
          }

          // Extract verified providers count
          if (response.data.data?.stats?.verified_providers_today?.count !== undefined) {
            setVerifiedProvidersCount(response.data.data.stats.verified_providers_today.count);
          }
        } else {
          setError(
            response.error?.message || "Failed to fetch service requests"
          );
          setServiceRequests([]);
          setRecentTasks([]);
        }
      } catch (err) {
        console.error("Error fetching service requests:", err);
        setError("Failed to load service requests");
        setServiceRequests([]);
        setRecentTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

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



      {
        recentTasks.length > 0 ?

          // <Box
          //   sx={{
          //     px: { xs: "1rem", md: "5.063rem" },
          //   }}
          // >
          //   <Image
          //     src="/image/professionalHomeBanner.png"
          //     alt="Professional"
          //     style={{
          //       width: "100%",
          //     }}
          //     width={1278}
          //     height={514}
          //   />
          // </Box> :


          <Box
            sx={{
              position: "relative",
              mb: { xs: 1, md: 3 },
              mt: { xs: "30px", sm: "60px", md: "126px" },
              overflow: "visible",
              px: { xs: "1rem", md: "5.063rem" },
            }}
          >
            <Box
              sx={{
                bgcolor: "#2F6B8E",
                color: "white",
                minHeight: { xs: "7.5rem", sm: "10rem", md: "12.5rem" },
                borderRadius: { xs: "20px", sm: "45px", md: "50px" },
                display: "flex",
                alignItems: "center",
                gap: { xs: "0.25rem", sm: "0.75rem", md: "0.977rem" },
                position: "relative",
                overflow: "visible",
                // px: { xs: "10px", md: "0px" }
              }}
            >
              {/* Floating Image */}


              <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }} >


                <Box
                  sx={{
                    mt: { xs: "-3rem", sm: "-4rem", md: "-7rem" },
                    // display: { xs: "none", sm: "block" },
                    "& img": {
                      width: { xs: "150px", sm: "225px", md: "345px" },
                      height: "auto"
                    }
                  }}
                >
                  <Image
                    src="/image/worker-with-side.png"
                    alt="Professional"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "auto",
                    }}
                    width={345}
                    height={514}
                  />
                </Box>
                <Box sx={{
                  maxWidth: "436px",
                  paddingRight: { xs: "20px", sm: "0px", md: "0px" }

                }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.5, sm: 1 },
                      mb: { xs: "0.5rem", md: "29px" },
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "2.5rem",
                          sm: "4rem",
                          md: "97.23px",

                        },
                        lineHeight: {
                          xs: "2rem",
                          sm: "3.5rem",
                          md: "64.83px",
                        },
                        fontWeight: "700",
                      }}
                    >
                      {verifiedProvidersCount}
                    </Typography>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "1.2rem",
                            md: "40.51px",
                          },
                          lineHeight: {
                            xs: "1rem",
                            sm: "1.4rem",
                          },
                          mb: { xs: 0, md: "24px" }
                        }}
                      >
                        Professionals

                      </Typography>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "1.2rem",
                            md: "40.51px",
                          },
                          lineHeight: {
                            xs: "1rem",
                            sm: "1.4rem",

                          },
                        }}
                      >
                        Connected Today
                      </Typography>
                    </Box>

                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: {
                        xs: "0.5rem",
                        sm: "0.75rem",
                        md: "24.31px",
                      },
                      lineHeight: {
                        xs: "0.7rem",
                        sm: "1rem",
                        md: "1.8rem",
                      },
                    }}
                  >
                    Professionals have joined to serve with <br /> skill, responsibility, and care.
                  </Typography>
                </Box>
                <Box sx={{
                  display: { xs: "none", sm: "block" },
                  marginBottom: "auto",
                  height: { xs: "90px", sm: "200px", md: "19.375rem" },
                  "& img": {
                    height: "100% !important",
                    width: "auto !important",
                    borderRadius: { xs: "1rem", md: "3.125rem" }
                  }
                }}>
                  <Image
                    src="/image/half-blue-circle.png"
                    alt="Professional"
                    width={350}
                    height={262}
                    style={{
                      width: "auto",
                      height: "19.375rem",
                      borderRadius: "3.125rem",
                      marginBottom: "auto",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box> :

          <Box
            sx={{
              pt: { xs: "2rem", sm: "2.5rem", md: "3.563rem" },
              px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
              pb: { xs: "2rem", sm: "3rem", md: "5rem" },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2, sm: 3, md: 4 },
                alignItems: "center",
              }}
            >
              <Box>


                {/* Blue Card - 10 Professionals Connected Today */}
                <Box
                  sx={{
                    position: "relative",
                    mb: { xs: 2, md: 3 },
                    overflow: "visible",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#2F6B8E",
                      color: "white",
                      minHeight: { xs: "10rem", sm: "11rem", md: "12.5rem" },
                      borderRadius: { xs: "0.75rem", md: "1.242rem" },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: "0.5rem", sm: "0.75rem", md: "0.977rem" },
                      position: "relative",
                      overflow: "visible",
                      px: { xs: "1rem", sm: "1.5rem", md: "1.977rem" },
                      pt: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                    }}
                  >
                    {/* Floating Image */}
                    <Box
                      sx={{
                        mt: { xs: "-3rem", sm: "-4rem", md: "-5.625rem" },
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      <Image
                        src="/image/how-work-img-3.png"
                        alt="Professional"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        width={204}
                        height={137}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 0.5, sm: 1 },
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "1.5rem",
                              sm: "2.5rem",
                              md: "3rem",
                              lg: "3.276rem",
                            },
                            lineHeight: {
                              xs: "1.5rem",
                              sm: "2rem",
                              md: "2.184rem",
                            },
                            fontWeight: "600",
                          }}
                        >
                          {verifiedProvidersCount}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.875rem",
                              sm: "1rem",
                              md: "1.365rem",
                            },
                            lineHeight: {
                              xs: "1.2rem",
                              sm: "1.4rem",
                              md: "1.638rem",
                            },
                          }}
                        >
                          Professionals <br />
                          Connected Today
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontSize: {
                            xs: "0.625rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                          lineHeight: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.125rem",
                          },
                        }}
                      >
                        Lorem ipsum a pharetra mattis dilt pulvinar tortor amet
                        vulputate.
                      </Typography>
                    </Box>
                  </Box>
                </Box>


                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.5rem",
                      sm: "1.875rem",
                      md: "2rem",
                      lg: "2.5rem",
                    },
                    lineHeight: "150%",
                    color: "#323232",
                    fontWeight: 600,
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  Home services at your doorstep
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.naturalGray"
                  sx={{
                    mb: { xs: 3, sm: 4, md: 8 },
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Making home care simple, safe, and accessible for seniors. Find
                  trusted professionals for repairs, cleaning, and more — right at
                  your doorstep.
                </Typography>

                {/* Yellow Home Assistance Button */}
                {/* {services.length > 0 && (() => {
                    const firstService = services[0];
                    const { route, icon } = getServiceRouteAndIcon(firstService.name);
                    return (
                      <Box
                        component={Link}
                        href={route}
                        sx={{
                          borderTopLeftRadius: { xs: "0.5rem", md: "0.75rem" },
                          borderTopRightRadius: { xs: "1.5rem", md: "2.5rem" },
                          borderBottomLeftRadius: { xs: "1.5rem", md: "2.5rem" },
                          borderBottomRightRadius: { xs: "0.5rem", md: "0.75rem" },
                          bgcolor: "#FDBE12",
                          mb: { xs: "1rem", md: "1.563rem" },
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          overflow: "hidden",
                          textDecoration: "none",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "#E6A910",
                          },
                        }}
                      >
                        <Box sx={{
                          px: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
                          py: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
                          ml: { xs: 0, md: "1.188rem" },
                          flex: 1,
                        }} >
                          <Typography
                            sx={{
                              color: "#323232",
                              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                              fontWeight: 600,
                              lineHeight: { xs: "1.5rem", md: "1.75rem" }
                            }}
                          >
                            {firstService.name}
                          </Typography>
      
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mr: { xs: "0.25rem", md: "0.5rem" }, flexShrink: 0 }}>
                          {firstService.services_type_photos_url ? (
                            <Image
                              src={firstService.services_type_photos_url}
                              alt={firstService.name}
                              width={98}
                              height={95}
                              style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "60px", maxHeight: "60px" }}
                              sizes="(max-width: 768px) 60px, 98px"
                            />
                          ) : (
                            <Image
                              src={icon}
                              alt={firstService.name}
                              width={98}
                              height={95}
                              style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "60px", maxHeight: "60px" }}
                              sizes="(max-width: 768px) 60px, 98px"
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })()} */}


                {/* {servicesLoading && (
                    <Box
                      sx={{
                        borderTopLeftRadius: { xs: "0.5rem", md: "0.75rem" },
                        borderTopRightRadius: { xs: "1.5rem", md: "2.5rem" },
                        borderBottomLeftRadius: { xs: "1.5rem", md: "2.5rem" },
                        borderBottomRightRadius: { xs: "0.5rem", md: "0.75rem" },
                        bgcolor: "#FDBE12",
                        mb: { xs: "1rem", md: "1.563rem" },
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        px: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
                        py: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
                        ml: { xs: 0, md: "1.188rem" },
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#323232",
                          fontSize: {
                            xs: "1.25rem",
                            sm: "1.5rem",
                            md: "1.75rem",
                            lg: "2rem",
                          },
                          fontWeight: 600,
                          lineHeight: { xs: "1.5rem", md: "1.75rem" },
                        }}
                      >
                        Loading...
                      </Typography>
                    </Box>
                  )} */}

                {/* {services.length > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 1.5, sm: 2, md: 3 },
                        flexWrap: "wrap",
                      }}
                    >
                      {services.slice(1).map((service, index) => {
                        const { route, icon } = getServiceRouteAndIcon(service.name);
                        const isFirst = index === 0;
                        const isLast = index === services.slice(1).length - 1;
      
                        return (
                          <Box
                            key={service.id}
                            component={Link}
                            href={route}
                            sx={{
                              flex: {
                                xs: "1 1 calc(50% - 0.75rem)",
                                sm: "1 1 calc(33.333% - 1.33rem)",
                                md: 1,
                              },
                              minWidth: {
                                xs: "calc(50% - 0.75rem)",
                                sm: 120,
                                md: "auto",
                              },
                              p: { xs: 1.5, sm: 2, md: 3 },
                              cursor: "pointer",
                              borderRadius: { xs: "0.5rem", md: "12.17px" },
                              borderTopLeftRadius: isFirst
                                ? { xs: "1rem", md: "2.535rem" }
                                : { xs: "0.5rem", md: "12.17px" },
                              borderTopRightRadius: isLast
                                ? { xs: "1rem", md: "2.535rem" }
                                : { xs: "0.5rem", md: "12.17px" },
                              textAlign: "center",
                              bgcolor: "grey.100",
                              border: "none",
                              textDecoration: "none",
                              "&:hover": {
                                bgcolor: "grey.200",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mb: { xs: 1, md: 1.5 },
                                height: { xs: 48, sm: 56, md: 64 },
                              }}
                            >
                              {service.services_type_photos_url ? (
                                <Image
                                  src={service.services_type_photos_url}
                                  alt={service.name}
                                  width={64}
                                  height={64}
                                  style={{
                                    objectFit: "contain",
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                  }}
                                  sizes="(max-width: 600px) 48px, (max-width: 960px) 56px, 64px"
                                />
                              ) : (
                                <Image
                                  src={icon}
                                  alt={service.name}
                                  width={64}
                                  height={64}
                                  style={{
                                    objectFit: "contain",
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                  }}
                                  sizes="(max-width: 600px) 48px, (max-width: 960px) 56px, 64px"
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body1"
                              fontWeight="500"
                              sx={{
                                color: "text.primary",
                                fontSize: {
                                  xs: "0.875rem",
                                  sm: "0.9375rem",
                                  md: "1rem",
                                },
                              }}
                            >
                              {service.name}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                  {servicesLoading && services.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 1.5, sm: 2, md: 3 },
                        flexWrap: "wrap",
                      }}
                    >
                      {[1, 2, 3].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            flex: {
                              xs: "1 1 calc(50% - 0.75rem)",
                              sm: "1 1 calc(33.333% - 1.33rem)",
                              md: 1,
                            },
                            minWidth: {
                              xs: "calc(50% - 0.75rem)",
                              sm: 120,
                              md: "auto",
                            },
                            p: { xs: 1.5, sm: 2, md: 3 },
                            borderRadius: { xs: "0.5rem", md: "12.17px" },
                            textAlign: "center",
                            bgcolor: "grey.100",
                            border: "none",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontSize: { xs: "0.875rem", md: "1rem" },
                            }}
                          >
                            Loading...
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )} */}
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  width: "100%",
                  alignItems: "center",
                  gap: "0.75rem",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    height: "100%",
                    flexDirection: "column",
                    gap: "0.75rem",
                    display: "flex",
                    borderTopLeftRadius: "0.75rem",
                    overflow: "hidden",
                    borderBottomLeftRadius: "8.5rem",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "50%",
                    }}
                  >
                    <Image
                      height={500}
                      width={500}
                      className="size-full"
                      src="/image/service-image-1.png"
                      alt="Service - TV Installation"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "50%",
                    }}
                  >
                    <Image
                      height={500}
                      width={500}
                      className="size-full"
                      src="/image/service-image-3.png"
                      alt="Service - TV Installation"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "50%",
                    height: "100%",
                    flexDirection: "column",
                    gap: "0.75rem",
                    display: "flex",
                    borderTopRightRadius: "8.5rem",
                    overflow: "hidden",
                    borderBottomRightRadius: "0.75rem",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "30%",
                    }}
                  >
                    <Image
                      height={500}
                      width={500}
                      className="size-full"
                      src="/image/service-image-2.png"
                      alt="Service - TV Installation"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "70%",
                    }}
                  >
                    <Image
                      height={500}
                      width={500}
                      className="size-full"
                      src="/image/service-image-4.png"
                      alt="Service - TV Installation"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
      }






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
            onClick={() => router.push("/professional/task-management")}
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
              flexShrink: 0,
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


      {
        recentTasks.length > 0 ?


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
                onClick={() => router.push("/professional/task-management")}
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
                  flexShrink: 0,
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
            ) : recentTasks.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: "4rem",
                }}
              >
                <Typography sx={{ color: "#737373", fontSize: "1rem" }}>
                  No recent tasks available
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: "1.25rem",
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
                {recentTasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      minWidth: { xs: "17.5rem", sm: "20rem", md: "18.75rem" },
                      flexShrink: 0,
                    }}
                  >
                    <RecentTaskCard
                      title={task.title}
                      image={task.image}
                      date={task.date}
                      time={task.time}
                      category="Started Service"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box> :


          <Box sx={{ mt: "94px", bgcolor: "#F8F8F8", py: { xs: 4, sm: 6, md: 8 } }}>
            <Container
              maxWidth="lg"
              sx={{ px: { xs: "1rem", sm: "2rem", md: "3rem" } }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: { xs: 3, sm: 4, md: 6 },
                  alignItems: "center",
                }}
              >
                {/* Left Side - Phone Mockups */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    order: { xs: 2, md: 1 },
                  }}
                >
                  {/* Left Phone */}
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 150, sm: 200, md: "29.75rem" },
                      height: { xs: 300, sm: 400, md: "44.5rem" },
                      zIndex: 2,
                    }}
                  >
                    <Image
                      src="/icons/dualMobile.png"
                      alt="CoudPouss App - Home Screen"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                </Box>

                {/* Right Side - Text and Download Links */}
                <Box sx={{ order: { xs: 1, md: 2 } }}>
                  <Typography
                    sx={{
                      color: "#222222",
                      fontWeight: 600,
                      lineHeight: "100%",
                      mb: { xs: "1rem", md: "1.75rem" },
                      fontSize: {
                        xs: "1.5rem",
                        sm: "2rem",
                        md: "2.5rem",
                        lg: "3.125rem",
                      },
                    }}
                  >
                    Download the new CoudPouss app
                  </Typography>

                  {/* Download For Free Button */}
                  <Typography
                    variant="body1"
                    color="secondary.naturalGray"
                    sx={{
                      mb: { xs: 2, sm: 3, md: 4 },
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur. Egestas ac velit donec
                    quisque. Vel suscipit donec non varius placerat. Eu at vitae sit
                    varius bibendum semper eget.
                  </Typography>

                  {/* App Store Badges */}
                  <Box>
                    {/* Apple App Store Badge */}

                    <Box
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        display: "flex",
                        gap: { xs: "0.5rem", sm: "0.75rem" },
                        flexDirection: { xs: "column", sm: "row" },
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "secondary.main",
                          color: "white",
                          textTransform: "none",
                          borderRadius: 2,
                          px: { xs: 3, md: 4 },
                          py: { xs: 1, md: 1.5 },
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          fontWeight: "bold",
                          lineHeight: "1.125rem",
                          width: { xs: "100%", sm: "auto" },
                          "&:hover": {
                            bgcolor: "#D97706",
                          },
                        }}
                      >
                        Download For Free
                      </Button>
                      <Box
                        sx={{
                          display: "flex",
                          gap: { xs: "0.5rem", sm: "0.75rem" },
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Image
                          alt="download"
                          width={118}
                          height={36}
                          src={"/icons/downloadAppStoreButton.png"}
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "100px",
                            maxHeight: "30px",
                          }}
                        />

                        <Image
                          alt="download"
                          width={118}
                          height={36}
                          src={"/icons/googlePlayDownloadButton.png"}
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "100px",
                            maxHeight: "30px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
      }

    </Box>
  );
}
