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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

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
          04_Add Details
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
            <Box component="form" onSubmit={handleSubmit}>
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

              <Typography gutterBottom sx={{ mb: 1, fontSize: "24px", fontWeight: 700, color: "#424242", lineHeight: "28px" }}>
                Add Personal Details
              </Typography>
              <Typography sx={{ mb: 3, color: "#6D6D6D", lineHeight: "20px", fontSize: "18px" }}>
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
                    border: "3px solid primary.dark",
                  }}
                >
                  {formData.profilePicture ? (
                    <Typography variant="h4" sx={{ color: "primary.dark" }}>
                      {formData.name.charAt(0).toUpperCase()}
                      {formData.name.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                    </Typography>
                  ) : (
                    <Typography variant="h4" sx={{ color: "primary.dark" }}>
                      BC
                    </Typography>
                  )}
                </Box>
                <Typography
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("profile-upload")?.click();
                  }}
                  sx={{
                    color: "primary.normal",
                    textDecoration: "none",
                    lineHeight: "140%",
                    fontSize: "1rem",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  upload profile picture
                </Typography>
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
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}  >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "17px",
                      lineHeight: "20px",
                      color: "#6D6D6D",
                      mb: "8px"
                    }}
                  >
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    margin="normal"
                    sx={{
                      m: 0
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "17px",
                      lineHeight: "20px",
                      color: "#6D6D6D",
                      mb: "8px"
                    }}
                  >
                    Mobile No.
                  </Typography>
                  <TextField
                    fullWidth
                    name="mobileNo"
                    placeholder="Enter Mobile No."
                    value={formData.mobileNo}
                    onChange={handleChange}
                    error={!!errors.mobileNo}
                    helperText={errors.mobileNo}
                    margin="normal" sx={{
                      m: 0
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "17px",
                      lineHeight: "20px",
                      color: "#6D6D6D",
                      mb: "8px"
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                    sx={{
                      m: 0
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "17px",
                      lineHeight: "20px",
                      color: "#6D6D6D",
                      mb: "8px"
                    }}
                  >
                    Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    margin="normal"
                    multiline
                    rows={3}
                    sx={{
                      m: 0
                    }}
                  />
                </Box>
              </Box>
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
                  bgcolor: "primary.dark",
                  color: "white",
                  py: 1.5,
                  mt:"40px",
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
