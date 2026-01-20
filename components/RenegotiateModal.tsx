"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import { apiGet } from "@/lib/api";

interface RenegotiateModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: (amount: string) => void;
  serviceId: number | string; // service request ID to fetch renegotiation data
  finalizedAmount?: number; // for optional +20% validation threshold
  paymentBreakdown?: {
    base_amount: number;
    platform_fee: number;
    taxes: number;
    total: number;
  };
}

export default function RenegotiateModal({
  open,
  onClose,
  onProceed,
  serviceId,
  finalizedAmount,
  paymentBreakdown,
}: RenegotiateModalProps) {
  const [loading, setLoading] = useState(false);
  const [apiPaymentBreakdown, setApiPaymentBreakdown] = useState<{
    base_amount: number;
    platform_fee: number;
    taxes: number;
    total: number;
  } | null>(null);
  const [apiFinalizedAmount, setApiFinalizedAmount] = useState<number | undefined>(undefined);

  // Fetch payment breakdown from API when modal opens
  useEffect(() => {
    if (open && serviceId) {
      const fetchRenegotiationData = async () => {
        setLoading(true);
        try {
          const endpoint = `quote_accept/service-provider/renegotiation/${serviceId}`;
          const response = await apiGet<any>(endpoint);

          if (response?.data?.status === "success" || response?.data) {
            const data = response.data.data || response.data;
            const breakdown = data.payment_breakdown || data;

            setApiPaymentBreakdown({
              base_amount: breakdown.base_amount || breakdown.finalized_quote_amount || 0,
              platform_fee: breakdown.platform_fee || 0,
              taxes: breakdown.taxes || 0,
              total: breakdown.total || 0,
            });

            // Set finalized amount for validation
            setApiFinalizedAmount(breakdown.total || breakdown.finalized_quote_amount);
          }
        } catch (error) {
          console.error("Error fetching renegotiation data:", error);
          // Fall back to props if API fails
          setApiPaymentBreakdown(null);
        } finally {
          setLoading(false);
        }
      };

      fetchRenegotiationData();
    }
  }, [open, serviceId]);

  // Use API data if available, otherwise fall back to props
  const currentPaymentBreakdown = apiPaymentBreakdown || paymentBreakdown;
  const currentFinalizedAmount = apiFinalizedAmount !== undefined ? apiFinalizedAmount : finalizedAmount;

  const ValidationSchema = Yup.object().shape({
    adjustment_amount: Yup.string()
      .required("Adjustment amount is required")
      .test("is-valid-number", "Enter a valid amount", (value) => {
        if (!value) return false;
        const num = Number(String(value).replace(/[^0-9.\-]/g, ""));
        return !isNaN(num) && num > 0;
      })
      .test("max-20-percent", "Max +20% of current amount", (value) => {
        if (!value) return false;
        if (!currentFinalizedAmount) return true; // skip if not provided
        const num = Number(String(value).replace(/[^0-9.\-]/g, ""));
        if (isNaN(num)) return false;
        const maxAllowed = currentFinalizedAmount * 1.2;
        return num <= maxAllowed;
      }),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
          }}
        >
          {/* Renegotiation Icon */}
          <Box
            sx={{
              mb: 3,
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/icons/renegotiation.png"
              alt="Renegotiation"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              color: "#214C65",
              fontSize: "1.375rem",
              lineHeight: "1.875rem",
              letterSpacing: 0,
              textAlign: "center",
              mb: 2,
            }}
          >
            Renegotiation
          </Typography>

          {/* Message */}
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            If you believe the task is more extensive than planned, you can
            request a price increase (max +20%)
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
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
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Platform Fee (15%)
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: "#1F2937" }}
                  >
                    €{currentPaymentBreakdown?.platform_fee?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
                >
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Taxes
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: "#1F2937" }}
                  >
                    €{currentPaymentBreakdown?.taxes?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                    borderTop: "0.0625rem dashed #D1D5DB",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{ color: "#1F2937" }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ color: "#2F6B8E" }}
                  >
                    €{currentPaymentBreakdown?.total?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Input Field with Formik */}
          <Formik
            initialValues={{ adjustment_amount: "" }}
            validationSchema={ValidationSchema}
            onSubmit={(values) => {
              onProceed(values.adjustment_amount);
            }}
          >
            {({ errors, touched, handleSubmit }) => (
              <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
                <Box sx={{ width: "100%", mb: 3 }}>
                  <Typography
                    fontWeight={600}
                    sx={{
                      color: "#424242",
                      fontSize: "1.0625rem", // 17px
                      lineHeight: "1rem", // 16px
                      letterSpacing: 0,
                      mb: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Enter Requested Adjustment
                  </Typography>
                  <Field name="adjustment_amount">
                    {({ field }: FieldProps) => (
                      <TextField
                        fullWidth
                        placeholder="€ Call"
                        variant="outlined"
                        size="small"
                        value={field.value}
                        onChange={field.onChange}
                        name={field.name}
                        error={touched.adjustment_amount && Boolean(errors.adjustment_amount)}
                        helperText={touched.adjustment_amount ? errors.adjustment_amount : ""}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "0.75rem",
                            p: "1rem",
                          },
                          "& .MuiInputBase-input": {
                            p: 0,
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#A5A5A5",
                            fontWeight: 500,
                            fontSize: "1.125rem", // 18px
                            lineHeight: "1",
                            letterSpacing: 0,
                          },
                        }}
                      />
                    )}
                  </Field>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={onClose}
                    sx={{
                      borderColor: "#214C65",
                      color: "#214C65",
                      textTransform: "none",
                      py: "1.125rem",
                      px: "1rem",
                      borderRadius: "0.75rem",
                      fontWeight: 700,
                      fontSize: "1.1875rem", // 19px
                      lineHeight: "1.25rem", // 20px
                      letterSpacing: "0.01em",
                      "&:hover": {
                        borderColor: "#214C65",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#214C65",
                      color: "#FFFFFF",
                      textTransform: "none",
                      py: "1.125rem",
                      px: "1rem",
                      borderRadius: "0.75rem",
                      fontWeight: 700,
                      fontSize: "1.1875rem",
                      lineHeight: "1.25rem",
                      letterSpacing: "0.01em",
                      "&:hover": {
                        bgcolor: "#1b3f55",
                      },
                    }}
                  >
                    Proceed
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
