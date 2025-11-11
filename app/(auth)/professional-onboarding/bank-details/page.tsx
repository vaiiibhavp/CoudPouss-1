"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import ThankYouModal from "@/components/ThankYouModal";

export default function BankDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSkip = () => {
    setShowSuccessModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountHolderName) {
      newErrors.accountHolderName = "Account holder name is required";
    }
    if (!formData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }
    if (!formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Please confirm account number";
    }
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers do not match";
    }
    if (!formData.ifscCode) {
      newErrors.ifscCode = "IFSC code is required";
    }
    if (!formData.bankName) {
      newErrors.bankName = "Bank name is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save bank details
    sessionStorage.setItem("bank_details", JSON.stringify(formData));
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Clear all onboarding data
    sessionStorage.removeItem("selected_plan");
    sessionStorage.removeItem("additional_details");
    sessionStorage.removeItem("selected_categories");
    sessionStorage.removeItem("bank_details");
    
    // Navigate to professional dashboard
    router.push(ROUTES.PROFESSIONAL_DASHBOARD);
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
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
                Add Bank Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select the plan that fits your activity. You can change it later in your profile.
              </Typography>

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Account Holder Name
              </Typography>
              <TextField
                fullWidth
                name="accountHolderName"
                placeholder="Enter Name"
                value={formData.accountHolderName}
                onChange={handleChange}
                error={!!errors.accountHolderName}
                helperText={errors.accountHolderName}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Account Number
              </Typography>
              <TextField
                fullWidth
                name="accountNumber"
                placeholder="Enter Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Confirm Account Number
              </Typography>
              <TextField
                fullWidth
                name="confirmAccountNumber"
                placeholder="Re-enter Account Number"
                value={formData.confirmAccountNumber}
                onChange={handleChange}
                error={!!errors.confirmAccountNumber}
                helperText={errors.confirmAccountNumber}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                IFSC Code
              </Typography>
              <TextField
                fullWidth
                name="ifscCode"
                placeholder="Enter IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
                error={!!errors.ifscCode}
                helperText={errors.ifscCode}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Bank Name
              </Typography>
              <TextField
                fullWidth
                name="bankName"
                placeholder="Enter Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                error={!!errors.bankName}
                helperText={errors.bankName}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleSkip}
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
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
                  Next
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Thank You Modal */}
      <ThankYouModal
        open={showSuccessModal}
        onClose={handleSuccessClose}
      />
    </Box>
  );
}
