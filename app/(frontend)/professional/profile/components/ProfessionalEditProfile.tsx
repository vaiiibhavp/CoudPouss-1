"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import Image from "next/image";

type ProfessionalEditProfileProps = {
  onCancel?: () => void;
  onSubmit?: (formData: FormState) => void;
};

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

const initialFormState = {
  fullName: "Bessie Cooper",
  email: "michael.mitc@example.com",
  countryCode: "+91",
  mobileNumber: "(480) 555-0103",
  address: "4517 Washington Ave. Manchester, Kentucky 39495",
  yearsOfExperience: 4,
  bio: "Hi, I'm Bessie — with over 6 years of experience in expert TV mounting and reliable plumbing solutions. I specialize in mounting TVs, shelves, mirrors with precision and care",
  specialties:
    "Hi, I'm Bessie — with over 6 years of experience in expert TV mounting and reliable plumbing solutions. I specialize in mounting TVs, shelves, mirrors with precision and care",
  achievements:
    'Bessie Cooper has successfully completed over 150 projects, showcasing her expertise in TV mounting and plumbing. Her dedication to quality and customer satisfaction has earned her numerous accolades, including the "Best Service Provider" award in 2022. Clients consistently praise her attention to detail and professionalism, making her a top choice for home improvement services.',
};

type FormState = typeof initialFormState;

export default function ProfessionalEditProfile({
  onCancel,
  onSubmit,
}: ProfessionalEditProfileProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      yearsOfExperience: Math.max(0, prev.yearsOfExperience + delta),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const renderUploadSlot = (id: string) => (
    <Box
      component="label"
      htmlFor={id}
      sx={{
        position: "relative",
        height: "9rem", // 144px fixed height
        borderRadius: 2,
        border: "0.0625rem dashed #DCDDDD",
        color: "#5E5E5E",
        cursor: "pointer",
        display: "block",
        overflow: "hidden",
        transition: "border-color 150ms ease, background-color 150ms ease",
      }}
    >
      <input id={id} type="file" hidden />
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
    </Box>
  );

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            p: "1.5rem",
            borderRadius: "0.75rem",
            border: "0.0625rem solid #EAF5F4",
            bgcolor: "#FFFFFF",
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
          <Box>
            <Typography
              sx={{ color: "#131313", fontSize: "1.125rem", fontWeight: 600 }}
            >
              Bessie Cooper
            </Typography>
            <Typography
              component="button"
              type="button"
              sx={{
                color: "#2F6B8E",
                fontSize: "0.9rem",
                fontWeight: 400,
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Edit picture or avatar
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          <Box
            sx={{
              p: "1.5rem",
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
                  onChange={(e) => handleChange("email", e.target.value)}
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
                  Mobile Number
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <FormControl
                    sx={{
                      minWidth: 80,

                      ...inputStyles,
                      "& .MuiSelect-select": {
                        padding: "0.625rem 1rem",
                        fontSize: "1rem",
                        fontWeight: 500,
                      },
                      "& .MuiSelect-icon": { color: "#131313" },
                    }}
                  >
                    <Select
                      value={formData.countryCode}
                      onChange={(e) =>
                        handleChange("countryCode", e.target.value)
                      }
                      IconComponent={KeyboardArrowDownIcon}
                    >
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      handleChange("mobileNumber", e.target.value)
                    }
                    sx={inputStyles}
                  />
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
              p: "1.5rem",
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
              p: "1.5rem",
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
              {["past-work-1", "past-work-2"].map((id) => (
                <React.Fragment key={id}>{renderUploadSlot(id)}</React.Fragment>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              type="button"
              onClick={onCancel}
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #214C65",
                borderRadius: "0.75rem",
                color: "#214C65",
                fontSize: "1.1875rem", // 19px
                fontWeight: 700,
                lineHeight: "1.25rem", // 20px
                letterSpacing: "1%",
                padding: "0.625rem 3.75rem", // 10px top/bottom, 60px left/right
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  borderColor: "#214C65",
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
                borderRadius: "0.75rem",
                color: "#FFFFFF",
                fontSize: "1.1875rem", // 19px
                fontWeight: 700,
                lineHeight: "1.25rem", // 20px
                letterSpacing: "1%",
                padding: "0.625rem 3.75rem", // 10px top/bottom, 60px left/right
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
