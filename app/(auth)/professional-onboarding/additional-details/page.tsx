"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function AdditionalDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    experience: "",
    idCopy: null as File | null,
    kbisExtract: null as File | null,
    proofOfResidence: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSkip = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleContinue = () => {
    // Save additional details
    sessionStorage.setItem("additional_details", JSON.stringify(formData));
    router.push(ROUTES.PROFESSIONAL_ONBOARDING_SELECT_CATEGORY);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
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
              objectFit: "cover",
              objectPosition: "top",
            }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          overflowY: "auto",
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
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"
              }} >
                <Image
                  alt='logo'
                  width={80}
                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "left"
                }}
              >
                Additional Details
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  textAlign: "left",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  mb: "2.5rem",
                  color: "#939393",
                }}
              >
                Upload the required documents to complete your profile and gain the Certified badge.
              </Typography>

              {/* Years of Experience */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
                  mb: "0.5rem"
                }}
              >
                Years of Experience
              </Typography>
              <TextField
                fullWidth
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              {/* A copy of ID */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
                  mb: "0.5rem"
                }}
              >
                A copy of ID
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  mb: 3,
                }}
                onClick={() => document.getElementById("id-upload")?.click()}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.idCopy ? formData.idCopy.name : "Upload from device"}
                  </Typography>
                </Box>
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, "idCopy")}
                />
              </Paper>

              {/* Kbis Extract */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
                  mb: "0.5rem"
                }}
              >
                Kbis Extract
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  mb: 3,
                }}
                onClick={() => document.getElementById("kbis-upload")?.click()}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.kbisExtract ? formData.kbisExtract.name : "Upload from device"}
                  </Typography>
                </Box>
                <input
                  id="kbis-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, "kbisExtract")}
                />
              </Paper>

              {/* Proof of residence */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
                  mb: "0.5rem"
                }}
              >
                Proof of residence
              </Typography>
              <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
                *less than 3 months old (e.g., water or electricity bill)
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  mb: 3,
                }}
                onClick={() => document.getElementById("residence-upload")?.click()}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.proofOfResidence ? formData.proofOfResidence.name : "Upload from device"}
                  </Typography>
                </Box>
                <input
                  id="residence-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, "proofOfResidence")}
                />
              </Paper>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleSkip}
                  sx={{
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid #214C65",
                    borderColor: "#214C65",
                    padding: "1.125rem 3.75rem",
                    gap: "0.625rem",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1.1875rem",
                    lineHeight: "1.25rem",
                    letterSpacing: "1%",
                    color: "#214C65",
                    "&:hover": {
                      borderColor: "#214C65",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Skip
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleContinue}
                  sx={{
                    borderRadius: "0.75rem",
                    bgcolor: "#214C65",
                    padding: "1.125rem 3.75rem",
                    gap: "0.625rem",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1.1875rem",
                    lineHeight: "1.25rem",
                    letterSpacing: "1%",
                    color: "#FFFFFF",
                    "&:hover": {
                      bgcolor: "#214C65",
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
