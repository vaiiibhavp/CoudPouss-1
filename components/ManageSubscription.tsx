"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface UserData {
  service_provider_type: string;
}

interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
  };
}

interface PlanData {
  id?: string;
  name?: string;
  type?: string;
  price?: number | string; // Allow both number and string (JSON may parse as string)
  duration?: string;
  description?: string;
  features?: string[];
  // Optional subscription-specific fields (may come from a different endpoint)
  plan_end_date?: string;
  next_payment_date?: string;
  payment_method?: string;
}

interface PlansApiResponse {
  status: string;
  message: string;
  data: {
    plan: PlanData;
  };
}

export default function ManageSubscription() {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [providerType, setProviderType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data to get provider_type
  useEffect(() => {
    const fetchUserAndPlans = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, fetch user data to get provider_type
        const userResponse = await apiGet<GetUserApiResponse>(
          API_ENDPOINTS.AUTH.GET_USER
        );

        if (userResponse.success && userResponse.data?.data?.user) {
          const userProviderType = userResponse.data.data.user.service_provider_type;
          setProviderType(userProviderType);

          // Then fetch plans based on provider_type
          if (userProviderType) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
            const plansEndpoint = `${apiBaseUrl}userService/auth/plans?provider_type=${userProviderType}`;
            
            const plansResponse = await apiGet<PlansApiResponse>(plansEndpoint);

            if (plansResponse.success && plansResponse.data?.data?.plan) {
              const plan = plansResponse.data.data.plan;
              // Ensure price is a number (convert from string if needed)
              if (plan.price !== undefined && typeof plan.price === "string") {
                plan.price = parseFloat(plan.price);
              }
              console.log("Plan data:", plan); // Debug log
              setPlanData(plan);
            } else {
              setError("Failed to load plan data");
            }
          } else {
            setError("Provider type not found");
          }
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPlans();
  }, []);

  // Format date helper
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format date with time helper
  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount?: number | string, currency?: string): string => {
    if (amount === undefined || amount === null) return "N/A";
    
    // Convert string to number if needed
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    
    // Check if conversion resulted in a valid number
    if (isNaN(numAmount)) return "N/A";
    
    const curr = currency || "EUR";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: curr,
      }).format(numAmount);
    } catch (error) {
      // Fallback if currency formatting fails
      return `${curr === "EUR" ? "€" : "$"}${numAmount.toFixed(2)}`;
    }
  };

  // Default benefits if not provided
  const defaultBenefits = [
    "Earn money through CoudPouss (secure escrow payments)",
    "Certified Badge visible to all clients",
    "Includes 1 service category, +€1 per extra category",
    "Subscription billed via Bank Card, Google Pay, or Apple Pay",
    "Profile reviewed within 72 hours by an administrator",
  ];

  if (loading) {
    return (
      <Box
        sx={{
          p: { xs: "1.25rem 1rem", sm: "1.25rem 1.5rem", md: "1.25rem 1.5rem" },
          bgcolor: "#FFFFFF",
          borderRadius: "0.75rem",
          border: "1px solid #DBE0E5",
          width: "100%",
          minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !planData) {
    return (
      <Box
        sx={{
          p: { xs: "1.25rem 1rem", sm: "1.25rem 1.5rem", md: "1.25rem 1.5rem" },
          bgcolor: "#FFFFFF",
          borderRadius: "0.75rem",
          border: "1px solid #DBE0E5",
          width: "100%",
          minHeight: { xs: "auto", md: "calc(100vh - 18.75rem)" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#EF4444" }}>
          {error || "No subscription data available"}
        </Typography>
      </Box>
    );
  }
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
          fontSize: { xs: "1.0625rem", sm: "1.125rem", md: "1.1875rem" }, // 17px mobile, 18px tablet, 19px desktop
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
          gap: { xs: "1rem", sm: "1.5rem", md: "2rem" }, // 16px mobile, 24px tablet, 32px desktop
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
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            flexShrink: 0,
            position: "relative",
          }}
        >
          <Image
            src="/icons/important-active-plan.png"
            alt="Important"
            width={48}
            height={48}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
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
            Your plan will end on {planData.plan_end_date ? formatDateTime(planData.plan_end_date) : "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6B7280", lineHeight: 1.6 }}
          >
            After that, you will be automatically billed {formatCurrency(planData.price, "EUR")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          borderRadius: "0.75rem", // 12px
          border: "1px solid rgba(219, 224, 229, 0.4)", // #DBE0E5 with 40% opacity
          padding: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // 16px mobile, 20px tablet, 24px desktop
          gap: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, // 20px mobile, 24px tablet, 28px desktop
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Summary Section */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.0625rem", sm: "1.125rem", md: "1.1875rem" }, // 17px mobile, 18px tablet, 19px desktop
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
              padding: { xs: "1rem 1.25rem", sm: "1.125rem 1.375rem", md: "1.188rem 1.5rem" },
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
                fontSize: { xs: "1.0625rem", sm: "1.125rem", md: "1.1875rem" }, // 17px mobile, 18px tablet, 19px desktop
                lineHeight: "1.25rem", // 20px
                letterSpacing: "1%",
                verticalAlign: "middle",
                color: "#323232",
              }}
            >
              {planData.name || "Professional (Certified)"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography
                sx={{
                  color: "#214C65",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "1.625rem", md: "1.688rem" }, // 24px mobile, 26px tablet, 27px desktop
                  lineHeight: "2rem",
                }}
              >
                {formatCurrency(planData.price, "EUR")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" }, // 14px mobile, 15px tablet, 16px desktop
                  lineHeight: "1.125rem", // 18px
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#214C65",
                }}
              >
                {planData.duration ? planData.duration.charAt(0).toUpperCase() + planData.duration.slice(1) : "Monthly"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: "0.75rem", // 12px
              border: "1px solid rgba(219, 224, 229, 0.4)", // #DBE0E5 with 40% opacity
              px: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // 16px mobile, 20px tablet, 24px desktop
              py: { xs: "1.25rem", sm: "1.5rem", md: "1.625rem" }, // 20px mobile, 24px tablet, 26px desktop
              gap: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, // 20px mobile, 24px tablet, 28px desktop
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
                  mb: { xs: "0.75rem", sm: "1rem" },
                  textWrap: { xs: "wrap", sm: "nowrap" },
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
                  textWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                {planData.next_payment_date ? formatDate(planData.next_payment_date) : "N/A"}
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
                  mb: { xs: "0.75rem", sm: "1rem" },
                  textWrap: { xs: "wrap", sm: "nowrap" },
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
                    textWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  {planData.payment_method || "Credit Card"}
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
                  mb: { xs: "0.75rem", sm: "1rem" },
                  textWrap: { xs: "wrap", sm: "nowrap" },
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
                  textWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                {formatCurrency(planData.price, "EUR")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Renew Plan Button */}
        <Button
          variant="contained"
          sx={{
            bgcolor: "#214C65",
            color: "white",
            textTransform: "none",
            paddingTop: "10px",
            paddingRight: { xs: "2rem", sm: "3rem", md: "60px" }, // 32px mobile, 48px tablet, 60px desktop
            paddingBottom: "10px",
            paddingLeft: { xs: "2rem", sm: "3rem", md: "60px" }, // 32px mobile, 48px tablet, 60px desktop
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: "500",
            borderRadius: "12px",
            width: { xs: "100%", sm: "fit-content" },
            gap: "10px",
            "&:hover": {
              bgcolor: "#1a3d52",
            },
          }}
        >
          Renew Plan
        </Button>

        {/* Description */}
        {planData.description && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "#555555",
              mb: { xs: 3, sm: 4 },
            }}
          >
            {planData.description}
          </Typography>
        )}

       

        {/* Benefits Section */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "17px", sm: "19px" },
            lineHeight: "20px",
            letterSpacing: "1%",
            verticalAlign: "middle",
            color: "#323232",
          }}
        >
          Benefits
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
          {(planData.features && planData.features.length > 0 ? planData.features : defaultBenefits).map((benefit, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1, sm: 1.5 } }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  position: "relative",
                  mt: 0.125,
                }}
              >
                <Image
                  src="/icons/verify.png"
                  alt="Benefit"
                  width={18}
                  height={18}
                  style={{ objectFit: "contain" }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "14px", sm: "16px" },
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "#323232",
                }}
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
