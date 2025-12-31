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
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { buildInputData } from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";

interface SignUpApiError {
  [key: string]: string;
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

export default function ProfessionalEnterContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
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

  const apiCallToSignUpUser = async (): Promise<SignUpApiResponse> => {
    try {
      let payload = {};
      let url = API_ENDPOINTS.AUTH.START;
      let validData = buildInputData(formData.emailOrMobile);

      if (validData.email) {
        payload = {
          email: validData.email || "",
          role: "service_provider",
        };
      } else {
        payload = {
          mobile: validData.mobile || "",
          phone_country_code: validData.phone_country_code || "",
          role: "service_provider",
        };
      }

      const response = await apiPost(url, payload);

      if (response.success && response.data) {
        return { data: response.data, error: null };
      } else {
        let error: SignUpApiError = {};
        if (response.error) {
          error = { submit: response.error.message || "Something went wrong." };
        }
        return {
          data: null,
          error: Object.keys(error).length > 0 ? error : { general: "Something went wrong" },
        };
      }
    } catch (error: any) {
      return {
        data: null,
        error: { general: error.message || "Something went wrong" },
      };
    }
  };

  const handleContinue = async () => {
    if (!formData.emailOrMobile) {
      setErrors({ emailOrMobile: "Please enter email or mobile number" });
      return;
    }

    setLoading(true);
    let { data, error } = await apiCallToSignUpUser();

    if (data) {
      // Store in sessionStorage to pass to next step
      sessionStorage.setItem("professional_contact", formData.emailOrMobile);
      router.push(ROUTES.SIGNUP_PROFESSIONAL_VERIFY_OTP);
    } else {
      if (error) {
        const errorMsg =
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          sessionStorage.setItem("professional_contact", formData.emailOrMobile);
          router.push(ROUTES.SIGNUP_PROFESSIONAL_VERIFY_OTP);
        } else if (errorMsg.includes("OTP already verified")) {
          sessionStorage.setItem("professional_contact", formData.emailOrMobile);
          router.push(ROUTES.SIGNUP_PROFESSIONAL_CREATE_PASSWORD);
        } else if (errorMsg.includes("Password already set")) {
          sessionStorage.setItem("professional_contact", formData.emailOrMobile);
          router.push(ROUTES.SIGNUP_PROFESSIONAL_ADD_DETAILS);
        } else {
          toast.error(errorMsg);
        }
      }
    }
    setLoading(false);
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
      {/* <Box
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
      </Box> */}

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
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  // bgcolor: 'primary.main',
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
                error={false}
                helperText=""
                margin="normal"
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleContinue}
                disabled={loading}
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
                {loading ? "Loading..." : "Continue"}
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
