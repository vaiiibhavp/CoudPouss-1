"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { apiPost } from "@/lib/api";
import { buildInputData, isValidPassword } from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";

interface SignUpApiError {
  [key: string]: string;
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

export default function ProfessionalCreatePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    reEnterPassword: "",
    emailOrMobile: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get emailOrMobile from sessionStorage
    const contact = sessionStorage.getItem("professional_contact");
    if (contact) {
      setFormData((prev) => ({ ...prev, emailOrMobile: contact }));
    } else {
      // If no contact found, redirect back to enter-contact
      router.push(ROUTES.SIGNUP_PROFESSIONAL_ENTER_CONTACT);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      const { valid, errors } = isValidPassword(value);
      if (!valid) {
        setPasswordErrors(errors);
      } else {
        setPasswordErrors([]);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const apiCallToCreatePassword = async (): Promise<SignUpApiResponse> => {
    try {
      let payload = {};
      let url = API_ENDPOINTS.AUTH.CREATE_PASSWORD;
      let validData = buildInputData(formData.emailOrMobile);

      if (validData.email) {
        payload = {
          email: validData.email || "",
          password: formData.password,
          confirm_password: formData.confirmPassword,
        };
      } else {
        payload = {
          mobile: validData.mobile || "",
          phone_country_code: validData.phone_country_code || "",
          password: formData.password,
          confirm_password: formData.confirmPassword,
        };
      }

      const response = await apiPost(url, payload);

      if (response.success && response.data) {
        return { data: response.data, error: null };
      } else {
        let error: SignUpApiError = {};
        if (response.error) {
          error = { password: response.error.message || "Something went wrong." };
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
    if (!formData.password || !formData.confirmPassword || !formData.reEnterPassword) {
      setErrors({ password: "Please fill all password fields" });
      return;
    }
    if (formData.password !== formData.confirmPassword || formData.password !== formData.reEnterPassword) {
      setErrors({ confirmPassword: "Please make sure your passwords match." });
      return;
    }

    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors.join(", ") });
      return;
    }

    setLoading(true);
    let { data, error } = await apiCallToCreatePassword();

    if (data) {
      router.push(ROUTES.SIGNUP_PROFESSIONAL_ADD_DETAILS);
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
          router.push(ROUTES.SIGNUP_PROFESSIONAL_VERIFY_OTP);
        } else if (errorMsg.includes("OTP already verified")) {
          router.push(ROUTES.SIGNUP_PROFESSIONAL_CREATE_PASSWORD);
        } else if (errorMsg.includes("Password already set")) {
          router.push(ROUTES.SIGNUP_PROFESSIONAL_ADD_DETAILS);
        } else {
          setErrors({ confirmPassword: errorMsg });
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
          03_Create Password
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
                  width: 80,
                  height: 80,
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

              <Typography
                sx={{
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "center"
                }}>
                Create a strong password
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "20px",
                  color: "#6D6D6D",
                  mb: "8px"
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                sx={{
                  m: 0,
                  mb: 2
                }}
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

              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "20px",
                  color: "#6D6D6D",
                  mb: "8px"
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                sx={{
                  m: 0,
                  mb: 2
                }}
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter Password"
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

              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "20px",
                  color: "#6D6D6D",
                  mb: "8px"
                }}
              >
                Re-enter Password
              </Typography>
              <TextField
                sx={{
                  m: 0,
                  mb: "44px"
                }}
                fullWidth
                name="reEnterPassword"
                type={showReEnterPassword ? "text" : "password"}
                placeholder="Re-enter Password"
                value={formData.reEnterPassword}
                onChange={handleChange}
                margin="normal"
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
                {loading ? "Loading..." : "Next"}
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
