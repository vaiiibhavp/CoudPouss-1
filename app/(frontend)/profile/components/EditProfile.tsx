"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { apiGet, apiPatch } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
  };
}

interface EditProfileProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

// Helper function to upload file with FormData
async function uploadProfilePhoto(file: File, email: string): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  const url = `${API_BASE_URL}userService/auth/upload-profile-photo`;
  
  // Get access token from Redux
  const storeModule = require('@/lib/redux/store');
  const store = storeModule.store;
  const { accessToken } = store.getState().auth;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data?.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
}

export default function EditProfile({ onCancel, onSuccess }: EditProfileProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    mobileNumber: "",
    address: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await apiGet<GetUserApiResponse>(API_ENDPOINTS.AUTH.GET_USER);
        
        if (response.success && response.data?.data?.user) {
          const user = response.data.data.user;
          setUserData(user);
          setFormData({
            fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            email: user.email || "",
            countryCode: user.phone_country_code || "+91",
            mobileNumber: user.phone_number || "",
            address: user.address || "",
          });
          if (user.profile_photo_url) {
            setPreviewUrl(user.profile_photo_url);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Prepare profile update payload
      const updatePayload = {
        user_data: {
          name: formData.fullName.trim(),
          address: formData.address.trim(),
        },
      };
      
      // Update profile
      const updateResponse = await apiPatch(API_ENDPOINTS.PROFILE.UPDATE_PROFILE, updatePayload);
      
      if (!updateResponse.success) {
        throw new Error(updateResponse.error?.message || "Failed to update profile");
      }
      
      // Upload profile photo if a new file is selected
      if (selectedFile && formData.email) {
        setUploadingPhoto(true);
        try {
          await uploadProfilePhoto(selectedFile, formData.email);
        } catch (photoError) {
          console.error("Error uploading profile photo:", photoError);
          // Don't throw - profile update succeeded, photo upload failed
        } finally {
          setUploadingPhoto(false);
        }
      }
      
      // Call success callback to refresh data
      onSuccess?.();
      onCancel?.();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
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
        gap: "1.5rem",
      }}
    >
      {/* Edit Profile Container */}
      <Box
        sx={{
          p: "1.5rem",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            color: "#2F6B8E",
            fontSize: "1.25rem",
            fontWeight: 600,
            mb: 3,
          }}
        >
          Edit Profile
        </Typography>

        {/* Profile Picture Section */}
        <Box
          sx={{
            p: "1.5rem",
            display:"flex",
            alignItems:"center",
            borderRadius: "0.75rem",
            alignContent:"center",
            border: "0.0625rem solid #EAF5F4",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              gap: 1,
            }}
          >
            <Avatar
              src={previewUrl || undefined}
              sx={{
                width: "5rem",
                height: "5rem",
                bgcolor: "#E0E0E0",
                color: "#616161",
                fontSize: "1.5rem",
                fontWeight: 500,
              }}
            >
              {previewUrl ? null : (
                formData.fullName
                  ? formData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"
              )}
            </Avatar>
            <Box sx={{
                display:"flex",
                alignItems:"center",
            }} >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-photo-upload"
                type="file"
                onChange={handleFileChange}
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
                  {uploadingPhoto ? "Uploading..." : "Edit picture or avatar"}
                </Typography>
              </label>
            </Box>
          </Box>
        </Box>

        {/* Personal Information Section */}
        <Box
          sx={{
            p: "1.5rem",
            mt:5,
            display:"flex",
            alignItems:"center",
            borderRadius: "0.75rem",
            alignContent:"center",
            border: "0.0625rem solid #EAF5F4",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{width:"100%"}} component="form" onSubmit={handleSubmit}>
            <Typography
              sx={{
                color: "#2C6587",
                fontSize: "1.125rem",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Personal Information
            </Typography>

            <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Full Name */}
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.06rem",
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      border: "0.0625rem solid #DCDDDD",
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        border: "none",
                      },
                      "& input": {
                        padding: "0.625rem 1rem",
                        fontSize: "1.125rem",
                        fontWeight: 500,
                        color: "#131313",
                      },
                    },
                  }}
                />
              </Box>

              {/* E-mail id */}
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.06rem",
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
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      border: "0.0625rem solid #DCDDDD",
                      backgroundColor: "#F5F5F5",
                      "& fieldset": {
                        border: "none",
                      },
                      "& input": {
                        padding: "0.625rem 1rem",
                        fontSize: "1.125rem",
                        fontWeight: 500,
                        color: "#131313",
                      },
                    },
                  }}
                />
              </Box>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Mobile Number */}
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.06rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Mobile Number
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormControl
                    sx={{
                      minWidth: 100,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.25rem",
                        border: "0.0625rem solid #DCDDDD",
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          border: "none",
                        },
                        "& .MuiSelect-select": {
                          padding: "0.625rem 1rem",
                          fontSize: "1.125rem",
                          fontWeight: 500,
                          color: "#131313",
                        },
                      },
                    }}
                  >
                    <Select
                      value={formData.countryCode || ""}
                      onChange={(e) => handleChange("countryCode", e.target.value)}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      renderValue={(selected) => {
                        if (!selected || selected === "") {
                          return <Typography sx={{ color: "#858686" }}>+...</Typography>;
                        }
                        return selected;
                      }}
                      sx={{
                        "& .MuiSelect-icon": {
                          color: "#131313",
                          fontSize: "1.125rem",
                        },
                      }}
                    >
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                      <MenuItem value="+33">+33</MenuItem>
                      <MenuItem value="+49">+49</MenuItem>
                      <MenuItem value="+86">+86</MenuItem>
                      <MenuItem value="+81">+81</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.25rem",
                        border: "0.0625rem solid #DCDDDD",
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          border: "none",
                        },
                        "& input": {
                          padding: "0.625rem 1rem",
                          fontSize: "1.125rem",
                          fontWeight: 500,
                          color: "#131313",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Address */}
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.06rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Address
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      border: "0.0625rem solid #DCDDDD",
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& textarea": {
                      padding: "0.625rem 1rem",
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#131313",
                    },
                  }}
                />
              </Box>
            </div>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                type="button"
                onClick={handleCancel}
                sx={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #214C65",
                  borderRadius: "0.75rem",
                  color: "#214C65",
                  fontSize: "1.187rem",
                  fontWeight: 700,
                  padding: "0.625rem 3.75rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCDDDD",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploadingPhoto}
                sx={{
                  backgroundColor: "#214C65",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#FFFFFF",
                  fontSize: "1.187rem",
                  fontWeight: 700,
                  padding: "0.625rem 3.75rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#2F6B8E",
                  },
                  "&:disabled": {
                    backgroundColor: "#CCCCCC",
                    color: "#666666",
                  },
                }}
              >
                {submitting || uploadingPhoto ? "Updating..." : "Update"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

