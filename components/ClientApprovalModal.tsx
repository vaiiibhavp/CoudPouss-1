"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

interface ClientApprovalModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  serviceId: number | string;
  paymentBreakdown?: {
    base_amount: number;
    platform_fee: number;
    taxes: number;
    total: number;
  };
}

export default function ClientApprovalModal({
  open,
  onClose,
  onProceed,
  serviceId,
  paymentBreakdown,
}: ClientApprovalModalProps) {
  const [loading, setLoading] = useState(false);
  const [apiPaymentBreakdown, setApiPaymentBreakdown] = useState<{
    base_amount: number;
    platform_fee: number;
    taxes: number;
    total: number;
  } | null>(null);

  // Use API data if available, otherwise fall back to props
  const currentPaymentBreakdown = apiPaymentBreakdown || paymentBreakdown;

  // Handle Proceed button click - fetch API and then call onProceed
  const handleProceedClick = async () => {
    setLoading(true);
    try {
      const endpoint = `quote_accept/${serviceId}/completed-task-details`;
      const response = await apiGet<any>(endpoint);


      console.log({ response })
      // Check if response has error status
      if (!response.success) {
        const errorMessage = response.error?.message || "Failed to load task details";
        toast.error(errorMessage);
        return; // Don't proceed if there's an error
      }

      if (response?.data?.status === "success" || response?.data) {
        const data = response.data.data || response.data;
        const breakdown = data.payment_breakdown || data;

        setApiPaymentBreakdown({
          base_amount: breakdown.finalized_quote_amount || breakdown.base_amount || 0,
          platform_fee: breakdown.platform_fee || 0,
          taxes: breakdown.taxes || 0,
          total: breakdown.total || 0,
        });

        toast.success("Task details loaded successfully");
        // Call the original onProceed callback
        onProceed();
      } else {
        const errorMessage = response?.data?.message || "Failed to load task details";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error fetching completed task details:", error);

      // Extract error message from backend response
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load payment details";

      toast.error(errorMessage);
      // Don't call onProceed if API fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 2,
          }}
        >
          {/* Thumbs Up Icon */}
          <Box
            sx={{
              mb: 3,
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/icons/thumbs-up.png"
              alt="Approved"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Message */}
          <Typography
            sx={{
              color: "#555555",
              fontWeight: 600,
              fontSize: "1.25rem",
              lineHeight: "1.5rem",
              letterSpacing: 0,
              textAlign: "center",
              mb: 2,
              px: 2,
            }}
          >
            The client has approved your request. Would you like to proceed with
            the next steps?
          </Typography>

          {/* Payment Breakdown */}
          <Box
            sx={{
              width: "100%",
              mb: 3,
              textAlign: "left",
              border: "1px solid #E6E6E6",
              p: "1rem",
              borderRadius: "0.75rem",
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                color: "#424242",
                fontSize: "1.0625rem", // 17px
                lineHeight: "1rem", // 16px
                letterSpacing: 0,
                mb: 2,
              }}
            >
              Current Payment Breakdown
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    Finalized Quote Amount
                  </Typography>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    €{currentPaymentBreakdown?.base_amount?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    Platform Fee (15%)
                  </Typography>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    €{currentPaymentBreakdown?.platform_fee?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    Taxes
                  </Typography>
                  <Typography
                    sx={{
                      color: "#595959",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: "1rem",
                      letterSpacing: 0,
                    }}
                  >
                    €{currentPaymentBreakdown?.taxes?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                    borderTop: "0.0625rem dashed #2C6587",
                  }}
                >
                  <Typography
                    fontWeight={600}
                    sx={{
                      color: "#0F232F",
                      fontSize: "1.25rem",
                      lineHeight: "1.5rem",
                      letterSpacing: 0,
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      color: "#214C65",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                      lineHeight: "1",
                      letterSpacing: 0,
                    }}
                  >
                    €{currentPaymentBreakdown?.total?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleProceedClick}
            disabled={loading}
            sx={{
              bgcolor: "#214C65",
              color: "#FFFFFF",
              textTransform: "none",
              py: "1.125rem",
              px: "1rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "1.1875rem", // 19px
              lineHeight: "1.25rem", // 20px
              letterSpacing: "0.01em",
              "&:hover": {
                bgcolor: "#1b3f55",
              },
              "&:disabled": {
                bgcolor: "#9CA3AF",
                color: "#FFFFFF",
              },
            }}
          >
            {loading ? "Loading..." : "Proceed"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
