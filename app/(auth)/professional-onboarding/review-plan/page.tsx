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
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

export default function ReviewPlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const planDetailsStr = sessionStorage.getItem("selected_plan_details");
      if (planDetailsStr) {
        try {
          const parsedPlan = JSON.parse(planDetailsStr);
          setPlan(parsedPlan);
        } catch (error) {
          console.error("Error parsing plan details:", error);
        }
      }
    }
  }, []);

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const formatDuration = (duration: string) => {
    return duration.charAt(0).toUpperCase() + duration.slice(1);
  };

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
                  fontWeight: 500,
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
                  letterSpacing: "0%",
                  mb: "2.5rem",
                  color: "#939393",
                }}
              >
                Subscribe now and enjoy your first month completely free. No payment today – your subscription will start immediately, and you'll be charged only after 30 days.
              </Typography>

              {/* Plan Details */}
              {plan ? (
                <Paper
                  elevation={0}
                  sx={{
                    border: "0.0625rem solid rgba(204, 204, 204, 0.4)",
                    borderRadius: "0.75rem",
                    paddingTop: "1.5rem",
                    paddingRight: "1.25rem",
                    paddingBottom: "1.5rem",
                    paddingLeft: "1.25rem",
                    gap: "0.75rem",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1875rem",
                      lineHeight: "1.25rem",
                      letterSpacing: "1%",
                      color: "#214C65",
                    }}
                    gutterBottom
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.6875rem",
                      lineHeight: "2rem",
                      letterSpacing: "3%",
                      color: "#214C65",
                    }}
                    gutterBottom
                  >
                    {formatPrice(plan.price)}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        fontSize: "1rem",
                        lineHeight: "1.125rem",
                        letterSpacing: "0%",
                        color: "#214C65",
                      }}
                    >
                      /month
                    </Typography>
                  </Typography>

                  {plan.description && (
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        lineHeight: "140%",
                        color: "#939393",
                        mt: 1,
                        mb: 2,
                      }}
                    >
                      {plan.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <List dense disablePadding>
                    {plan.features && plan.features.length > 0 ? (
                      plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <Image
                            src="/icons/verify.png"
                            alt="verify"
                            width={18}
                            height={18}
                            style={{ marginRight: "0.5rem" }}
                          />
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: 500,
                                fontSize: "1rem",
                                lineHeight: "150%",
                                letterSpacing: "0%",
                                color: "#424242",
                              },
                            }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary", fontStyle: "italic" }}>
                        No features listed
                      </Typography>
                    )}
                  </List>
                </Paper>
              ) : (
                <Typography sx={{ mb: 3, color: "text.secondary" }}>
                  No plan selected. Please go back and select a plan.
                </Typography>
              )}

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
                    py: "18px",
                    textTransform: "none",
                    fontSize: "19px",
                    fontWeight: 700,
                    lineHeight: "20px",
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
                  disabled={!plan}
                  sx={{
                    bgcolor: "#214C65",
                    color: "white",
                    py: "18px",
                    textTransform: "none",
                    fontSize: "19px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                    "&:disabled": {
                      bgcolor: "#ccc",
                      color: "#666",
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
