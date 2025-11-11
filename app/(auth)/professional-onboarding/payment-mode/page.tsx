"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import SuccessModal from "@/components/SuccessModal";

const paymentMethods = [
  {
    id: "google-pay",
    name: "Google Pay",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
  },
  {
    id: "credit-card",
    name: "Credit Card",
  },
];

export default function PaymentModePage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("google-pay");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubscribe = () => {
    // Show success modal after payment
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate to additional details (optional step)
    router.push(ROUTES.PROFESSIONAL_ONBOARDING_ADDITIONAL_DETAILS);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left side - Image Section */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "66.666%" },
          position: "relative",
          bgcolor: "grey.100",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          <Image
            src="/image/main.png"
            alt="CoudPouss Service"
            fill
            style={{ objectFit: "cover" }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "33.333%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          overflowY: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              width: "100%",
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  🏠
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                CoudPouss
              </Typography>
            </Box>

            {/* Content */}
            <Box>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
                Payment Mode
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a quick and secure way to complete your subscription
              </Typography>

              {/* Plan Summary */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                  bgcolor: "#f9fafb",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Professional (Certified)
                </Typography>
                <Typography variant="h6" color="#2F6B8E" fontWeight="bold">
                  €15.99
                  <Typography component="span" variant="body2" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  Billed on a recurring monthly basis
                </Typography>
              </Paper>

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Choose payment method
              </Typography>

              {paymentMethods.map((method) => (
                <Paper
                  key={method.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: selectedMethod === method.id ? "2px solid #2F6B8E" : "1px solid #e0e0e0",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" fontWeight="600">
                        {method.id === "google-pay" ? "G" : method.id === "apple-pay" ? "" : "💳"}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {method.name}
                    </Typography>
                  </Box>
                  <Radio
                    checked={selectedMethod === method.id}
                    value={method.id}
                    sx={{
                      color: "#2F6B8E",
                      "&.Mui-checked": {
                        color: "#2F6B8E",
                      },
                    }}
                  />
                </Paper>
              ))}

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  sx={{
                    borderColor: "#2F6B8E",
                    color: "#2F6B8E",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#25608A",
                      bgcolor: "rgba(47, 107, 142, 0.04)",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubscribe}
                  sx={{
                    bgcolor: "#2F6B8E",
                    color: "white",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessClose}
        title="Welcome aboard!"
        message="Your subscription is now active. You are now receiving all features immediately."
        buttonText="Complete Profile Now"
        showSubscriptionDetails={true}
        subscriptionDetails={{
          plan: "Professional/Monthly",
          modeOfPayment: selectedMethod === "google-pay" ? "Google Pay" : selectedMethod === "apple-pay" ? "Apple Pay" : "Credit Card",
          subscriptionDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          startDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          billingDate: "Monthly",
        }}
      />
    </Box>
  );
}
