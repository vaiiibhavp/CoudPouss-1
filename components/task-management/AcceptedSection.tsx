"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Card, Avatar, Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
}

export default function AcceptedSection({ data }: AcceptedSectionProps) {
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

  const handleConfirmLocation = () => {
    setOpenLocationModal(false);
    setLocationShared(true);
  };

  const handleCloseModal = () => {
    setOpenLocationModal(false);
  };

  const handleStartService = () => {
    setOpenSecurityCodeMatchModal(true);
  };

  const handleSecurityCodeMatch = () => {
    setOpenSecurityCodeMatchModal(false);
    setServiceStarted(true);
  };

  const handleRenegotiate = () => {
    setOpenRenegotiateModal(true);
  };

  const handleRenegotiateProceed = () => {
    setOpenRenegotiateModal(false);
    setOpenClientApprovalModal(true);
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
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push(ROUTES.PROFESSIONAL_EXPLORE_REQUESTS)}
        sx={{
          color: "text.secondary",
          textTransform: "none",
          mb: 3,
          "&:hover": {
            bgcolor: "transparent",
            color: "primary.main",
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
          gap: 4,
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
            serviceProvider="DIY Services"
            location={data.location}
          />

          {/* Service Description */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", fontSize: "1.125rem" }}
            >
              Service description
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", lineHeight: 1.8 }}
            >
              {data.description}
            </Typography>
          </Box>

          {/* Job Photos */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", fontSize: "1.125rem", mb: 2 }}
            >
              Job photos
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {data.jobPhotos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    borderRadius: 2,
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
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", fontSize: "1.125rem", mb: 2 }}
            >
              Payment Breakdown
            </Typography>
            <Box sx={{ bgcolor: "#F9FAFB", p: 2, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Finalized Quote Amount
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {data.paymentBreakdown.finalizedQuoteAmount}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Platform Fee (15%)
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {data.paymentBreakdown.platformFee}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Taxes
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  {data.paymentBreakdown.taxes}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: "#1F2937" }}
                >
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ color: "#2F6B8E" }}
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
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Finalized Quote Amount
            </Typography>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "#2F6B8E", mb: 3 }}
            >
              {data.finalizedQuoteAmount}
            </Typography>
          </Card>

          {/* Security Code */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Security Code
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {data.securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    borderRadius: 2,
                    bgcolor: "#F3F4F6",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="500"
                    sx={{ color: "#1F2937" }}
                  >
                    {digit}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Note: First 3 digits will be given to you on service date
            </Typography>
          </Card>

          {/* About Client Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              About client
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={data.clientAvatar}
                  alt={data.clientName}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
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
                  bgcolor: "#2F6B8E",
                  color: "white",
                  textTransform: "none",
                  py: 1.25,
                  px: 3,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                Chat
              </Button>
            </Box>
          </Card>

          {/* Address Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Address
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <LocationOnIcon
                sx={{ fontSize: "1.2rem", color: "#6B7280", mt: 0.2 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#374151", lineHeight: 1.6 }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Card>

          {/* Service Status Card */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "0.0625rem solid #E5E7EB",
              boxShadow: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              gutterBottom
              sx={{ color: "#1F2937", mb: 3 }}
            >
              Service Status
            </Typography>

            {/* Timeline */}
            {data.serviceTimeline.map((item, index) => {
              // Mark steps as completed based on workflow progress
              let isCompleted = item.completed;
              if (locationShared && index === 2) isCompleted = true; // Out for Service
              if (serviceStarted && index === 3) isCompleted = true; // Started Service
              if (renegotiated && index === 4) isCompleted = true; // Renegotiated (if applicable)
              if (serviceCompleted && index <= 4) isCompleted = true; // Service Completed

              // Show current step with different icon
              const isCurrentStep =
                (!locationShared && index === 2) ||
                (locationShared && !serviceStarted && index === 3) ||
                (serviceStarted && !serviceCompleted && index === 4) ||
                (serviceCompleted && index === 5);

              return (
                <Box key={index} sx={{ mb: 3, position: "relative" }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: isCompleted ? "#10B981" : "#4B5563",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon
                          sx={{ fontSize: "1.1rem", color: "white" }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ color: "white" }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        sx={{
                          color: "#1F2937",
                          mb: 0.5,
                        }}
                      >
                        {item.status}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                  {index < data.serviceTimeline.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 13.5,
                        top: 36,
                        width: "0.5%",
                        height: 40,
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
                      fullWidth
                      sx={{
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
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
                      onClick={handleOutForService}
                      sx={{
                        bgcolor: "#2F6B8E",
                        color: "white",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#25608A",
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
                      fullWidth
                      onClick={handleStartService}
                      sx={{
                        bgcolor: "#2F6B8E",
                        color: "white",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Start the Service
                    </Button>
                  </Box>
                ) : !renegotiated ? (
                  // Step 2: Show Renegotiate and Mark as Complete buttons after service started
                  <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleRenegotiate}
                      sx={{
                        borderColor: "#D1D5DB",
                        color: "#6B7280",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#9CA3AF",
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Renegotiate
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleMarkAsComplete}
                      sx={{
                        bgcolor: "#2F6B8E",
                        color: "white",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                ) : (
                  // Step 3: Show Cancel and Mark as Complete buttons after renegotiation
                  <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
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
                        bgcolor: "#2F6B8E",
                        color: "white",
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Card>
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
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ mb: 1 }}
                  >
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
