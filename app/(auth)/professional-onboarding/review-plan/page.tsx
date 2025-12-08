"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function ReviewPlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState({
    name: "Professional (Certified)",
    price: "€15.99",
    period: "/month",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const planDetailsStr = sessionStorage.getItem("selected_plan_details");
      if (planDetailsStr) {
        setPlan(JSON.parse(planDetailsStr));
      }
    }
  }, []);

  const features = [
    "Can charge through CoudPouss (even after 30 days)",
    "Unlimited leads",
    "Unlimited 1-on-1 contact, 24/7 service support",
    "Includes 5 service categories, +€3 per extra category",
    "Subscription billed on a 30-day cycle, Pay on Completion",
    "Profile Unlimited within 72 hours for all Assistances",
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSubscribe = () => {
    router.push(ROUTES.PROFESSIONAL_ONBOARDING_PAYMENT_MODE);
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
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "left"
                }}
              >
                Start Your Journey Today - First Month on Us!
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  textAlign: "left",
                  lineHeight: "140%",
                  mb: "2.5rem",
                  color: "secondary.neutralWhiteDark",
                }}
              >
                Find new clients and grow your business with CoudPouss. We're offering you a full month completely free to get started!
              </Typography>

              {/* Plan Details */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  bgcolor: "#f9fafb",
                }}
              >
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="#2F6B8E" fontWeight="bold" gutterBottom>
                  {plan.price}
                  <Typography component="span" variant="body1" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Typography>

                <Divider sx={{ my: 2 }} />

                <List dense disablePadding>
                  {features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: "#2F6B8E", mr: 1 }} />
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  sx={{
                    borderColor: "primary.dark",
                    color: "primary.dark",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#25608A",
                      bgcolor: "rgba(47, 107, 142, 0.04)",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubscribe}
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
