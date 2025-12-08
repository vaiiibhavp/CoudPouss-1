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

export default function ProfessionalVerifyOtpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    otp: ["", "", "", ""],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = () => {
    if (formData.otp.some((digit) => !digit)) {
      setErrors({ otp: "Please enter valid code" });
      return;
    }
    // Store OTP in sessionStorage
    sessionStorage.setItem("professional_otp", formData.otp.join(""));
    router.push(ROUTES.SIGNUP_PROFESSIONAL_CREATE_PASSWORD);
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
          02_Verify OTP
        </Typography>
      </Box>

      {/* Left side - Image Section */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "55%" },
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
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Signup Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Image
                  alt='appLogo'
                  width={140}
                  height={140}
                  src={"/icons/appLogo.png"}
                />
              </Box>
            </Box>

            {/* Content */}
            <Box>
              <Typography
                sx={{
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "center"
                }}
              >
                Welcome To CoudPouss
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  textAlign: "center",
                  lineHeight: "140%",
                  mb: "2.5rem",
                  color: "secondary.neutralWhiteDark",
                }}
              >
                Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
              </Typography>

              <Typography sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "1.25rem",
                color: "secondary.neutralWhiteDark",
              }}>
                To continue Please enter the 4 Digit OTP sent to your Email or Phone Number.
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "500",
                  lineHeight: "100%",
                  color: "#555555",
                  mb: 2
                }}
              >
                Code
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mb: 2 }}>
                {formData.otp.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", width: "5rem" },
                    }}
                    sx={{
                      width: 60,
                      "& .MuiOutlinedInput-root": {
                        height: 60,
                        width: "5.03125rem"
                      },
                    }}
                  />
                ))}
              </Box>
              {errors.otp && (
                <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: "center" }}>
                  {errors.otp}
                </Typography>
              )}
              <Link
                href="#"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mb: 3,
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem", fontWeight: 600,
                  color: "primary.normal",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Resend code
              </Link>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                sx={{
                  bgcolor: "primary.dark",
                  color: "white",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    bgcolor: "#25608A",
                  },
                }}
              >
                verify OTP
              </Button>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography sx={{
                color: 'secondary.naturalGray',
                fontSize: "18px",
                lineHeight: "20px"
              }}>
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  sx={{
                    color: 'primary.normal',
                    textDecoration: 'none',
                    offset: "3%",
                    fontWeight: 600,
                    fontSize: "20px",
                    lineHeight: "24px"
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
