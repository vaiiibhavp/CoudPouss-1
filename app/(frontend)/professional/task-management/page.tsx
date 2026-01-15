"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSentSection from "@/components/task-management/QuoteSentSection";
import AcceptedSection from "@/components/task-management/AcceptedSection";
import CompletedSection from "@/components/task-management/CompletedSection";
import { API_ENDPOINTS } from "@/constants/api";
import { apiGet } from "@/lib/api";
import Image from "next/image";

type TabType = "quote-sent" | "accepted" | "complete";

// Map tab values to API status values
const tabToStatusMap: Record<TabType, string> = {
  "quote-sent": "send",
  "accepted": "accepted",
  "complete": "complete"
};

export default function TaskManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qouots, setQuots] = useState<any[]>([]);
  const [selectedQuots, setSelectedQuots] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("quote-sent");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchQuouts = useCallback(async () => {
    setLoading(true);
    try {
      // Get the status based on active tab
      const status = tabToStatusMap[activeTab];
      const endpoint = `${API_ENDPOINTS.QOUTE_REQUEST.GET_ALL_QOUTES}?status=${status}`;

      console.log(`Fetching quotes with status: ${status}`);
      
      const response = await apiGet<any>(endpoint);
      console.log('API Response:', response);
      
      if (response.data.status) {
        setQuots(response.data.data.results || []);
        // Auto-select first quote if available
        if (response.data.data.results.length > 0 && !selectedQuots) {
          setSelectedQuots(response.data.data.results[0].quote_id);
        }
      } else {
        setQuots([]);
        setSelectedQuots(null);
      }
    } catch (error) {
      console.error("Error fetching Quotes requests:", error);
      setQuots([]);
      setSelectedQuots(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedQuots]); // Added activeTab as dependency

  // Fetch data when activeTab changes
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    } else {
      fetchQuouts();
    }
  }, [router, fetchQuouts, activeTab]); // Added activeTab to dependencies

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Function to handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedQuots(null); // Reset selection when changing tabs
    setMobileMenuOpen(false); // Close mobile menu if open
  };

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

  // Tabs data for mobile menu
  const tabs = [
    { id: "quote-sent", label: "Quote Sent" },
    { id: "accepted", label: "Accepted" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>

      {/* Main Content */}
      <Box
        sx={{
          px: { xs: "1rem", sm: "1.5rem", md: "5rem" },
          py: { xs: "1.5rem", md: "2.5rem" },
        }}
      >
        {/* Mobile Menu Icon and Title */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            mb: "1.5rem",
            gap: "1rem",
          }}
        >
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              color: "#2C6587",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "rgba(44, 101, 135, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              color: "#2C6587",
              fontSize: "1.5rem",
            }}
          >
            Task Management
          </Typography>
        </Box>

        {/* Desktop Page Title */}
        <Typography
          variant="h4"
          sx={{
            color: "#2C6587",
            fontWeight: 700,
            fontSize: "1.5rem", // 24px
            lineHeight: "1.75rem", // 28px
            letterSpacing: 0,
            mb: "2.5rem",
            display: { xs: "none", md: "block" },
          }}
        >
          Task Management
        </Typography>

        {/* Divider below title */}
        <Divider sx={{ color: "#E7E7E7" }} />

        {/* Tabs - Vertical Sidebar */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "12.5rem auto 1fr" },
            gap: { xs: "1.5rem", md: "2.5rem" },
          }}
        >
          {/* Left Sidebar - Tabs (Desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: "0.875rem",
              mt: "2.063rem",
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "contained" : "text"}
                onClick={() => handleTabChange(tab.id as TabType)}
                sx={{
                  bgcolor: activeTab === tab.id ? "#2C6587" : "transparent",
                  border: activeTab === tab.id ? "none" : "0.0625rem solid #F1F1F1",
                  color: activeTab === tab.id ? "#FFFFFF" : "#6D6D6D",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  px: "1.25rem",  // 20px
                  py: "0.625rem", // 10px
                  borderRadius: "6.25rem", // 100px
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: activeTab === tab.id ? "#25608A" : "rgba(44, 101, 135, 0.08)",
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Drawer - Task Management Tabs */}
          <Drawer
            anchor="left"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: "17.5rem",
                px: "1.438rem",
                py: "2rem",
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    px: activeTab === tab.id ? "1.25rem" : "1.25rem",
                    py: activeTab === tab.id ? "0.625rem" : "0.625rem",
                    borderRadius: activeTab === tab.id ? "6.25rem" : "6.25rem",
                    fontSize: "1rem",
                    fontFamily: "Lato, sans-serif",
                    fontWeight: activeTab === tab.id ? 400 : 400,
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    border: activeTab === tab.id ? "none" : "0.0625rem solid #EAF0F3",
                    color: activeTab === tab.id ? "#FFFFFF" : "#6D6D6D",
                    bgcolor: activeTab === tab.id ? "#2C6587" : "transparent",
                    "&:hover": {
                      bgcolor: activeTab === tab.id ? "#2C6587" : "grey.50",
                    },
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Drawer>

          {/* Vertical Divider (Desktop only) */}
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

          {/* Right Content Area */}
          <Box sx={{ minHeight: "70vh", mt: { xs: "1.5rem", md: "2.063rem" } }}>
            {/* Loading State */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <>
                {/* Show appropriate content based on activeTab */}
                {activeTab === "quote-sent" && qouots.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {qouots.map((request) => {
                      const formatDate = (dateString: string): string => {
                        const date = new Date(dateString);
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                      };

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

                      return (
                        <Box
                          key={request.quote_id}
                          onClick={() => setSelectedQuots(request.quote_id)}
                          sx={{
                            width: { xs: "100%", sm: "100%", md: "calc(50% - 16px)" },
                            py: { xs: "0.5rem", sm: "0.65625rem" },
                            pl: { xs: "0.5rem", sm: "0.625rem" },
                            pr: { xs: "0.5rem", sm: "0.625rem" },
                            borderRadius: { xs: "0.5rem", sm: "0.75rem" },
                            cursor: "pointer",
                            border: "0.0625rem solid",
                            borderColor:
                              selectedQuots === request.quote_id ? "#2F6B8E" : "grey.200",
                            bgcolor:
                              selectedQuots === request.quote_id
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
                                src={request.service_details.subcategory.icon}
                                alt={request.service_details.subcategory.name}
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
                                  {request.service_details.subcategory.name}
                                </Typography>
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
                                {formatDate(request.service_details.chosen_datetime)}
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
                                {formatTime(request.service_details.chosen_datetime)}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : activeTab === "accepted" ? (
                  <>
                    {/* Accepted tab content */}
                    {qouots.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {qouots.map((request) => (
                          <Box key={request.quote_id}>
                            {/* Render accepted requests here */}
                            <Typography>Accepted Request: {request.quote_id}</Typography>
                            {/* Add more details as needed */}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography>No accepted quotes found</Typography>
                    )}
                  </>
                ) : activeTab === "complete" ? (
                  <>
                    {/* Completed tab content */}
                    {qouots.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {qouots.map((request) => (
                          <Box key={request.quote_id}>
                            {/* Render completed requests here */}
                            <Typography>Completed Request: {request.quote_id}</Typography>
                            {/* Add more details as needed */}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography>No completed quotes found</Typography>
                    )}
                  </>
                ) : (
                  <Typography>No data found for {activeTab}</Typography>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}