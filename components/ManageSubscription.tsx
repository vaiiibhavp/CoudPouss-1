"use client";

import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ManageSubscription() {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "white",
        borderRadius: 2,
        border: "0.0625rem solid #E5E7EB",
        boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
        width: "100%",
        minHeight: "calc(100vh - 18.75rem)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#2F6B8E", mb: 3 }}
      >
        Active Plan
      </Typography>

      {/* Important Notice */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2.5,
          mb: 4,
          bgcolor: "#FEF3C7",
          border: "0.0625rem solid #FCD34D",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <Image
            src="/icons/important-active-plan.png"
            alt="Important"
            width={48}
            height={48}
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Box>
          <Typography
            variant="body1"
            fontWeight="700"
            sx={{ color: "#1F2937", mb: 0.5 }}
          >
            IMPORTANT:
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#374151", mb: 0.5, lineHeight: 1.6 }}
          >
            Your plan will end on September 1, 2024 at 12:00 AM
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6B7280", lineHeight: 1.6 }}
          >
            After that, you will be automatically billed €15.99
          </Typography>
        </Box>
      </Box>

      {/* Summary Section */}
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#1F2937", mb: 3 }}
      >
        Summary
      </Typography>

      {/* Plan Details */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: "#1F2937", mb: 1 }}
          >
            Professional (Certified)
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "#2F6B8E" }}
            >
              €15.99
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#6B7280" }}
            >
              Monthly
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", mb: 0.5, fontSize: "0.875rem" }}
            >
              Next Payment
            </Typography>
            <Typography
              variant="body1"
              fontWeight="500"
              sx={{ color: "#1F2937" }}
            >
              September 1, 2024
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", mb: 0.5, fontSize: "0.875rem" }}
            >
              Payment Method
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 20,
                  bgcolor: "#FF5F00",
                  borderRadius: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#EB001B",
                    position: "absolute",
                    left: 4,
                  }}
                />
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#F79E1B",
                    position: "absolute",
                    right: 4,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{ color: "#1F2937" }}
              >
                Credit Card
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", mb: 0.5, fontSize: "0.875rem" }}
            >
              Total
            </Typography>
            <Typography
              variant="body1"
              fontWeight="600"
              sx={{ color: "#1F2937" }}
            >
              €15.99
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Renew Plan Button */}
      <Button
        variant="contained"
        sx={{
          bgcolor: "#2F6B8E",
          color: "white",
          textTransform: "none",
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "500",
          borderRadius: 2,
          mb: 3,
          "&:hover": {
            bgcolor: "#1e4a5f",
          },
        }}
      >
        Renew Plan
      </Button>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{ color: "#6B7280", mb: 4, lineHeight: 1.6 }}
      >
        Enjoy exclusive benefits with your Premium Membership. From enhanced
        features to priority support, this plan unlocks the full experience
        tailored just for you.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Benefits Section */}
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#1F2937", mb: 3 }}
      >
        Benefits
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          "Earn money through CoudPouss (secure escrow payments)",
          "Certified Badge visible to all clients",
          "Includes 1 service category, +€1 per extra category",
          "Subscription billed via Bank Card, Google Pay, or Apple Pay",
          "Profile reviewed within 72 hours by an administrator",
        ].map((benefit, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
          >
            <CheckCircleIcon
              sx={{
                color: "#2F6B8E",
                fontSize: "1.25rem",
                mt: 0.2,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body1"
              sx={{ color: "#374151", lineHeight: 1.6 }}
            >
              {benefit}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
