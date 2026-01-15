"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Image from "next/image";
import { apiGet, apiPatch, apiPostFormData } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import CountrySelectDropdown from "@/components/CountrySelectDropdown";
import { defaultCountries, parseCountry } from "react-international-phone";
import { toast } from "sonner";

type ProfessionalEditProfileProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

interface UserData {
  id: string;
  email: string;
  phone_number: string;
  address: string;
  first_name: string;
  phone_country_code: string;
  last_name: string;
  profile_photo_url: string | null;
}

interface ProviderInfo {
  id: string;
  services_provider_id: string;
  bio?: string;
  experience_speciality?: string;
  achievements?: string;
  years_of_experience?: number;
  is_docs_verified: boolean;
  docs_status: string;
  [key: string]: any;
}

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
    provider_info?: ProviderInfo;
    past_work_files?: string[];
  };
}

interface PastWorkImage {
  id: string;
  file: File | null;
  preview: string | null;
  existingUrl?: string;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    border: "1px solid #D5D5D5",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      border: "none",
    },
    "& input, & textarea": {
      padding: "0.875rem 1rem",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#131313",
      lineHeight: "1.25rem",
    },
    "& textarea": {
      fontSize: "1.125rem",
      lineHeight: "1",
      fontWeight: 500,
      color: "#424242",
    },
  },
};

// Helper function to convert dial code to iso2 country code
function dialCodeToIso2(dialCode: string): string {
  if (!dialCode) return "us";
  const cleanDialCode = dialCode.replace("+", "");
  const allCountries = defaultCountries.map((country) => parseCountry(country));
  const country = allCountries.find((c) => c.dialCode === cleanDialCode);
  return country?.iso2 || "us";
}

export default function ProfessionalEditProfile({
  onCancel,
  onSuccess,
}: ProfessionalEditProfileProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [pastWorkImages, setPastWorkImages] = useState<PastWorkImage[]>([]);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "in", // iso2 country code like "in", "us"
    dialCode: "+91", // dial code like "+91", "+1"
    mobileNumber: "",
    address: "",
    yearsOfExperience: 0,
    bio: "",
    specialties: "",
    achievements: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await apiGet<GetUserApiResponse>(API_ENDPOINTS.AUTH.GET_USER);
        
        if (response.success && response.data) {
          const apiData = response.data;
          if (apiData.data?.user) {
            const user = apiData.data.user;
            setUserData(user);
            
            // Set provider info if available
            if (apiData.data.provider_info) {
              setProviderInfo(apiData.data.provider_info);
            }
            
            // Initialize form data
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
            const dialCode = user.phone_country_code || "+91";
            const iso2 = dialCodeToIso2(dialCode);
            
            setFormData({
              fullName,
              email: user.email || "",
              countryCode: iso2,
              dialCode: dialCode,
              mobileNumber: user.phone_number || "",
              address: user.address || "",
              yearsOfExperience: apiData.data.provider_info?.years_of_experience || 0,
              bio: apiData.data.provider_info?.bio || "",
              specialties: apiData.data.provider_info?.experience_speciality || "",
              achievements: apiData.data.provider_info?.achievements || "",
            });

            // Set profile photo preview
            if (user.profile_photo_url) {
              setProfilePhotoPreview(user.profile_photo_url);
            }

            // Initialize past work images
            if (apiData.data.past_work_files && Array.isArray(apiData.data.past_work_files)) {
              const images: PastWorkImage[] = apiData.data.past_work_files.map((url, index) => ({
                id: `existing-${index}`,
                file: null,
                preview: null,
                existingUrl: url,
              }));
              // Add empty slots if less than 2
              while (images.length < 2) {
                images.push({
                  id: `new-${images.length}`,
                  file: null,
                  preview: null,
                });
              }
              setPastWorkImages(images);
            } else {
              // Initialize with 2 empty slots
              setPastWorkImages([
                { id: "new-0", file: null, preview: null },
                { id: "new-1", file: null, preview: null },
              ]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      yearsOfExperience: Math.max(0, prev.yearsOfExperience + delta),
    }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePastWorkImageChange = (id: string, file: File | null) => {
    setPastWorkImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const preview = file ? URL.createObjectURL(file) : null;
          return { ...img, file, preview };
        }
        return img;
      })
    );
  };

  const uploadProfilePhoto = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    if (userData?.email) {
      formData.append("email", userData.email);
    }

    const response = await apiPostFormData(API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PIC, formData);
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to upload profile photo");
    }
    return response;
  };

  const uploadPastWorkFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("past_work_photos", file);
    });

    const response = await apiPostFormData(API_ENDPOINTS.PROFILE.UPLOAD_FILES, formData);
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to upload past work images");
    }
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare profile update payload
      const updatePayload = {
        user_data: {
          name: formData.fullName.trim(),
          address: formData.address.trim(),
          phone_number: formData.mobileNumber.trim(),
          phone_country_code: formData.dialCode,
        },
        provider_data: {
          bio: formData.bio.trim(),
          experience_speciality: formData.specialties.trim(),
          achievements: formData.achievements.trim(),
          years_of_experience: formData.yearsOfExperience,
        },
      };

      // Update profile
      const updateResponse = await apiPatch(API_ENDPOINTS.PROFILE.UPDATE_PROFILE, updatePayload);

      if (!updateResponse.success) {
        throw new Error(updateResponse.error?.message || "Failed to update profile");
      }

      // Upload profile photo if a new file is selected
      if (profilePhotoFile) {
        try {
          await uploadProfilePhoto(profilePhotoFile);
        } catch (photoError) {
          console.error("Error uploading profile photo:", photoError);
          // Don't throw - profile update succeeded, photo upload failed
        }
      }

      // Upload past work images
      const filesToUpload = pastWorkImages
        .map((img) => img.file)
        .filter((file): file is File => file !== null);

      if (filesToUpload.length > 0) {
        try {
          await uploadPastWorkFiles(filesToUpload);
        } catch (uploadError) {
          console.error("Error uploading past work images:", uploadError);
          // Don't throw - profile update succeeded, upload failed
        }
      }

      // Show success toast
      toast.success("Profile updated successfully");

      // Call success callback to refresh data
      onSuccess?.();
      onCancel?.();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadSlot = (image: PastWorkImage) => {
    const hasImage = image.preview || image.existingUrl;

    return (
      <Box
        component="label"
        htmlFor={image.id}
        sx={{
          position: "relative",
          height: "9rem",
          borderRadius: 2,
          border: "0.0625rem dashed #DCDDDD",
          color: "#5E5E5E",
          cursor: "pointer",
          display: "block",
          overflow: "hidden",
          transition: "border-color 150ms ease, background-color 150ms ease",
          "&:hover": {
            borderColor: "#2C6587",
          },
        }}
      >
        <input
          id={image.id}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handlePastWorkImageChange(image.id, file);
          }}
        />
        {hasImage ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={image.preview || image.existingUrl || ""}
              alt="Past work"
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              textAlign: "center",
              px: 2,
            }}
          >
            <Image
              src="/icons/folder-upload-line.png"
              alt="Upload"
              width={24}
              height={24}
              style={{ objectFit: "contain" }}
              priority
            />
            <Typography sx={{ color: "#818285", fontSize: "0.875rem", lineHeight: "1.5rem" }}>
              upload from device
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const getInitials = () => {
    if (formData.fullName) {
      return formData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          mb: "1.75rem",
          fontWeight: 700,
          fontSize: "1.25rem",
          lineHeight: "1.5rem",
          color: "#2C6587",
        }}
      >
        Edit Profile
      </Typography>
      <Box
        sx={{
          borderRadius: "0.75rem",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            p: "1.5rem",
            display: "flex",
            alignItems: "center",
            borderRadius: "0.75rem",
            border: "0.0625rem solid #EAF5F4",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              src={profilePhotoPreview || undefined}
              sx={{
                width: "5rem",
                height: "5rem",
                bgcolor: "#E0E0E0",
                color: "#616161",
                fontSize: "1.5rem",
                fontWeight: 500,
              }}
            >
              {!profilePhotoPreview ? getInitials() : null}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-photo-upload"
                type="file"
                onChange={handleProfilePhotoChange}
              />
              <label htmlFor="profile-photo-upload">
                <Typography
                  component="span"
                  sx={{
                    color: "#2F6B8E",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Edit picture or avatar
                </Typography>
              </label>
            </Box>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          <Box
            sx={{
              p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              borderRadius: "0.75rem",
              border: "0.0625rem solid #EAF5F4",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                color: "#2C6587",
                fontSize: "1.125rem",
                fontWeight: 500,
                lineHeight: "1.5rem",
                mb: 2,
              }}
            >
              Personal Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  E-mail id
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  disabled
                  sx={{
                    ...inputStyles,
                    "& .MuiOutlinedInput-root": {
                      ...inputStyles["& .MuiOutlinedInput-root"],
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Mobile Number
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Box>
                    <CountrySelectDropdown
                      value={formData.countryCode}
                      onChange={(countryCode, dialCode) => {
                        handleChange("countryCode", countryCode);
                        handleChange("dialCode", `+${dialCode}`);
                      }}
                      error={false}
                      defaultCountry="in"
                      preferredCountries={["in", "us"]}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      value={formData.mobileNumber}
                      onChange={(e) => handleChange("mobileNumber", e.target.value)}
                      sx={inputStyles}
                    />
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Address
                </Typography>
                <TextField
                  fullWidth
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Year of Experience
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #D5D5D5",
                    borderRadius: "0.75rem",
                    backgroundColor: "#FFFFFF",
                    width: "fit-content",
                    padding: "0.375rem 0.5rem",
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleExperienceChange(-1)}
                    sx={{ color: "#2F6B8E" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 600, color: "#131313" }}>
                    {formData.yearsOfExperience}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleExperienceChange(1)}
                    sx={{ color: "#2F6B8E" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              borderRadius: "0.75rem",
              border: "0.0625rem solid #EAF5F4",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <Typography
              sx={{
                color: "#2C6587",
                fontSize: "1.125rem",
                fontWeight: 500,
                lineHeight: "1.5rem",
              }}
            >
              Public profile Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Bio
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Experience & Specialties
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.specialties}
                  onChange={(e) => handleChange("specialties", e.target.value)}
                  sx={inputStyles}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Achievements
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.achievements}
                  onChange={(e) => handleChange("achievements", e.target.value)}
                  sx={inputStyles}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              borderRadius: "0.75rem",
              border: "0.0625rem solid #EAF5F4",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#2C6587",
                fontSize: "1.125rem",
                fontWeight: 500,
                lineHeight: "1.5rem",
              }}
            >
              Images of Past Works
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                },
                gap: "1.125rem",
              }}
            >
              {pastWorkImages.map((image) => (
                <React.Fragment key={image.id}>{renderUploadSlot(image)}</React.Fragment>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #214C65",
                borderRadius: "0.75rem",
                color: "#214C65",
                fontSize: { xs: "1rem", md: "1.1875rem" },
                fontWeight: 700,
                lineHeight: "1.25rem",
                letterSpacing: "1%",
                padding: { xs: "0.875rem 2rem", md: "0.625rem 3.75rem" },
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  borderColor: "#214C65",
                },
                "&:disabled": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#D5D5D5",
                  color: "#999999",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              sx={{
                backgroundColor: "#2F6B8E",
                border: "none",
                borderRadius: "0.75rem",
                color: "#FFFFFF",
                fontSize: { xs: "1rem", md: "1.1875rem" },
                fontWeight: 700,
                lineHeight: "1.25rem",
                letterSpacing: "1%",
                padding: { xs: "0.875rem 2rem", md: "0.625rem 3.75rem" },
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#2F6B8E",
                },
                "&:disabled": {
                  backgroundColor: "#CCCCCC",
                  color: "#666666",
                },
              }}
            >
              {submitting ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
