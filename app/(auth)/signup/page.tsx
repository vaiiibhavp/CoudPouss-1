"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

type SignupStep = "select-profile" | "enter-contact" | "verify-otp" | "create-password" | "add-details";
type UserType = "elder" | "professional" | null;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("select-profile");
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: ["", "", "", ""],
    password: "",
    confirmPassword: "",
    reEnterPassword: "",
    name: "",
    mobileNo: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleProfileSelect = (type: "elder" | "professional") => {
    setUserType(type);
    if (type === "professional") {
      // Redirect to professional signup flow
      router.push(ROUTES.SIGNUP_PROFESSIONAL_ENTER_CONTACT);
    } else {
      // For elder, continue with current flow
      setStep("enter-contact");
    }
  };

  const handleContinue = () => {
    if (step === "enter-contact") {
      if (!formData.emailOrMobile) {
        setErrors({ emailOrMobile: "Please enter email or mobile number" });
        return;
      }
      setStep("verify-otp");
    } else if (step === "verify-otp") {
      if (formData.otp.some((digit) => !digit)) {
        setErrors({ otp: "Please enter valid code" });
        return;
      }
      setStep("create-password");
    } else if (step === "create-password") {
      if (!formData.password || !formData.confirmPassword || !formData.reEnterPassword) {
        setErrors({ password: "Please fill all password fields" });
        return;
      }
      if (formData.password !== formData.confirmPassword || formData.password !== formData.reEnterPassword) {
        setErrors({ password: "Passwords do not match" });
        return;
      }
      setStep("add-details");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement actual signup API call
      console.log("Signup data:", { userType, formData });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "select-profile":
        return (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2F6B8E", mb: 1 }}>
              Welcome To CoudPouss!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleProfileSelect("elder")}
              sx={{
                bgcolor: "#2F6B8E",
                color: "white",
                py: 1.5,
                mb: 2,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Sign up as Elder
            </Button>
            <Box sx={{ textAlign: "center", my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleProfileSelect("professional")}
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
              Sign up as Professional
            </Button>
          </Box>
        );

      case "enter-contact":
        return (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2F6B8E", mb: 1 }}>
              Welcome To CoudPouss!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              02_Enter Contact
            </Typography>
            <TextField
              fullWidth
              label="Email/ Mobile No"
              name="emailOrMobile"
              placeholder="Enter Email/ Mobile No"
              value={formData.emailOrMobile}
              onChange={handleChange}
              error={!!errors.emailOrMobile}
              helperText={errors.emailOrMobile}
              margin="normal"
              sx={{ mb: 3 }}
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
              Continue
            </Button>
          </Box>
        );

      case "verify-otp":
        return (
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2F6B8E", mb: 1 }}>
              Welcome To CoudPouss!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              To continue Please enter the 4 Digit OTP sent to your Email or Phone Number.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
              {formData.otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" },
                  }}
                  sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      height: 60,
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
                color: "#2F6B8E",
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
              Verify OTP
            </Button>
          </Box>
        );

      case "create-password":
        return (
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
        );

      case "add-details":
        return (
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
        );

      default:
        return null;
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
      {step !== "select-profile" && (
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
            {step === "enter-contact" && "01_Select Profile"}
            {step === "verify-otp" && "02_Enter Contact"}
            {step === "create-password" && "03_Verify OTP"}
            {step === "add-details" && "04_Create Password"}
          </Typography>
        </Box>
      )}

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

      {/* Right side - Signup Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "33.333%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          overflowY: "auto",
          pt: step !== "select-profile" ? { xs: 4, md: 10 } : 4,
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

            {/* Step Content */}
            {renderStepContent()}

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  sx={{ color: "#2F6B8E", textDecoration: "none", fontWeight: 500 }}
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
