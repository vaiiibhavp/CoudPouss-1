"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface EditProfileProps {
  onCancel?: () => void;
}

export default function EditProfile({ onCancel }: EditProfileProps) {
  const [formData, setFormData] = useState({
    fullName: "Bessie Cooper",
    email: "michael.mitc@example.com",
    countryCode: "+91",
    mobileNumber: "(480) 555-0103",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // After successful submission, you can call onCancel to go back
    // onCancel?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

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
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: "5rem",
              height: "5rem",
              bgcolor: "#E0E0E0",
              color: "#616161",
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
          >
            BC
          </Avatar>
          <Typography
            component="button"
            type="button"
            sx={{
              color: "#2F6B8E",
              fontSize: "0.875rem",
              fontWeight: 400,
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Edit picture or avatar
          </Typography>
        </Box>

        {/* Personal Information Section */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            sx={{
              color: "#2F6B8E",
              fontSize: "1rem",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Personal Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mb: 4,
            }}
          >
            {/* Full Name */}
            <Box>
              <Typography
                sx={{
                  color: "#545454",
                  fontSize: "0.875rem",
                  fontWeight: 400,
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
                      fontSize: "1rem",
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
                  color: "#545454",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  mb: 0.5,
                }}
              >
                E-mail id
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
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
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#131313",
                    },
                  },
                }}
              />
            </Box>

            {/* Mobile Number */}
            <Box>
              <Typography
                sx={{
                  color: "#545454",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  mb: 0.5,
                }}
              >
                Mobile Number
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl
                  sx={{
                    minWidth: 80,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      border: "0.0625rem solid #DCDDDD",
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        padding: "0.625rem 1rem",
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#131313",
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.countryCode}
                    onChange={(e) => handleChange("countryCode", e.target.value)}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      "& .MuiSelect-icon": {
                        color: "#131313",
                      },
                    }}
                  >
                    <MenuItem value="+91">+91</MenuItem>
                    <MenuItem value="+1">+1</MenuItem>
                    <MenuItem value="+44">+44</MenuItem>
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
                        fontSize: "1rem",
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
                  color: "#545454",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  mb: 0.5,
                }}
              >
                Address
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
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
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#131313",
                  },
                }}
              />
            </Box>
          </Box>

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
                border: "0.0625rem solid #DCDDDD",
                borderRadius: "0.25rem",
                color: "#818285",
                fontSize: "1rem",
                fontWeight: 500,
                padding: "0.625rem 1.25rem",
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
              sx={{
                backgroundColor: "#2F6B8E",
                border: "none",
                borderRadius: "0.25rem",
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 500,
                padding: "0.625rem 1.25rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#2F6B8E",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

