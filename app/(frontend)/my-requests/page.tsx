"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
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

export default function MyRequestsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<string | null>("1"); // default select first
  const [openReject, setOpenReject] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openProceed, setOpenProceed] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const filters = ["All", "Open Proposal", "Responses", "Validation"];

  const requests: Request[] = [
    {
      id: "1",
      serviceName: "Gardening Service",
      date: "16 Aug 2025",
      time: "10:00 am",
      status: "Responded",
      image: "/image/service-image-1.png",
      category: "DIY Services",
      location: "Paris, 75001",
      quote: 499,
      professional: {
        name: "Bessie Cooper",
        avatar: "/icons/testimonilas-1.png",
        verified: true,
      },
      message:
        "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time. Whether it's a complex wardrobe or a simple table, we handle it all with care and professionalism.",
      videos: [
        "/image/service-image-1.png",
        "/image/service-image-2.png",
        "/image/service-image-3.png",
      ],
    },
    {
      id: "2",
      serviceName: "Gardening Service",
      date: "16 Aug 2025",
      time: "10:00 am",
      status: "Open Proposal",
      image: "/image/service-image-1.png",
      category: "DIY Services",
      location: "Paris, 75001",
      quote: 620,
      professional: {
        name: "Bessie Cooper",
        avatar: "/icons/testimonilas-1.png",
        verified: true,
      },
      message:
        "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time.",
      videos: [
        "/image/service-image-2.png",
        "/image/service-image-3.png",
        "/image/service-image-4.png",
      ],
    },
    {
      id: "3",
      serviceName: "Gardening Service",
      date: "16 Aug 2025",
      time: "10:00 am",
      status: "Open Proposal",
      image: "/image/service-image-1.png",
      category: "DIY Services",
      location: "Paris, 75001",
      quote: 620,
      professional: {
        name: "Bessie Cooper",
        avatar: "/icons/testimonilas-1.png",
        verified: true,
      },
      message:
        "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time.",
      videos: [
        "/image/service-image-2.png",
        "/image/service-image-3.png",
        "/image/service-image-4.png",
      ],
    },
    {
      id: "4",
      serviceName: "Gardening Service",
      date: "16 Aug 2025",
      time: "10:00 am",
      status: "Open Proposal",
      image: "/image/service-image-1.png",
      category: "DIY Services",
      location: "Paris, 75001",
      quote: 620,
      professional: {
        name: "Bessie Cooper",
        avatar: "/icons/testimonilas-1.png",
        verified: true,
      },
      message:
        "Our skilled team will expertly assemble your furniture, ensuring every piece is put together with precision. We take pride in our attention to detail, so you can trust that your items will be ready for use in no time.",
      videos: [
        "/image/service-image-2.png",
        "/image/service-image-3.png",
        "/image/service-image-4.png",
      ],
    },
  ];

  const filteredRequests =
    activeFilter === "All"
      ? requests
      : requests.filter((req) => {
          if (activeFilter === "Open Proposal")
            return req.status === "Open Proposal";
          if (activeFilter === "Responses") return req.status === "Responded";
          return true;
        });

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
          py: 6,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.5rem",
            lineHeight: "1.75rem",
            letterSpacing: "0%",
            fontWeight: 600,
            color: "primary.normal",
            mb: 3,
          }}
        >
          Request Management
        </Typography>

        {/* Filters + Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 4,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              {filters.map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  variant={activeFilter === filter ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: "1.125rem",
                    py: "1.125rem",
                    fontSize: "1rem",
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
              justifyContent: "flex-end",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", sm: 300 },
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid",
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
                  px: 2,
                  py: 1,
                  "& .MuiInputBase-input": {
                    color: "text.primary",
                    fontSize: "1rem",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontSize: "1rem",
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

        <Box sx={{ pr: 4 }}>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredRequests.map((request) => (
                <Box
                  key={request.id}
                  onClick={() => setSelectedRequest(request.id)}
                  sx={{
                    py: "0.65625rem",
                    pl: "0.625rem",
                    pr: "0.625rem",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    border: "1px solid",
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
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: "5.5rem",
                        height: "4.625rem",
                        borderRadius: "0.75rem",
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
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.125rem",
                            lineHeight: "1.5rem",
                            letterSpacing: "0%",
                            color: "#424242",
                            fontWeight: 600,
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
                            px: 1,
                            py: 0.25,
                            borderRadius: "0.5rem",
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor:
                                request.status === "Responded"
                                  ? "#F59E0B"
                                  : "#10B981",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color:
                                request.status === "Responded"
                                  ? "#F59E0B"
                                  : "#10B981",
                              fontWeight: 500,
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
                          fontSize: "0.875rem",
                          lineHeight: "1.125rem",
                          letterSpacing: "0%",
                          color: "#555555",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {request.date}
                        <Box
                          component="span"
                          sx={{
                            width: 4,
                            height: 4,
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
              ))}
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
                borderRadius: 3,
                p: 4,
                pt: 0,
                position: "relative",
                minHeight: 600,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedRequestData ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      p: { xs: 2, md:"1.25rem" },
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {/* IMAGE + TITLE */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", md: 220 },
                          height: { xs: 180, md: 180 },
                          borderRadius: 2,
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={selectedRequestData.image}
                          alt={selectedRequestData.serviceName}
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
                          variant="h5"
                          fontWeight="bold"
                          sx={{ color: "text.primary" }}
                        >
                          {selectedRequestData.serviceName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          Exterior Cleaning
                        </Typography>
                      </Box>
                    </Box>

                    {/* DATE / TIME / CATEGORY / LOCATION */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // always 2 columns
                        columnGap: 4,
                        rowGap: 2,
                        bgcolor: "grey.50",
                        p: 2,
                        borderRadius: 4, // a bit more pill-like
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 18, color: "primary.main" }}
                        />
                        <Typography variant="body2" fontWeight="500">
                          {selectedRequestData.date}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: 18, color: "primary.main" }}
                        />
                        <Typography variant="body2" fontWeight="500">
                          {selectedRequestData.time}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <BuildIcon
                          sx={{ fontSize: 18, color: "primary.main" }}
                        />
                        <Typography variant="body2" fontWeight="500">
                          {selectedRequestData.category}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 18, color: "primary.main" }}
                        />
                        <Typography variant="body2" fontWeight="500">
                          {selectedRequestData.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* QUOTE ROW (matches Figma) */}
                    <Box
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Quote Amount
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "primary.main" }}
                          >
                            €{selectedRequestData.quote}
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                          }}
                        >
                          Negotiate
                        </Button>
                      </Box>
                    </Box>

                    {/* PROFESSIONAL ROW */}
                    <Box
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="600">
                          About professional
                        </Typography>

                        <IconButton size="small">
                          <FavoriteBorderIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={selectedRequestData.professional.avatar}
                            alt={selectedRequestData.professional.name}
                          />

                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography fontWeight="600">
                                {selectedRequestData.professional.name}
                              </Typography>

                              <VerifiedIcon
                                sx={{ fontSize: 18, color: "#10B981" }}
                              />

                              <Chip
                                label="Most professional"
                                size="small"
                                sx={{
                                  bgcolor: "rgba(16,185,129,0.08)",
                                  color: "#059669",
                                  borderRadius: 999,
                                }}
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              About professional
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1.5 }}>
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2, px: 5 }}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2, px: 5 }}
                          >
                            View Profile
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    {/* PERSONALIZED MESSAGE */}
                    <Box
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Personalized short message
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {selectedRequestData.message}
                      </Typography>
                    </Box>

                    {/* SHORT VIDEOS */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Short videos
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedRequestData.videos.map((video, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: { xs: "100%", sm: 180 },
                              height: 120,
                              borderRadius: 2,
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
                    </Box>

                    {/* SUPPORTING DOCUMENTS */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Supporting documents
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {[1, 2].map((doc) => (
                          <Card
                            key={doc}
                            sx={{
                              flex: "1 1 200px",
                              borderRadius: 2,
                              border: "1px dashed",
                              borderColor: "grey.300",
                              bgcolor: "grey.50",
                              p: 3,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              boxShadow: "none",
                            }}
                          >
                            <Image
                              src="/icons/vector.png"
                              alt="Document"
                              width={40}
                              height={40}
                            />
                            <Typography variant="body2" fontWeight="500">
                              View Document
                            </Typography>
                          </Card>
                        ))}
                      </Box>
                    </Box>

                    {/* ACTION BUTTONS */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        onClick={() => setOpenReject(true)}
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 4,
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => setOpenConfirm(true)}
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 4,
                          bgcolor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.dark",
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
