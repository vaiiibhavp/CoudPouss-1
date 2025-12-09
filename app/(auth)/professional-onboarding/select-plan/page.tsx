"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Radio,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

const plans = [
  {
    id: "professional-certified",
    name: "Professional (Certified)",
    subtitle: "Monthly",
    price: "€15.99",
    period: "/month",
    features: [
      "*Billed & recurring monthly cancel anytime",
    ],
  },
  {
    id: "non-certified-provider",
    name: "Non-Certified Provider",
    subtitle: "Monthly",
    price: "€9.99",
    period: "/month",
    features: [
      "*Billed & recurring monthly cancel anytime",
    ],
  },
];

export default function SelectPlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("professional-certified");

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    sessionStorage.setItem("selected_plan", selectedPlan);
    sessionStorage.setItem("selected_plan_details", JSON.stringify(plan));
    router.push(ROUTES.PROFESSIONAL_ONBOARDING_REVIEW_PLAN);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left side - Image Section (same layout as login/signup) */}
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
                  fontWeight: 600,
                  fontSize: `1.5rem`,
                  color: `#424242`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "left"
                }}
              >
                Choose your subscription
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                  textAlign: "left",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  mb: "2.5rem",
                  color: "#939393",
                }}
              >
                Select the plan that fits your activity. You can change it later in your profile.
              </Typography>

              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "19px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  color: "#214C65",
                  mb: "1rem"
                }}
              >
                All Premium Plans
              </Typography>

              {plans.map((plan) => (
                <Paper
                  key={plan.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    paddingTop: "24px",
                    paddingRight: "20px",
                    paddingBottom: "24px",
                    paddingLeft: "20px",
                    border: selectedPlan === plan.id ? "2px solid #2F6B8E" : "1px solid rgba(204, 204, 204, 0.4)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "19px",
                          lineHeight: "20px",
                          letterSpacing: "1%",
                          color: "#214C65",
                        }}
                        gutterBottom
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "18px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#214C65",
                        }}
                        gutterBottom
                      >
                        {plan.subtitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "19px",
                          lineHeight: "20px",
                          letterSpacing: "1%",
                          color: "#214C65",
                          mt: 1
                        }}
                      >
                        {plan.price}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {plan.period}
                        </Typography>
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "11px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                          color: "#2C6587",
                          display: "block",
                          mt: 1
                        }}
                      >
                        {plan.features[0]}
                      </Typography>
                    </Box>
                    <Radio
                      checked={selectedPlan === plan.id}
                      value={plan.id}
                      sx={{
                        color: "#2F6B8E",
                        "&.Mui-checked": {
                          color: "#2F6B8E",
                        },
                      }}
                    />
                  </Box>
                </Paper>
              ))}

              <Divider sx={{ my: 3 }} />

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                All plans come with a 30-day money-back guarantee. You can cancel anytime. No questions asked. By subscribing, you agree to our Terms of Service and Privacy Policy.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="text"
                  size="large"
                  onClick={() => router.push(ROUTES.PROFESSIONAL_DASHBOARD)}
                  sx={{
                    color: "primary.dark",
                    bgcolor: "transparent",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    "&:hover": {
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
                    bgcolor: "primary.dark",
                    color: "white",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderRadius: "8px",
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
