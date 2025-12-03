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
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
                textAlign: "center"


              }}
            >
              Welcome To CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "40px",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleProfileSelect("elder")}
              sx={{
                bgcolor: "primary.dark",
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
              <Typography

                sx={{
                  fontSize: "18px",
                  color: "#818285",

                }}
              >
                OR
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleProfileSelect("professional")}
              sx={{
                borderColor: "primary.dark",
                color: "primary.dark",
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
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
                textAlign: "center"


              }}
            >
              Welcome To CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "40px",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Typography sx={{
              fontWeight: 500,
              fontSize: "17px",
              lineHeight: "20px",
              color: "#424242",
              mb: "8px"
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
        );

      case "verify-otp":
        return (
          <Box>
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
                textAlign: "center"


              }}
            >
              Welcome To CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "40px",
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
              mb: "20px",
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
                    style: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", width: "80px" },
                  }}
                  sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      height: 60,
                      width: "80.5px"
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
                fontSize: "20px",
                lineHeight: "24px", fontWeight: 600,
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
        );

      case "create-password":
        return (
          <Box>
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
                textAlign: "center"


              }}
            >
              Welcome To CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "40px",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
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
                mb: "44px"
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
              Next
            </Button>
          </Box>
        );

      case "add-details":
        return (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `24px`,
                color: `primary.normal`,
                mb: "12px",
                lineHeight: "28px",
                textAlign: "center"


              }}
            >
              Welcome To CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "140%",
                mb: "40px",
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
                  fontSize: "16px",
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

            {/* Step Content */}
            {renderStepContent()}

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography sx={{
                color: 'secondary.naturalGray',
                fontSize: "18px",
                lineHeight: "20px"
              }}>
                Already have an account?{" "}
                <Link
                  href={ROUTES.SIGNUP}
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
