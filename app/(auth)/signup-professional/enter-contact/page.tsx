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

export default function ProfessionalEnterContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContinue = () => {
    if (!formData.emailOrMobile) {
      setErrors({ emailOrMobile: "Please enter email or mobile number" });
      return;
    }
    // Store in sessionStorage to pass to next step
    sessionStorage.setItem("professional_contact", formData.emailOrMobile);
    router.push(ROUTES.SIGNUP_PROFESSIONAL_VERIFY_OTP);
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
          01_Enter Contact
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
                fontWeight: 500,
                fontSize: "1.0625rem",
                lineHeight: "1.25rem",
                color: "#424242",
                mb: "0.5rem"
              }}>
                Enter Email / Mobile No
              </Typography>
              <TextField
                sx={{
                  m: 0,
                  mb: 3
                }}
                fullWidth
                name="emailOrMobile"
                placeholder="Enter Email/ Mobile No"
                value={formData.emailOrMobile}
                onChange={handleChange}
                error={!!errors.emailOrMobile}
                helperText={errors.emailOrMobile}
                margin="normal"
              />
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
                Continue
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
