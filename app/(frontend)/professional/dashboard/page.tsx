"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Card,
} from "@mui/material";
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card
          sx={{
            bgcolor: "#3B7A9E",
            color: "white",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            minHeight: 240,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Professional Image */}
            <Box
              sx={{
                position: "relative",
                width: { xs: 180, md: 280 },
                height: { xs: 200, md: 280 },
                flexShrink: 0,
                ml: { xs: 2, md: 4 },
              }}
            >
              <Image
                src="/image/how-work-img-3.png"
                alt="Professional"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 180px, 280px"
              />
            </Box>

            {/* Stats Content */}
            <Box sx={{ flex: 1, px: { xs: 3, md: 6 }, py: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography
                  variant="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "4rem", md: "6rem" },
                    lineHeight: 1,
                    color: "white",
                  }}
                >
                  10
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{
                    fontSize: { xs: "1.3rem", md: "1.75rem" },
                    lineHeight: 1.3,
                    color: "white",
                  }}
                >
                  Professionals
                  <br />
                  Connected Today
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.6,
                  maxWidth: 450,
                }}
              >
                Lorem ipsum a pharetra mattis dilt pulvinar tortor amet vulputate.
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Explore Service Requests Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={{ mb: 3, color: "#1F2937" }}
        >
          Explore Service Requests
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            overflowY: "hidden",
            scrollBehavior: "smooth",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: "0.5rem",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#F3F4F6",
              borderRadius: 2,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D1D5DB",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#9CA3AF",
              },
            },
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
      </Container>

      {/* Recent Tasks Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={{ mb: 4, color: "#1F2937" }}
        >
          Recent Tasks
        </Typography>

        {/* Task Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: "0.5rem",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#F3F4F6",
              borderRadius: 2,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D1D5DB",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#9CA3AF",
              },
            },
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

          {/* Out for Service Card */}
          {recentTasks.outForService.map((task) => (
            <RecentTaskCard
              key={task.id}
              title={task.title}
              image={task.image}
              date={task.date}
              time={task.time}
              category="Out for Service"
            />
          ))}

          {/* Quote Accepted Card */}
          {recentTasks.quoteAccepted.map((task) => (
            <RecentTaskCard
              key={task.id}
              title={task.title}
              image={task.image}
              date={task.date}
              time={task.time}
              category="Quote Accepted"
            />
          ))}
        </Box>
      </Container>


    </Box>
  );
}
