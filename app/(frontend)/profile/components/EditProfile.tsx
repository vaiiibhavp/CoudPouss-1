"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { apiGet, apiPatch } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import CountrySelectDropdown from "@/components/CountrySelectDropdown";
import { defaultCountries, parseCountry } from "react-international-phone";
import { toast } from "sonner";

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

// Helper function to convert dial code to iso2 country code
function dialCodeToIso2(dialCode: string): string {
  if (!dialCode) return "us";
  const cleanDialCode = dialCode.replace("+", "");
  const allCountries = defaultCountries.map((country) => parseCountry(country));
  const country = allCountries.find((c) => c.dialCode === cleanDialCode);
  return country?.iso2 || "us";
}

// Validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full Name is required")
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name must be less than 100 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  countryCode: Yup.string().required("Country code is required"),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d+$/, "Mobile Number must contain only digits")
    .min(10, "Mobile Number must be at least 10 digits")
    .max(15, "Mobile Number must be less than 15 digits"),
  address: Yup.string().max(500, "Address must be less than 500 characters"),
});

interface FormValues {
  fullName: string;
  email: string;
  countryCode: string; // iso2 country code like "in", "us"
  dialCode: string; // dial code like "+91", "+1"
  mobileNumber: string;
  address: string;
}

// Helper function to upload file with FormData
async function uploadProfilePhoto(file: File, email: string): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
  const url = `${API_BASE_URL}userService/auth/upload-profile-photo`;

  // Get access token from Redux
  const storeModule = require("@/lib/redux/store");
  const store = storeModule.store;
  const { accessToken } = store.getState().auth;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);

  const response = await fetch(url, {
    method: "POST",
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues>({
    fullName: "",
    email: "",
    countryCode: "us",
    dialCode: "+1",
    mobileNumber: "",
    address: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await apiGet<GetUserApiResponse>(
          API_ENDPOINTS.AUTH.GET_USER,
        );

        if (response.success && response.data?.data?.user) {
          const user = response.data.data.user;
          setUserData(user);

          const dialCode = user.phone_country_code || "+91";
          const iso2 = dialCodeToIso2(dialCode);

          const initial: FormValues = {
            fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            email: user.email || "",
            countryCode: iso2,
            dialCode: dialCode,
            mobileNumber: user.phone_number || "",
            address: user.address || "",
          };

          setInitialValues(initial);

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

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      // Prepare profile update payload
      const updatePayload = {
        user_data: {
          name: values.fullName.trim(),
          address: values.address.trim(),
          phone_number:values.mobileNumber
        },
      };

      // Update profile
      const updateResponse = await apiPatch(
        API_ENDPOINTS.PROFILE.UPDATE_PROFILE,
        updatePayload,
      );
      console.log('updateResponse',updateResponse);
      

      if (!updateResponse.success) {
        throw new Error(
          updateResponse.error?.message || "Failed to update profile",
        );
      }

      // Upload profile photo if a new file is selected
      if (selectedFile && values.email) {
        setUploadingPhoto(true);
        try {
          await uploadProfilePhoto(selectedFile, values.email);
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
      console.log("Error updating profile:", error);
      // alert(error.message || "Failed to update profile. Please try again.");
      toast.error(
        error.detail || "Failed to update profile. Please try again.",
      );
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

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <>
              {/* Profile Picture Section */}
              <Box
                sx={{
                  p: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0.75rem",
                  alignContent: "center",
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
                    {previewUrl
                      ? null
                      : values.fullName
                        ? values.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
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
                        {uploadingPhoto
                          ? "Uploading..."
                          : "Edit picture or avatar"}
                      </Typography>
                    </label>
                  </Box>
                </Box>
              </Box>

              {/* Personal Information Section */}
              <Box
                sx={{
                  p: "1.5rem",
                  mt: 5,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0.75rem",
                  alignContent: "center",
                  border: "0.0625rem solid #EAF5F4",
                  bgcolor: "#FFFFFF",
                }}
              >
                <Form style={{ width: "100%" }}>
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
                      <Field name="fullName">
                        {({ field, meta }: FieldProps) => {
                          const hasError = meta.touched && !!meta.error;
                          return (
                            <TextField
                              {...field}
                              fullWidth
                              error={hasError}
                              helperText={hasError ? meta.error : ""}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  border: hasError
                                    ? "1px solid #EF5350"
                                    : "1px solid #D5D5D5",
                                  backgroundColor: "#FFFFFF",
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "& input": {
                                    padding: "14px 16px",
                                    fontSize: "1.125rem",
                                    fontWeight: 500,
                                    color: "#131313",
                                  },
                                },
                                "& .MuiFormHelperText-root": {
                                  marginLeft: 0,
                                  fontSize: "0.75rem",
                                  color: hasError ? "#EF5350" : "inherit",
                                },
                              }}
                            />
                          );
                        }}
                      </Field>
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
                      <Field name="email">
                        {({ field, meta }: FieldProps) => {
                          const hasError = meta.touched && !!meta.error;
                          return (
                            <TextField
                              {...field}
                              fullWidth
                              type="email"
                              disabled
                              error={hasError}
                              helperText={hasError ? meta.error : ""}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  border: hasError
                                    ? "1px solid #EF5350"
                                    : "1px solid #D5D5D5",
                                  backgroundColor: "#F5F5F5",
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "& input": {
                                    padding: "14px 16px",
                                    fontSize: "1.125rem",
                                    fontWeight: 500,
                                    color: "#131313",
                                  },
                                },
                                "& .MuiFormHelperText-root": {
                                  marginLeft: 0,
                                  fontSize: "0.75rem",
                                  color: hasError ? "#EF5350" : "inherit",
                                },
                              }}
                            />
                          );
                        }}
                      </Field>
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
                        <Box>
                          <CountrySelectDropdown
                            value={values.countryCode}
                            onChange={(countryCode, dialCode) => {
                              setFieldValue("countryCode", countryCode);
                              setFieldValue("dialCode", `+${dialCode}`);
                            }}
                            error={
                              !!(touched.mobileNumber && errors.mobileNumber)
                            }
                            defaultCountry="in"
                            preferredCountries={["in", "us"]}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Field name="mobileNumber">
                            {({ field, meta }: FieldProps) => {
                              const hasError = meta.touched && !!meta.error;
                              return (
                                <TextField
                                  {...field}
                                  fullWidth
                                  error={hasError}
                                  helperText={hasError ? meta.error : ""}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "12px",
                                      border: hasError
                                        ? "1px solid #EF5350"
                                        : "1px solid #D5D5D5",
                                      backgroundColor: "#FFFFFF",
                                      "& fieldset": {
                                        border: "none",
                                      },
                                      "& input": {
                                        padding: "14px 16px",
                                        fontSize: "1.125rem",
                                        fontWeight: 500,
                                        color: "#131313",
                                      },
                                    },
                                    "& .MuiFormHelperText-root": {
                                      marginLeft: 0,
                                      fontSize: "0.75rem",
                                      color: hasError ? "#EF5350" : "inherit",
                                    },
                                  }}
                                />
                              );
                            }}
                          </Field>
                        </Box>
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
                      <Field name="address">
                        {({ field, meta }: FieldProps) => {
                          const hasError = meta.touched && !!meta.error;
                          return (
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              rows={2}
                              error={hasError}
                              helperText={hasError ? meta.error : ""}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  border: hasError
                                    ? "1px solid #EF5350"
                                    : "1px solid #D5D5D5",
                                  backgroundColor: "#FFFFFF",
                                  "& fieldset": {
                                    border: "none",
                                  },
                                },
                                "& textarea": {
                                  padding: "14px 16px",
                                  fontSize: "1.125rem",
                                  fontWeight: 500,
                                  color: "#131313",
                                },
                                "& .MuiFormHelperText-root": {
                                  marginLeft: 0,
                                  fontSize: "0.75rem",
                                  color: hasError ? "#EF5350" : "inherit",
                                },
                              }}
                            />
                          );
                        }}
                      </Field>
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
                      disabled={isSubmitting}
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
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </Box>
                </Form>
              </Box>
            </>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
