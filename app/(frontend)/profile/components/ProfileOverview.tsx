"use client";

import React from "react";
import { Card, Box, Typography, Button, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function ProfileOverview() {
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Section - User Summary */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
        }}
      >
        <Avatar
          src="/icons/testimonilas-1.png"
          alt="Bessie Carter"
          sx={{
            width: { xs: 120, sm: 150 },
            height: { xs: 120, sm: 150 },
            border: "4px solid",
            borderColor: "grey.200",
          }}
        />
        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
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
                }}
              >
                Manchester, Kentucky 39495
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                textTransform: "none",
                borderColor: "grey.300",
                color: "text.primary",
                px: 2,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section - Personal Information */}
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
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
                }}
              >
                Full Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
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
                }}
              >
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
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
                }}
              >
                Year of Experience
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
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
                }}
              >
                E-mail id
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
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
                }}
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                4517 Washington Ave. Manchester, Kentucky 39495
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}


