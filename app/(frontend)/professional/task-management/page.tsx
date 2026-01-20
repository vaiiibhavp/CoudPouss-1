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

type TabType = "quote-sent" | "accepted" | "completed";

// Map tab values to API status values
const tabToStatusMap: Record<TabType, string> = {
  "quote-sent": "send",
  "accepted": "accepted",
  "completed": "complete"
};

export default function TaskManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qouots, setQuots] = useState<any[]>([]);
  const [selectedQuots, setSelectedQuots] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("quote-sent");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [acceptedDetail, setAcceptedDetail] = useState<any | null>(null);
  const [acceptedLoading, setAcceptedLoading] = useState(false);
  const [completedDetail, setCompletedDetail] = useState<any | null>(null);
  const [completedLoading, setCompletedLoading] = useState(false);

  const fetchQuouts = useCallback(async () => {
    setLoading(true);
    try {
      // Get the status based on active tab
      const status = tabToStatusMap[activeTab];
      const endpoint = `${API_ENDPOINTS.QOUTE_REQUEST.GET_ALL_QOUTES}?status=${status}`;

      console.log(`Fetching quotes with status: ${status}`);
      
      const response = await apiGet<any>(endpoint);
      console.log('API Response:', {response});
      
      if (response.data.status) {
        setQuots(response.data.data.results || []);
        // Keep `selectedQuots` null by default on load — do not auto-select
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
  }, [activeTab]);


  // Fetch data when activeTab changes
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    } else {
      fetchQuouts();
    }
  }, [router, fetchQuouts]);

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

  // Find the selected request object (if any)
  const selectedRequest = qouots.find((r) => r && r.quote_id == selectedQuots);
  const isDetailView = selectedQuots !== null;

  // Fetch accepted detail only when in 'accepted' tab and a request is selected
  useEffect(() => {
    const serviceRequestId = qouots.find((r) => r && r.quote_id == selectedQuots)?.service_request_id;
    if (activeTab === "accepted" && serviceRequestId) {
      let cancelled = false;
      (async () => {
        setAcceptedLoading(true);
        try {
          const endpoint = `quote_accept/service-provider/accepted/${serviceRequestId}`;
          const resp = await apiGet<any>(endpoint);
          if (!cancelled && resp && resp.data) {
            setAcceptedDetail(resp.data.data || resp.data);
          }
        } catch (err) {
          console.error("Error fetching accepted detail:", err);
          if (!cancelled) setAcceptedDetail(null);
        } finally {
          if (!cancelled) setAcceptedLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    } else {
      setAcceptedDetail(null);
      setAcceptedLoading(false);
    }
  }, [activeTab, qouots, selectedQuots]);

  // Fetch completed details when in 'completed' tab and a request is selected
  useEffect(() => {
    const serviceRequestId = qouots.find((r) => r && r.quote_id == selectedQuots)?.service_request_id;
    if (activeTab === "completed" && serviceRequestId) {
      let cancelled = false;
      (async () => {
        setCompletedLoading(true);
        try {
          const endpoint = `quote_accept/${serviceRequestId}/completed-task-details`;
          const resp = await apiGet<any>(endpoint);
          if (!cancelled && resp && resp.data) {
            setCompletedDetail(resp.data.data || resp.data);
          }
        } catch (err) {
          console.error("Error fetching completed detail:", err);
          if (!cancelled) setCompletedDetail(null);
        } finally {
          if (!cancelled) setCompletedLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    } else {
      setCompletedDetail(null);
      setCompletedLoading(false);
    }
  }, [activeTab, qouots, selectedQuots]);




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

  // Map acceptedDetail (API shape) to the AcceptedSection `data` shape
  const mapAcceptedDetailToSection = (detail: any) => {
    if (!detail) return null;

    const sd = detail.service_details || {};
    const quote = detail.quote || {};
    const user = detail.elderly_user?.user || {};
    const pb = detail.payment_breakdown || {};
    const tl = detail.task_lifecycle || {};

    const parseDate = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      } catch {
        return datetime;
      }
    };

    const parseTime = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const period = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${minutesStr} ${period}`;
      } catch {
        return "";
      }
    };

    const parseDateTime = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dateStr = `${daysOfWeek[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const period = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        const timeStr = `${hours}:${minutesStr} ${period}`;
        return `${dateStr} - ${timeStr}`;
      } catch {
        return datetime;
      }
    };

    return {
      id: detail.service_request_id || quote.quote_id || 0,
      title: sd.subcategory?.name || "Service",
      image:  sd.subcategory?.icon || "/image/main.png",
      date: parseDate(sd.chosen_datetime),
      time: parseTime(sd.chosen_datetime),
      location: user.address || "",
      clientName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      clientAvatar: user.profile_photo_url || "",
      clientPhone: `${user.phone_country_code || ""} ${user.phone_number || ""}`.trim(),
      finalizedQuoteAmount: pb.total !== undefined ? `€${Number(pb.total).toFixed(2)}` : (quote.amount ? `€${Number(quote.amount).toFixed(2)}` : ""),
      securityCode: sd.displayed_service_code ? sd.displayed_service_code.split('').slice(0, 6) : (quote.security_code || []),
      description: sd.description || quote.description || "",
      jobPhotos: (sd.supporting_photos && sd.supporting_photos.length > 0) ? sd.supporting_photos : (quote.offer_photos && quote.offer_photos.length > 0 ? quote.offer_photos : []),
      paymentBreakdown: {
        finalizedQuoteAmount: pb.base_amount !== undefined ? `€${Number(pb.base_amount).toFixed(2)}` : "",
        platformFee: pb.platform_fee !== undefined ? `€${Number(pb.platform_fee).toFixed(2)}` : "",
        taxes: pb.taxes !== undefined ? `€${Number(pb.taxes).toFixed(2)}` : "",
        total: pb.total !== undefined ? `€${Number(pb.total).toFixed(2)}` : "",
      },
      serviceTimeline: [
        { 
          status: "Request Placed", 
          date: parseDateTime(tl.request_placed?.time), 
          completed: !!tl.request_placed?.status 
        },
        { 
          status: "Quote Received", 
          date: parseDateTime(tl.quote_received?.time), 
          completed: !!tl.quote_received?.status 
        },
        { 
          status: "Quote Approved", 
          date: parseDateTime(tl.quote_approved?.time), 
          completed: !!tl.quote_approved?.status 
        },
        { 
          status: "Payment Processed", 
          date: parseDateTime(tl.payment_processed?.time), 
          completed: !!tl.payment_processed?.status 
        },
        { 
          status: "Elder Confirm Start", 
          date: parseDateTime(tl.elder_confirm_start?.time), 
          completed: !!tl.elder_confirm_start?.status 
        },
        { 
          status: "Provider Confirm Start", 
          date: parseDateTime(tl.provider_confirm_start?.time), 
          completed: !!tl.provider_confirm_start?.status 
        },
        { 
          status: "Out for Service", 
          date: parseDateTime(tl.expert_out_for_service?.time), 
          completed: !!tl.expert_out_for_service?.status 
        },
        { 
          status: "Service Started", 
          date: parseDateTime(tl.service_started?.time), 
          completed: !!tl.service_started?.status 
        },
        { 
          status: "Service Completed", 
          date: parseDateTime(tl.service_completed?.time), 
          completed: !!tl.service_completed?.status 
        },
      ],
    };
  };

  // Map completedDetail (API shape) to the CompletedSection `data` shape
  const mapCompletedDetailToSection = (detail: any) => {
    if (!detail) return null;

    const service = detail.service || {};
    const elderly = detail.elderly_user || {};
    const pb = detail.payment_breakdown || {};
    const tl = detail.task_lifecycle || {};
    
    // Get the selected quote to extract service name
    const selectedQuote = qouots.find((r) => r && r.quote_id == selectedQuots);
    const serviceTitle = selectedQuote?.service_details?.subcategory?.name || "Service Completed";

    const parseDate = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      } catch {
        return datetime;
      }
    };

    const parseTime = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const period = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${minutesStr} ${period}`;
      } catch {
        return "";
      }
    };

    const parseDateTime = (datetime?: string) => {
      if (!datetime) return "";
      try {
        const d = new Date(datetime);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dateStr = `${daysOfWeek[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const period = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        const timeStr = `${hours}:${minutesStr} ${period}`;
        return `${dateStr} - ${timeStr}`;
      } catch {
        return datetime;
      }
    };

    return {
      id: service.id || 0,
      title: serviceTitle,
      image: selectedQuote?.service_details?.subcategory?.icon || "/image/main.png",
      date: parseDate(tl.service_completed?.time),
      time: parseTime(tl.service_completed?.time),
      location: elderly.address || "",
      clientName: `${elderly.firstName || ""} ${elderly.lastName || ""}`.trim(),
      clientAvatar: elderly.profile_photo_url || "",
      clientPhone: elderly.phone || "",
      finalizedQuoteAmount: pb.finalized_quote_amount !== undefined ? `€${Number(pb.finalized_quote_amount).toFixed(2)}` : "",
      securityCode: [],
      description: service.description || "",
      jobPhotos: (service.supporting_photo_urls && service.supporting_photo_urls.length > 0) ? service.supporting_photo_urls : [],
      paymentBreakdown: {
        finalizedQuoteAmount: pb.finalized_quote_amount !== undefined ? `€${Number(pb.finalized_quote_amount).toFixed(2)}` : "",
        platformFee: pb.platform_fee !== undefined ? `€${Number(pb.platform_fee).toFixed(2)}` : "",
        taxes: pb.taxes !== undefined ? `€${Number(pb.taxes).toFixed(2)}` : "",
        total: pb.total !== undefined ? `€${Number(pb.total).toFixed(2)}` : "",
      },
      serviceTimeline: [
        { 
          status: "Request Placed", 
          date: parseDateTime(tl.request_placed?.time), 
          completed: !!tl.request_placed?.status 
        },
        { 
          status: "Quote Received", 
          date: parseDateTime(tl.quote_received?.time), 
          completed: !!tl.quote_received?.status 
        },
        { 
          status: "Quote Approved", 
          date: parseDateTime(tl.quote_approved?.time), 
          completed: !!tl.quote_approved?.status 
        },
        { 
          status: "Payment Processed", 
          date: parseDateTime(tl.payment_processed?.time), 
          completed: !!tl.payment_processed?.status 
        },
        { 
          status: "Expert Out for Service", 
          date: parseDateTime(tl.expert_out_for_service?.time), 
          completed: !!tl.expert_out_for_service?.status 
        },
        { 
          status: "Service Started", 
          date: parseDateTime(tl.service_started?.time), 
          completed: !!tl.service_started?.status 
        },
        { 
          status: "Service Completed", 
          date: parseDateTime(tl.service_completed?.time), 
          completed: !!tl.service_completed?.status 
        },
      ],
    };
  };

  const acceptedSectionData = acceptedDetail ? mapAcceptedDetailToSection(acceptedDetail) : acceptedData;
  const completedSectionData = completedDetail ? mapCompletedDetailToSection(completedDetail) : undefined;

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
{/* Show appropriate content based on activeTab */}
{loading ? (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
    <Typography>Loading...</Typography>
  </Box>
 ) : isDetailView ? (
  <Box>
    {activeTab === "quote-sent" && <QuoteSentSection data={quoteSentData} setSelectedQuots={setSelectedQuots} />}
    {activeTab === "accepted" && (
      acceptedLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <Typography>Loading accepted details...</Typography>
        </Box>
      ) : (
        <AcceptedSection data={acceptedSectionData || acceptedData} setSelectedQuots={setSelectedQuots} />
      )
    )}
    {activeTab === "completed" && (
      completedLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <Typography>Loading completed details...</Typography>
        </Box>
      ) : completedSectionData ? (
        <CompletedSection data={completedSectionData} setSelectedQuots={setSelectedQuots} />
      ) : (
        <Typography>No completed task details available</Typography>
      )
    )}
  </Box>
 ) : qouots.length > 0 ? (
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
        hours = hours ? hours : 12;
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
            bgcolor: "white",
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
) : (
  <Typography>No {activeTab.replace("-", " ")} quotes found</Typography>
)}

{/* You can also render the components based on activeTab */}
{/* {activeTab === "quote-sent" && <QuoteSentSection data={quoteSentData} />}
{activeTab === "accepted" && <AcceptedSection data={acceptedData} />}
{activeTab === "completed" && <CompletedSection />} */}


                {/* Quote Sent Content */}
            {/* {activeTab === "quote-sent" && <QuoteSentSection data={quoteSentData} />} */}

            {/* Accepted Content */}
            {/* {activeTab === "accepted" && <AcceptedSection data={acceptedData} />} */}

            {/* Completed Content */}
            {/* {activeTab === "completed" && <CompletedSection />} */}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}