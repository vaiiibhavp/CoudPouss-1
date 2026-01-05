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
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { parseMobile, buildInputData } from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";

interface SignUpApiError {
  [key: string]: string;
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

export default function ProfessionalAddDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
    emailOrMobile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profilePictureUploaded, setProfilePictureUploaded] = useState(false);

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

  // Auto-upload profile picture when email becomes available (if picture was selected first)
  useEffect(() => {
    const uploadIfNeeded = async () => {
      // Only upload if we have a picture, email is available, not currently uploading, and hasn't been uploaded yet
      if (formData.profilePicture && !uploadingPhoto && !profilePictureUploaded) {
        let email = formData.email;
        if (!email && formData.emailOrMobile) {
          const validData = buildInputData(formData.emailOrMobile);
          if (validData.email) {
            email = validData.email;
          }
        }

        // If email is now available, upload the picture
        if (email) {
          await uploadProfileImage(formData.profilePicture, email);
        }
      }
    };

    uploadIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.email, formData.emailOrMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
      setFormData((prev) => ({ ...prev, profilePicture: file }));

      // Clear any previous errors
      if (errors.profilePicture) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.profilePicture;
          return newErrors;
        });
      }

      // Get email from form or emailOrMobile
      let email = formData.email;
      if (!email && formData.emailOrMobile) {
        const validData = buildInputData(formData.emailOrMobile);
        if (validData.email) {
          email = validData.email;
        }
      }

      // Reset upload status when new file is selected
      setProfilePictureUploaded(false);

      // Upload immediately if email is available
      if (email) {
        await uploadProfileImage(file, email);
      } else {
        // If email is not available yet, show warning but keep the file
        // It will auto-upload when email is entered
        setErrors((prev) => ({
          ...prev,
          profilePicture: "Email is required. Picture will upload automatically when you enter your email.",
        }));
      }
    }
  };

  const uploadProfileImage = async (file: File, email: string): Promise<boolean> => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const url = API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PIC;

      // Get access token from Redux (lazy import to avoid circular dependency)
      let storeInstance: any = null;
      function getStore() {
        if (!storeInstance) {
          const storeModule = require('@/lib/redux/store');
          storeInstance = storeModule.store;
        }
        return storeInstance;
      }
      const store = getStore();
      const { accessToken } = store.getState().auth;
      const token = accessToken;

      const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.message || `HTTP error! status: ${response.status}`;
        toast.error(errorMsg);
        setProfilePictureUploaded(false);
        return false;
      }

      setProfilePictureUploaded(true);
      // Clear any previous errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profilePicture;
        return newErrors;
      });
      return true;
    } catch (error: any) {
      console.error("Profile photo upload error:", error);
      toast.error(error.message || "Failed to upload profile picture");
      return false;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const apiCallToCreateAccount = async (): Promise<SignUpApiResponse> => {
    try {
      let payload = {};
      let url = API_ENDPOINTS.AUTH.CREATE_ACCOUNT;
      const mobileData = parseMobile(formData.mobileNo);

      payload = {
        email: formData.email || "",
        address: formData.address,
        name: formData.name,
        role: "service_provider",
        mobile: (mobileData && mobileData.mobile) || "",
        phone_country_code: (mobileData && mobileData.countryCode) || "",
      };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if profile picture is still uploading
      if (uploadingPhoto) {
        toast.error("Please wait for profile picture upload to complete");
        setLoading(false);
        return;
      }

      let { data, error } = await apiCallToCreateAccount();

      if (data) {
        // Clear signup sessionStorage
        sessionStorage.removeItem("professional_contact");
        sessionStorage.removeItem("professional_otp");
        sessionStorage.removeItem("professional_password");

        // Clean up preview URL
        if (profilePicturePreview) {
          URL.revokeObjectURL(profilePicturePreview);
        }

        // Redirect to professional onboarding
        router.push(ROUTES.PROFESSIONAL_ONBOARDING_SELECT_PLAN);
      } else {
        if (error) {
          const errorMsg = error.general || error.msg || "Something Went Wrong";
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
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
          04_Add Details
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
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {profilePicturePreview ? (
                    <Image
                      src={profilePicturePreview}
                      alt="Profile preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : formData.profilePicture ? (
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
                {uploadingPhoto && (
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                    Uploading...
                  </Typography>
                )}
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
                  onChange={handleProfilePictureChange}
                  disabled={uploadingPhoto}
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
                    error={false}
                    helperText=""
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
                    error={false}
                    helperText=""
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
                    error={false}
                    helperText=""
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
                    error={false}
                    helperText=""
                    margin="normal"
                    multiline
                    rows={3}
                    sx={{
                      m: 0
                    }}
                  />
                </Box>
              </Box>
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
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
