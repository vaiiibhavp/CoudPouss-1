"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Box, Container, Typography, Card, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServiceRequestCard from "@/components/ServiceRequestCard";
import RecentTaskCard from "@/components/RecentTaskCard";

export default function DashboardPage() {
  const router = useRouter();

  // Check if user is authenticated on mount
  // useEffect(() => {
  //   const storedInitial = localStorage.getItem("userInitial");
  //   const storedEmail = localStorage.getItem("userEmail");

  // If user details are not present, redirect to login
  //   if (!storedInitial || !storedEmail) {
  //     router.push(ROUTES.LOGIN);
  //   }
  // }, [router]);

  // Service request data
  const serviceRequests = [
    {
      id: 1,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 3,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 4,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 5,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 6,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
    {
      id: 7,
      title: "Furniture Assembly",
      image: "/image/main.png",
      date: "16 Aug, 2025",
      time: "10:00 am",
      serviceProvider: "DIY Services",
      location: "Paris 75001",
      estimatedCost: "€499",
      timeAgo: "2 hours ago",
    },
  ];

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
      <Box
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
            {/* Professional Image */}

            <Image
              src="/image/worker-with-side.png"
              alt="Professional"
              width={345}
              height={514}
              style={{
                marginTop: "-9.375rem",
              }}
            />

            {/* Stats Content */}
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography
                  variant="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: "6.077rem", // 97.23px
                    lineHeight: "4.052rem", // 64.83px
                    letterSpacing: "0rem",
                    color: "#FFFFFF",
                  }}
                >
                  10
                </Typography>
                <Typography
                  fontWeight="600"
                  sx={{
                    fontSize: "2.532rem", // 40.51px
                    lineHeight: "3.039rem", // 48.61px
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
                    fontSize: "1.519rem", // 24.31px
                    lineHeight: "2.279rem", // 36.46px
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
      </Box>

      {/* Explore Service Requests Section */}
      <Box sx={{ mt: "3.688rem", px: "5.063rem" }}>
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
      </Box>

      {/* Recent Tasks Section */}
      <Box sx={{ px: "5.063rem", mt: "3rem",mb:"9.25rem" }}>
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
