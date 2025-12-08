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
      "Must have required certifications",
    ],
  },
  {
    id: "non-certified-provider",
    name: "Non-Certified Provider",
    subtitle: "Monthly",
    price: "€9.99",
    period: "/month",
    features: [
      "Without required certifications and experience",
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
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
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
                  fontSize: "1rem",
                  textAlign: "left",
                  lineHeight: "140%",
                  mb: "2.5rem",
                  color: "secondary.neutralWhiteDark",
                }}
              >
                Select the plan that best suits you and fits your budget to get started.
              </Typography>

              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.0625rem",
                  lineHeight: "1.25rem",
                  color: "#424242",
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
                    p: 2,
                    border: selectedPlan === plan.id ? "2px solid #2F6B8E" : "1px solid #e0e0e0",
                    borderRadius: 2,
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
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {plan.subtitle}
                      </Typography>
                      <Typography variant="h6" color="#2F6B8E" fontWeight="bold" sx={{ mt: 1 }}>
                        {plan.price}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {plan.period}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
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

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => router.push(ROUTES.PROFESSIONAL_DASHBOARD)}
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
