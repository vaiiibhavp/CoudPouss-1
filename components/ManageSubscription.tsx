"use client";

import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ManageSubscription() {
  return (
    <Box
      sx={{
        p: { xs: "1.25rem 1rem", sm: "1.25rem 1.5rem", md: "1.25rem 1.5rem" }, // 20px top/bottom, 24px left/right
        bgcolor: "#FFFFFF",
        borderRadius: "0.75rem", // 12px
        border: "1px solid #DBE0E5",
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
        display: "flex",
        flexDirection: "column",
        gap: "1.375rem", // 22px
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.1875rem", // 19px
          lineHeight: "1.25rem", // 20px
          letterSpacing: "1%",
          verticalAlign: "middle",
          color: "#323232",
        }}
      >
        Active Plan
      </Typography>

      {/* Important Notice */}
      <Box
        sx={{
          display: "flex",
          gap: "2rem", // 32px
          p: {
            xs: "1.5rem 1.25rem",
            sm: "1.875rem 2rem",
            md: "1.875rem 2.5rem",
          }, // 30px top/bottom, 40px left/right
          bgcolor: "rgba(247, 159, 27, 0.18)", // #F79F1B with 18% opacity
          border: "1px solid #F79F1B",
          borderRadius: "0.625rem", // 10px
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
      <Box
        sx={{
          borderRadius: "0.75rem", // 12px
          border: "1px solid rgba(219, 224, 229, 0.4)", // #DBE0E5 with 40% opacity
          padding: "1.5rem", // 24px
          gap: "1.75rem", // 28px
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Summary Section */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.1875rem", // 19px
            lineHeight: "1.25rem", // 20px
            letterSpacing: "1%",
            verticalAlign: "middle",
            color: "#323232",
          }}
        >
          Summary
        </Typography>

        {/* Plan Details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-start" },
            mb: 3,
            gap: { xs: 2, md: "20px" },
          }}
        >
          <Box
            sx={{
              borderRadius: "0.75rem", // 12px
              border: "1px solid rgba(219, 224, 229, 0.4)", // #DBE0E5 with 40% opacity
              padding: " 1.188rem  1.5rem", // 24px
              gap: "1.188rem", // 28px
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", md: "100%" },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1875rem", // 19px
                lineHeight: "1.25rem", // 20px
                letterSpacing: "1%",
                verticalAlign: "middle",
                color: "#323232",
              }}
            >
              Professional (Certified)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography

                sx={{ color: "#214C65",fontWeight:800, fontSize:"1.688rem",lineHeight:"2rem" }}
              >
                €15.99
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1rem", // 16px
                  lineHeight: "1.125rem", // 18px
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#214C65",
                }}
              >
                Monthly
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: "0.75rem", // 12px
              border: "1px solid rgba(219, 224, 229, 0.4)", // #DBE0E5 with 40% opacity
              px: "1.5rem", // 24px
              py:"1.625rem",
              gap: "1.75rem", // 28px
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "flex-start" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1.125rem", // 18px
                  letterSpacing: "0%",
                  color: "#555555",
                  mb: "1rem",
                  textWrap: "nowrap",
                }}
              >
                Next Payment
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  color: "#0F232F",
                  textWrap: "nowrap",
                }}
              >
                September 1, 2024
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1.125rem", // 18px
                  letterSpacing: "0%",
                  color: "#555555",
                  mb: "1rem",
                  textWrap: "nowrap",
                }}
              >
                Payment Method
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 20,
                    borderRadius: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Image
                  
                  alt="masterCard"
                  width={36}
                  height={22}
                  src="/icons/masterCard.png"
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem", // 14px
                    lineHeight: "1rem", // 16px
                    letterSpacing: "0%",
                    color: "#0F232F",
                    textWrap: "nowrap",
                  }}
                >
                  Credit Card
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1.125rem", // 18px
                  letterSpacing: "0%",
                  color: "#555555",
                  mb: "1rem",
                  textWrap: "nowrap",
                }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem", // 14px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  color: "#0F232F",
                  textWrap: "nowrap",
                }}
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
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: "500",
            borderRadius: 2,
            mb: 3,
            width: "fit-content",
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
    </Box>
  );
}
