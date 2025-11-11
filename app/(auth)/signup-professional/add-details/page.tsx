"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function ProfessionalAddDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get data from sessionStorage
      const contact = sessionStorage.getItem("professional_contact");
      const otp = sessionStorage.getItem("professional_otp");
      const password = sessionStorage.getItem("professional_password");

      // TODO: Implement actual signup API call
      console.log("Professional Signup data:", {
        userType: "professional",
        contact,
        otp,
        password,
        ...formData,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear signup sessionStorage
      sessionStorage.removeItem("professional_contact");
      sessionStorage.removeItem("professional_otp");
      sessionStorage.removeItem("professional_password");

      // Redirect to professional onboarding
      router.push(ROUTES.PROFESSIONAL_ONBOARDING_SELECT_PLAN);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bgcolor: "#374151",
          color: "white",
          py: 1.5,
          px: 3,
          zIndex: 1000,
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography variant="body1" fontWeight="500">
          04_Create Password
        </Typography>
      </Box>

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
          pt: { xs: 4, md: 10 },
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
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  🏠
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                CoudPouss!
              </Typography>
            </Box>

            {/* Content */}
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2F6B8E", mb: 1 }}>
                Welcome To CoudPouss!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
              </Typography>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
                Add Personal Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter profile details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    border: "3px solid #2F6B8E",
                  }}
                >
                  {formData.profilePicture ? (
                    <Typography variant="h4" sx={{ color: "#2F6B8E" }}>
                      {formData.name.charAt(0).toUpperCase()}
                      {formData.name.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                    </Typography>
                  ) : (
                    <Typography variant="h4" sx={{ color: "#2F6B8E" }}>
                      BC
                    </Typography>
                  )}
                </Box>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("profile-upload")?.click();
                  }}
                  sx={{
                    color: "#2F6B8E",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  upload profile picture
                </Link>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, profilePicture: file }));
                    }
                  }}
                />
              </Box>
              <TextField
                fullWidth
                label="Name"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Mobile No."
                name="mobileNo"
                placeholder="Enter Mobile No."
                value={formData.mobileNo}
                onChange={handleChange}
                error={!!errors.mobileNo}
                helperText={errors.mobileNo}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                margin="normal"
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />
              {errors.submit && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errors.submit}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
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
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
