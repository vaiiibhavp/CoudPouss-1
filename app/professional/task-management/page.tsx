"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSentSection from "@/components/task-management/QuoteSentSection";
import AcceptedSection from "@/components/task-management/AcceptedSection";
import CompletedSection from "@/components/task-management/CompletedSection";

type TabType = "quote-sent" | "accepted" | "completed";

export default function TaskManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("quote-sent");

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Mock data for quote sent
  const quoteSentData = {
    id: 1,
    title: "Furniture Assembly",
    image: "/image/main.png",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "Paris 75001",
    clientName: "Wade Warren",
    clientAvatar: "/image/main.png",
    clientPhone: "+91 7222201100",
    serviceStatus: "Quote Sent",
    statusDate: "Jun 06, 2022 - Today",
    waitingStatus: "Waiting for Quote Acceptance",
    description:
      "Transform your space with our expert furniture assembly services. Our skilled team will handle everything from unpacking to setup, ensuring your new pieces are perfectly assembled and ready for use. We specialize in a wide range of furniture types, including flat-pack items, complete modular systems, and custom installations. Enjoy a hassle-free experience with professional assembly that saves you time and effort in your newly furnished area. Schedule your assembly today and let us help you create the perfect environment!",
    jobPhotos: ["/image/main.png", "/image/main.png"],
  };

  // Mock data for accepted
  const acceptedData = {
    id: 1,
    title: "Furniture Assembly",
    image: "/image/main.png",
    date: "16 Aug, 2025",
    time: "10:00 am",
    location: "Paris 75001",
    clientName: "Wade Warren",
    clientAvatar: "/image/main.png",
    clientPhone: "+91 7222201100",
    finalizedQuoteAmount: "€499",
    securityCode: ["3", "2", "5", "5", "5", "8"],
    description:
      "Transform your space with our expert furniture assembly services. Our skilled team will handle everything from unpacking to setup, ensuring your new pieces are perfectly assembled and ready for use. We specialize in a wide range of furniture types, including flat-pack items, complete modular systems, and custom installations. Enjoy a hassle-free experience with professional assembly that saves you time and effort in your newly furnished area. Schedule your assembly today and let us help you create the perfect environment!",
    jobPhotos: ["/image/main.png", "/image/main.png"],
    paymentBreakdown: {
      finalizedQuoteAmount: "€499",
      platformFee: "€73.85",
      taxes: "€1.50",
      total: "€340.00",
    },
    serviceTimeline: [
      { status: "Quote Sent", date: "Wed, 16 Jun 2025 - 7:02pm", completed: true },
      { status: "Quote Accepted", date: "Wed, 16 Jun 2025 - 7:02pm", completed: true },
      { status: "Out for Service", date: "Wed, 16 Jun 2025 - 7:02pm", completed: false },
      { status: "Started Service", date: "Expected by Wed, 18 Jun 2025 - 7:02pm", completed: false },
      { status: "Service Completed", date: "Expected by Wed, 18 Jun 2025 - 7:02pm", completed: false },
      { status: "Payment Received", date: "Expected by Wed, 18 Jun 2025 - 7:02pm", completed: false },
    ],
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{ mb: 3, color: "#1F2937" }}
        >
          Task Management
        </Typography>

        {/* Divider below title */}
        <Divider sx={{ mb: 4 }} />

        {/* Tabs - Vertical Sidebar */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "200px auto 1fr" },
            gap: 4,
          }}
        >
          {/* Left Sidebar - Tabs */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant={activeTab === "quote-sent" ? "contained" : "text"}
              onClick={() => setActiveTab("quote-sent")}
              sx={{
                bgcolor: activeTab === "quote-sent" ? "#2F6B8E" : "transparent",
                color: activeTab === "quote-sent" ? "white" : "#6B7280",
                textTransform: "none",
                justifyContent: "flex-start",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: activeTab === "quote-sent" ? "#25608A" : "rgba(47, 107, 142, 0.04)",
                },
              }}
            >
              Quote Sent
            </Button>
            <Button
              variant={activeTab === "accepted" ? "contained" : "text"}
              onClick={() => setActiveTab("accepted")}
              sx={{
                bgcolor: activeTab === "accepted" ? "#2F6B8E" : "transparent",
                color: activeTab === "accepted" ? "white" : "#6B7280",
                textTransform: "none",
                justifyContent: "flex-start",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: activeTab === "accepted" ? "#25608A" : "rgba(47, 107, 142, 0.04)",
                },
              }}
            >
              Accepted
            </Button>
            <Button
              variant={activeTab === "completed" ? "contained" : "text"}
              onClick={() => setActiveTab("completed")}
              sx={{
                bgcolor: activeTab === "completed" ? "#2F6B8E" : "transparent",
                color: activeTab === "completed" ? "white" : "#6B7280",
                textTransform: "none",
                justifyContent: "flex-start",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: activeTab === "completed" ? "#25608A" : "rgba(47, 107, 142, 0.04)",
                },
              }}
            >
              Completed
            </Button>
          </Box>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

          {/* Right Content Area */}
          <Box sx={{ minHeight: "70vh" }}>
            {/* Quote Sent Content */}
            {activeTab === "quote-sent" && <QuoteSentSection data={quoteSentData} />}

            {/* Accepted Content */}
            {activeTab === "accepted" && <AcceptedSection data={acceptedData} />}

            {/* Completed Content */}
            {activeTab === "completed" && <CompletedSection />}
          </Box>
        </Box>
      </Container>


    </Box>
  );
}
