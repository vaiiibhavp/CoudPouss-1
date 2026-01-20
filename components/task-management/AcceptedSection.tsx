"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Card, Avatar, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TaskImageCard from "@/components/TaskImageCard";
import LocationShareModal from "@/components/LocationShareModal";
import SecurityCodeMatchModal from "@/components/SecurityCodeMatchModal";
import RenegotiateModal from "@/components/RenegotiateModal";
import ClientApprovalModal from "@/components/ClientApprovalModal";
import EnterSecurityCodeModal from "@/components/EnterSecurityCodeModal";
import SecurityCodeSuccessModal from "@/components/SecurityCodeSuccessModal";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

interface AcceptedData {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  clientName: string;
  clientAvatar: string;
  clientPhone: string;
  finalizedQuoteAmount: string;
  securityCode: string[];
  description: string;
  jobPhotos: string[];
  paymentBreakdown: {
    finalizedQuoteAmount: string;
    platformFee: string;
    taxes: string;
    total: string;
  };
  serviceTimeline: Array<{
    status: string;
    date: string;
    completed: boolean;
  }>;
}

interface AcceptedSectionProps {
  data: AcceptedData;
  setSelectedQuots: any;
}

export default function AcceptedSection({ data, setSelectedQuots }: AcceptedSectionProps) {
  const router = useRouter();
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [openSecurityCodeMatchModal, setOpenSecurityCodeMatchModal] =
    useState(false);
  const [serviceStarted, setServiceStarted] = useState(false);
  const [openRenegotiateModal, setOpenRenegotiateModal] = useState(false);
  const [openClientApprovalModal, setOpenClientApprovalModal] = useState(false);
  const [renegotiated, setRenegotiated] = useState(false);
  const [openEnterSecurityCodeModal, setOpenEnterSecurityCodeModal] =
    useState(false);
  const [openSecurityCodeSuccessModal, setOpenSecurityCodeSuccessModal] =
    useState(false);
  const [serviceCompleted, setServiceCompleted] = useState(false);

  const handleOutForService = () => {
    setOpenLocationModal(true);
  };

  const handleConfirmLocation = async () => {
    try {
      const endpoint = `quote_accept/proceed-out-for-service/${data.id}`;
      const response = await apiPost<any>(endpoint, {});

      if (response.data.status === "success") {
        toast.success(response.data.message || "Successfully marked as out for service");
        setOpenLocationModal(false);
        setLocationShared(true);
      } else {
        toast.error(response.data.message || "Failed to proceed out for service");
      }
    } catch (error: any) {
      console.error("Error calling out for service API:", error);
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setOpenLocationModal(false);
  };

  const handleStartService = () => {
    setOpenSecurityCodeMatchModal(true);
  };

  const handleSecurityCodeMatch = async () => {
    try {
      const endpoint = `quote_accept/provider/confirm_start/${data.id}`;
      const response = await apiPost<any>(endpoint, {});
      let msg = ""
      if (response && !response.success && response.error) {
        msg = response.error.message || "";
      } else {
        msg = response?.data?.message || "";
      }

      const isAlreadyConfirmed = (m: string) => {
        const normalized = (m || "").toLowerCase().replace(/[^a-z ]/g, "").trim();
        return normalized.includes("You have already confirmed service start.");
      };
      if (response?.data?.status === "success") {
        toast.success(msg || "Service start confirmed successfully");
        setOpenSecurityCodeMatchModal(false);
        setServiceStarted(true);
      } else if (isAlreadyConfirmed(msg)) {
        // Proceed to next step if already confirmed
        toast.info(msg || "Service already confirmed; continuing.");
        setOpenSecurityCodeMatchModal(false);
        setServiceStarted(true);
      } else {
        if (msg === "You have already confirmed service start.") {
          setOpenSecurityCodeMatchModal(false);
          setServiceStarted(true);
          toast.success(msg)
        }
        else{

          toast.error(msg || "Failed to confirm service start");
        }
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "";

      const isAlreadyConfirmed = (m: string) => {
        const normalized = (m || "").toLowerCase().replace(/[^a-z ]/g, "").trim();
        return normalized.includes("already confirmed");
      };
      if (isAlreadyConfirmed(msg)) {
        toast.info(msg || "Service already confirmed; continuing.");
        setOpenSecurityCodeMatchModal(false);
        setServiceStarted(true);
      } else {
        console.error("Error calling confirm start API:", error);
        toast.error(msg || "An error occurred. Please try again.");
      }
    }
  };

  const handleRenegotiate = () => {
    setOpenRenegotiateModal(true);
  };

  const handleRenegotiateProceed = async (amount: string) => {
    try {
      const sanitized = String(amount).replace(/[^0-9.\-]/g, "");
      const endpoint = `quoteService/${data.id}/submit-adjustment`;
      const response = await apiPost<any>(endpoint, { adjustment_amount: sanitized });

      if (response?.data?.status === "success") {
        toast.success(response.data.message || "Adjustment submitted successfully");
        setOpenRenegotiateModal(false);
        setOpenClientApprovalModal(true);
      } else {
        toast.error(response?.data?.message || "Failed to submit adjustment");
      }
    } catch (error: any) {
      console.error("Error submitting adjustment:", error);
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleClientApprovalProceed = () => {
    setOpenClientApprovalModal(false);
    setRenegotiated(true);
  };

  const handleMarkAsComplete = () => {
    setOpenEnterSecurityCodeModal(true);
  };

  const handleValidateSecurityCode = () => {
    setOpenEnterSecurityCodeModal(false);
    setOpenSecurityCodeSuccessModal(true);
  };

  const handleSecurityCodeSuccess = () => {
    setOpenSecurityCodeSuccessModal(false);
    setServiceCompleted(true);
  };


  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon sx={{ color: "#424242" }} />}
        onClick={() => setSelectedQuots(null)}
        sx={{
          color: "#214C65",
          fontWeight: 500,
          fontSize: "1rem",
          lineHeight: "140%",
          letterSpacing: 0,
          textTransform: "none",
          mb: "1.25rem",
          px: 0,
          minWidth: 0,
          "& .MuiButton-startIcon": { mr: "0.5rem" },
          "&:hover": {
            bgcolor: "transparent",
            color: "#2C6587",
          },
        }}
      >
        Back to All requests
      </Button>

      {/* Main Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: "1.5rem", md: "2.5rem" },
        }}
      >
        {/* Left Column */}
        <Box>
          {/* Task Image Card */}
          <TaskImageCard
            image={data.image}
            title={data.title}
            date={data.date}
            time={data.time}
            serviceProvider={data.title || "Service"}
            location={data.location}
          />

          {/* Service Description */}
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
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                fontWeight: 600,
              }}
            >
              Service description
            </Typography>
            <Typography
              sx={{
                color: "#555555",
                fontWeight: 400,
                fontSize: "1.125rem",
                lineHeight: "1.575rem",
                letterSpacing: 0,
                textAlign: "justify",
              }}
            >
              {data.description}
            </Typography>
          </Box>

          {/* Job Photos */}
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
                mb: "1rem",
              }}
            >
              Job photos
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: "1rem",
              }}
            >
              {data.jobPhotos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "9rem",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "0.0625rem solid #E5E7EB",
                  }}
                >
                  <Image
                    src={photo}
                    alt={`Job photo ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Payment Breakdown */}
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
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
                  {data.paymentBreakdown.finalizedQuoteAmount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
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
                  {data.paymentBreakdown.platformFee}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
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
                  {data.paymentBreakdown.taxes}
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                  {data.paymentBreakdown.total}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box>
          {/* Finalized Quote Amount Card */}
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
                letterSpacing: 0,
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
              {data.finalizedQuoteAmount}
            </Typography>
          </Card>

          {/* Security Code */}
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
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Security Code
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "0.625rem",
                justifyContent: "space-between",
              }}
            >
              {data.securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    py: "1.438rem",
                    px: "2.089rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1.25rem",
                    bgcolor: "#EAF0F34D",
                  }}
                >
                  <Typography
                    fontWeight={400}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "100%",
                      letterSpacing: 0,
                      verticalAlign: "middle",
                    }}
                  >
                    {digit}
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
                letterSpacing: 0,
              }}
            >
              Note: First 3 digits will be given to you on service date
            </Typography>
          </Card>

          {/* About Client Card */}
          <Box
            sx={{
              px: "1.375rem",
              py: "1rem",
              borderRadius: "0.75rem",
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                mb: "1rem",
              }}
            >
              About client
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={data.clientAvatar}
                  alt={data.clientName}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography
                    fontWeight={600}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "1.5rem",
                      letterSpacing: 0,
                    }}
                  >
                    {data.clientName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                        fill="#6B7280"
                      />
                    </svg>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {data.clientPhone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Chat Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#214C65",
                  color: "#FFFFFF",
                  textTransform: "none",
                  px: "1.75rem",
                  py: "0.625rem",
                  width: "fit-content",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  lineHeight: "1.125rem",
                  letterSpacing: 0,
                  "&:hover": {
                    bgcolor: "#1b3f55",
                  },
                }}
              >
                Chat
              </Button>
            </Box>
          </Box>

          {/* Address Card */}
          <Box
            sx={{
              px: "1rem",
              py: "0.8125rem",
              borderRadius: "0.75rem",
              mb: "1.5rem",
              border: "0.0625rem solid #E6E6E6",
              boxShadow: "none",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
              }}
            >
              Address
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <LocationOnIcon
                sx={{
                  fontSize: "1.5rem",
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#6B7280",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#595959",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: 0,
                }}
              >
                {data.location || "Address not available"}
              </Typography>
            </Box>
          </Box>

          {/* Service Status Card */}
          <Box
            sx={{
              p: "1.5rem",
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              boxShadow: "none",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#323232",
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: 0,
                mb: "1.25rem",
              }}
            >
              Service Status
            </Typography>

            {data.serviceTimeline.map((item, index) => {
              let isCompleted = item.completed;
              if (locationShared && index === 2) isCompleted = true;
              if (serviceStarted && index === 3) isCompleted = true;
              if (renegotiated && index === 4) isCompleted = true;
              if (serviceCompleted && index <= 4) isCompleted = true;

              return (
                <Box
                  key={index}
                  sx={{
                    mb: index === data.serviceTimeline.length - 1 ? 0 : 3,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "50%",
                        bgcolor: isCompleted ? "#2E7D32" : "#424242",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? (
                        <CheckIcon
                          sx={{ fontSize: "0.6rem", color: "white" }}
                        />
                      ) : (
                        <Typography
                          fontWeight="600"
                          sx={{ color: "white", fontSize: "0.875rem" }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight={400}
                        sx={{
                          color: "#2B2B2B",
                          fontSize: "1rem",
                          lineHeight: "1.4rem",
                          letterSpacing: 0,
                          mb: "0.188rem",
                        }}
                      >
                        {item.status}
                      </Typography>
                      <Typography
                        fontWeight={400}
                        sx={{
                          color: "#737373",
                          fontSize: "0.75rem",
                          lineHeight: "1.125rem",
                          letterSpacing: 0,
                          textAlign: "left",
                        }}
                      >
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                  {index < data.serviceTimeline.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "1.5rem",
                        width: "0.125rem",
                        bottom: "-1.5rem",
                        bgcolor: "#E5E7EB",
                      }}
                    />
                  )}
                </Box>
              );
            })}

            {/* Action Buttons */}
            {!serviceCompleted && (
              <>
                {!locationShared ? (
                  // Step 0: Show Cancel and Out for Service buttons
                  <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#EF5350",
                        color: "#EF5350",
                        textTransform: "none",
                        py: "0.625rem",
                        px: "1rem",
                        borderRadius: "0.75rem",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        lineHeight: "1rem",
                        width: "9.188rem",
                        "&:hover": {
                          borderColor: "#EF5350",
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleOutForService}
                      sx={{
                        bgcolor: "#214C65",
                        color: "#FFFFFF",
                        textTransform: "none",
                        py: "0.625rem",
                        px: "1rem",
                        borderRadius: "0.75rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        lineHeight: "140%",
                        letterSpacing: 0,
                        "&:hover": {
                          bgcolor: "#1b3f55",
                        },
                      }}
                    >
                      Out for Service
                    </Button>
                  </Box>
                ) : !serviceStarted ? (
                  // Step 1: Show Start the Service button after location shared
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={handleStartService}
                      sx={{
                        bgcolor: "#214C65",
                        color: "#FFFFFF",
                        textTransform: "none",
                        width: "12.3125rem", // 197px
                        height: "3rem", // 48px
                        px: "0.625rem",
                        py: "0.625rem",
                        borderRadius: "0.75rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        lineHeight: "140%",
                        letterSpacing: 0,
                        "&:hover": {
                          bgcolor: "#1b3f55",
                        },
                      }}
                    >
                      Start the Service
                    </Button>
                  </Box>
                ) : !renegotiated ? (
                  // Step 2: Show Renegotiate and Mark as Complete buttons after service started
                  <Box
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      mt: 4,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleRenegotiate}
                      sx={{
                        borderColor: "#214C65",
                        color: "#214C65",
                        textTransform: "none",
                        height: "3rem",
                        px: "0.625rem",
                        py: "0.625rem",
                        borderRadius: "0.75rem",
                        fontWeight: 700,
                        fontSize: "1.1875rem", // 19px
                        lineHeight: "1.25rem", // 20px
                        letterSpacing: "0.01em",
                        "&:hover": {
                          borderColor: "#214C65",
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Renegotiate
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleMarkAsComplete}
                      sx={{
                        bgcolor: "#214C65",
                        color: "#FFFFFF",
                        textTransform: "none",
                        height: "3rem",
                        px: "0.625rem",
                        py: "0.625rem",
                        borderRadius: "0.75rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        lineHeight: "140%",
                        letterSpacing: 0,
                        "&:hover": {
                          bgcolor: "#1b3f55",
                        },
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                ) : (
                  // Step 3: Show Cancel and Mark as Complete buttons after renegotiation
                  <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "space-between" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        textTransform: "none",
                        py: "1.125rem",
                        fontSize: "1.188rem",
                        px: "1rem",
                        borderRadius: "0.75rem",
                        fontWeight: 700,
                        lineHeight: "1rem",
                        "&:hover": {
                          borderColor: "#DC2626",
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleMarkAsComplete}
                      sx={{
                        bgcolor: "#214C65",
                        color: "#FFFFFF",
                        textTransform: "none",
                        px: "1rem",
                        py: "1.125rem",
                        fontSize: "1.188rem",
                        borderRadius: "0.75rem",
                        fontWeight: 700,
                        lineHeight: "1.25rem",
                        letterSpacing: 0,
                        "&:hover": {
                          bgcolor: "#1b3f55",
                        },
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
          {/* Information Message - Show after service completed */}
          {serviceCompleted && (
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.2,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="#F59E0B"
                    />
                  </svg>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                    Information message:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, fontSize: "0.8rem" }}
                  >
                    CoudPouss does not guarantee the quality of services
                    exchanged from this point onward. Our role is to connect you
                    with professionals and secure your transactions through
                    escrow. All providers on our platform issue their own
                    invoices directly to clients. Once you provide the
                    validation code to your provider, you must request an
                    invoice or receipt from them for your payment.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Location Share Modal */}
      <LocationShareModal
        open={openLocationModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLocation}
      />

      {/* Security Code Match Modal */}
      <SecurityCodeMatchModal
        open={openSecurityCodeMatchModal}
        onClose={() => setOpenSecurityCodeMatchModal(false)}
        onConfirm={handleSecurityCodeMatch}
        securityCode={data.securityCode}
      />

      {/* Renegotiate Modal */}
      <RenegotiateModal
        open={openRenegotiateModal}
        onClose={() => setOpenRenegotiateModal(false)}
        onProceed={handleRenegotiateProceed}
        finalizedAmount={(() => {
          const str = data.paymentBreakdown?.finalizedQuoteAmount || data.finalizedQuoteAmount || "";
          const num = Number(String(str).replace(/[^0-9.\-]/g, ""));
          return isNaN(num) ? undefined : num;
        })()}
        paymentBreakdown={{
          base_amount: (() => {
            const str = data.paymentBreakdown?.finalizedQuoteAmount || "0";
            return Number(String(str).replace(/[^0-9.\-]/g, ""));
          })(),
          platform_fee: (() => {
            const str = data.paymentBreakdown?.platformFee || "0";
            return Number(String(str).replace(/[^0-9.\-]/g, ""));
          })(),
          taxes: (() => {
            const str = data.paymentBreakdown?.taxes || "0";
            return Number(String(str).replace(/[^0-9.\-]/g, ""));
          })(),
          total: (() => {
            const str = data.paymentBreakdown?.total || "0";
            return Number(String(str).replace(/[^0-9.\-]/g, ""));
          })(),
        }}
      />

      {/* Client Approval Modal */}
      <ClientApprovalModal
        open={openClientApprovalModal}
        onClose={() => setOpenClientApprovalModal(false)}
        onProceed={handleClientApprovalProceed}
      />

      {/* Enter Security Code Modal */}
      <EnterSecurityCodeModal
        open={openEnterSecurityCodeModal}
        onClose={() => setOpenEnterSecurityCodeModal(false)}
        onValidate={handleValidateSecurityCode}
      />

      {/* Security Code Success Modal */}
      <SecurityCodeSuccessModal
        open={openSecurityCodeSuccessModal}
        onClose={() => setOpenSecurityCodeSuccessModal(false)}
        onProceed={handleSecurityCodeSuccess}
      />
    </Box>
  );
}
