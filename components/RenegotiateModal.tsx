"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";

interface RenegotiateModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: (amount: string) => void;
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
  finalizedAmount,
  paymentBreakdown,
}: RenegotiateModalProps) {
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
        if (!finalizedAmount) return true; // skip if not provided
        const num = Number(String(value).replace(/[^0-9.\-]/g, ""));
        if (isNaN(num)) return false;
        const maxAllowed = finalizedAmount * 1.2;
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
                €{paymentBreakdown?.base_amount?.toFixed(2) || "0.00"}
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
                €{paymentBreakdown?.platform_fee?.toFixed(2) || "0.00"}
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
                €{paymentBreakdown?.taxes?.toFixed(2) || "0.00"}
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
                €{paymentBreakdown?.total?.toFixed(2) || "0.00"}
              </Typography>
            </Box>
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
