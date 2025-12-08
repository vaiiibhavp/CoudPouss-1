"use client";

import React, { useState } from "react";
import { Card, Box, Typography, Button, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditProfile from "./EditProfile";

export default function ProfileOverview() {
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return <EditProfile onCancel={() => setIsEditMode(false)} />;
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
      {/* Top Section - User Summary */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
          p: "1.5rem",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
        }}
      >
        <Avatar
          src="/icons/testimonilas-1.png"
          alt="Bessie Carter"
          sx={{
            width: "8.125rem",
            height: "8.125rem",
          }}
        />
        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={500}
                sx={{
                  color: "text.primary",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Bessie Carter
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 400,
                }}
              >
                Manchester, Kentucky 39495
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<EditIcon sx={{ color: "#6D6D6D", fontSize: "1rem" }} />}
              onClick={() => setIsEditMode(true)}
              sx={{
                textTransform: "none",
                border: "0.03125rem solid #DFE8ED",
                borderColor: "#DFE8ED",
                color: "#6D6D6D",
                px: "0.75rem",
                py: "0.625rem",
                borderRadius: "6.25rem",
                gap: "0.375rem",
                fontSize: "1rem",
                fontWeight: 400,
                lineHeight: "1.125rem",
                letterSpacing: "0%",
                "&:hover": {
                  borderColor: "#DFE8ED",
                  bgcolor: "transparent",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section - Personal Information */}
      <Box
        sx={{
          p: "1.5rem",
          borderRadius: "0.75rem",
          border: "0.0625rem solid #EAF5F4",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={400}
          sx={{
            color: "primary.main",
            mb: 3,
            fontSize: { xs: "1.25rem", md: "1.5rem" },
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Full Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                Bessie Cooper
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                +11 (480) 555-0103
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Year of Experience
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                4
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                E-mail id
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                michael.mitc@example.com
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 400,
                  fontSize: "1rem",
                }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


