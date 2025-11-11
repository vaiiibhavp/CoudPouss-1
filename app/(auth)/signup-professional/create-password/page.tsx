"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function ProfessionalCreatePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    reEnterPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContinue = () => {
    if (!formData.password || !formData.confirmPassword || !formData.reEnterPassword) {
      setErrors({ password: "Please fill all password fields" });
      return;
    }
    if (formData.password !== formData.confirmPassword || formData.password !== formData.reEnterPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }
    // Store password in sessionStorage
    sessionStorage.setItem("professional_password", formData.password);
    router.push(ROUTES.SIGNUP_PROFESSIONAL_ADD_DETAILS);
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
          03_Verify OTP
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
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2F6B8E", mb: 1 }}>
                Welcome To CoudPouss!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
              </Typography>
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                Create a strong password
              </Typography>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Re-enter Password"
                name="reEnterPassword"
                type={showReEnterPassword ? "text" : "password"}
                placeholder="Re-enter Password"
                value={formData.reEnterPassword}
                onChange={handleChange}
                margin="normal"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowReEnterPassword(!showReEnterPassword)} edge="end">
                        {showReEnterPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
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
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
