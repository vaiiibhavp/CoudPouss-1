"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

interface PlansResponse {
  status: string;
  message: string;
  data: {
    professional: Plan[];
    non_professional: Plan[];
  };
}

export default function SelectPlanPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGet<PlansResponse>(API_ENDPOINTS.AUTH.PLANS_ALL);

        if (response.success && response.data) {
          // Combine professional and non_professional plans
          const allPlans = [
            ...(response.data.data.professional || []),
            ...(response.data.data.non_professional || []),
          ];
          setPlans(allPlans);
          
          // Set first plan as default selected
          if (allPlans.length > 0) {
            setSelectedPlan(allPlans[0].id);
          }
        } else {
          setError(response.error?.message || "Failed to fetch plans");
        }
      } catch (err: any) {
        console.error("Error fetching plans:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleContinue = () => {
    if (!selectedPlan) return;
    
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      sessionStorage.setItem("selected_plan", selectedPlan);
      sessionStorage.setItem("selected_plan_details", JSON.stringify(plan));
      router.push(ROUTES.PROFESSIONAL_ONBOARDING_REVIEW_PLAN);
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const formatDuration = (duration: string) => {
    return duration.charAt(0).toUpperCase() + duration.slice(1);
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
                  fontWeight: 700
                }}>
                  CoudPouss
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
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
                  fontWeight: 500,
                  fontSize: "19px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  color: "#214C65",
                  mb: "1rem"
                }}
              >
                All Premium Plans
              </Typography>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              )}

              {!loading && !error && plans.length === 0 && (
                <Typography sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}>
                  No plans available
                </Typography>
              )}

              {!loading && plans.map((plan) => (
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
                          fontWeight: 700,
                          fontSize: "19px",
                          lineHeight: "20px",
                          letterSpacing: "1%",
                          color: "#214C65",
                          mb:"19px"
                        }}
                       >
                        {plan.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "18px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#214C65",
                          mb:"8px"
                        }}
                      >
                        {formatDuration(plan.duration)}
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
                        {formatPrice(plan.price)}
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "20px",
                            letterSpacing: "0%",
                            color: "#214C65",
                            ml: 0.5
                          }}
                        >
                          /month
                        </Typography>
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#214C65",
                          display: "block",
                          mt: 1
                        }}
                      >
                        *Billed & recurring monthly cancel anytime
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

    

              <Typography variant="caption"  sx={{ display: "block", fontWeight:400 , fontSize:"11px",lineHeight:"16px", color:"#2C6587" }}>
              Your membership starts as soon as you set up payment and subscribe. Your monthly charge will occur on the last day of the current billing period. We’ll renew your membership for you can manage your subscription or turn off auto-renewal under accounts setting.
              </Typography>

              <Typography variant="caption"  sx={{ display: "block", fontWeight:400 , fontSize:"11px",lineHeight:"16px", color:"#2C6587" }}>
              By continuing, you are agreeing to these terms. See the privacy statement and restricions.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column"}}>
                <Button
                  fullWidth
                  variant="text"
                  size="large"
                  onClick={() => router.push(ROUTES.PROFESSIONAL_DASHBOARD)}
                  sx={{
                    color: "primary.dark",
                    bgcolor: "transparent",
                    py: "20px",
                    fontWeight:600,
                    fontSize:"14px",
                    textTransform: "none",
                    borderRadius: "8px",
                    lineHeight:"16px",
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
                  disabled={!selectedPlan || loading}
                  sx={{
                    bgcolor: "#214C65",
                    color: "white",
                    py: "18px",
                    fontWeight:700,
                    lineHeight:"20px",
                    textTransform: "none",
                    fontSize: "19px",
                    borderRadius: "8px",
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
