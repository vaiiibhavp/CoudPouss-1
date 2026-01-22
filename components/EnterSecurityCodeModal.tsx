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
import { apiPost, apiGet } from "@/lib/api";
import { toast } from "sonner";

interface EnterSecurityCodeModalProps {
  open: boolean;
  onClose: () => void;
  onValidate: () => void;
  serviceId: number | string;
  onDataFetched?: (data: any) => void; // Optional callback to pass fetched data
}

export default function EnterSecurityCodeModal({
  open,
  onClose,
  onValidate,
  serviceId,
  onDataFetched,
}: EnterSecurityCodeModalProps) {
  const [code, setCode] = useState(["", "", ""]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset fields when modal closes
  useEffect(() => {
    if (!open) {
      setCode(["", "", ""]);
      setError(false);
      setLoading(false);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(false);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleValidate = async () => {
    // Check if all digits are filled
    if (!code.every((digit) => digit !== "")) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      // Step 1: Validate the security code
      const securityCode = code.join("");

      const endpoint = `quote_accept/validate-service-code/${serviceId}`;
      const response = await apiPost<any>(endpoint, {
        entered_code: securityCode,
      });

      console.log({ validateResponse: response });

      if (response.success) {
        toast.success(response.data?.message || "Service code validated successfully!");

        // Step 2: Fetch completed task details after successful validation
        try {
          const detailsEndpoint = `quote_accept/${serviceId}/completed-task-details`;
          const detailsResponse = await apiGet<any>(detailsEndpoint);

          console.log({ detailsResponse });

          if (detailsResponse.success && detailsResponse.data) {
            // Pass the fetched data to parent component if callback is provided
            if (onDataFetched) {
              onDataFetched(detailsResponse.data);
            }
          } else {
            console.warn("Failed to fetch task details:", detailsResponse.error?.message);
          }
        } catch (detailsError) {
          console.error("Error fetching task details:", detailsError);
          // Don't block the success flow if details fetch fails
        }

        // Call the success callback to proceed
        onValidate();
      } else {
        const errorMessage = response.error?.message || "Invalid security code";
        toast.error(errorMessage);
        setError(true);
      }
    } catch (error: any) {
      console.error("Error validating service code:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to validate service code";
      toast.error(errorMessage);
      setError(true);
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
          {/* Security Code Icon */}
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
              src="/icons/security-code.png"
              alt="Security Code"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Title */}
          <Typography

            fontWeight="600"
            sx={{
              color: "#2C6587",
              mb: "1rem",
              fontSize: "1.375rem",
            }}
          >
            Enter Security Code
          </Typography>

          {/* Message */}
          <Typography
            sx={{
              color: "#737373",
              mb: "1rem",
              lineHeight: "1.125rem",
              fontSize: "0.875rem",
              px: 2,
            }}
          >
            The user will validate this last (final) 3 digits of the code. Please
            input it provided by the user to validate the service completion.
          </Typography>

          {/* Security Code Display */}
          <Typography
            sx={{ color: "#0F232F", mb: "0.75rem", fontSize: "1.188rem", lineHeight: "1.75rem" }}
          >
            3 2 5 - 5 5 8
          </Typography>

          {/* Input Fields */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                id={`code-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                variant="outlined"
                size="small"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    padding: "0.75rem 0",
                    color: error ? "#EF5350" : "#000000",
                  },
                }}
                sx={{
                  width: "3.125rem",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                    "&:hover fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Error Message */}
          {error && (
            <Typography
              variant="caption"
              sx={{ color: "#EF4444", mb: 2 }}
            >
              Please enter valid code
            </Typography>
          )}

          {/* Validate Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleValidate}
            disabled={loading}
            sx={{
              bgcolor: code.every((digit) => digit !== "") ? "#2C6587" : "#E6E6E6",
              color: code.every((digit) => digit !== "") ? "#FFFFFF" : "#424242",
              textTransform: "none",
              fontSize: "19px",
              lineHeight: "20px",
              letterSpacing: "1%",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              mt: 2,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                bgcolor: code.every((digit) => digit !== "") ? "#214C65" : "#E6E6E6",
              },
              "&:disabled": {
                bgcolor: "#9CA3AF",
                color: "#FFFFFF",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
            ) : (
              "Validate"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
