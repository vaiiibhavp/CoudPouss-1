"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Image from "next/image";

interface SecurityCodeMatchModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  securityCode: string[];
}

export default function SecurityCodeMatchModal({
  open,
  onClose,
  onConfirm,
  securityCode,
}: SecurityCodeMatchModalProps) {
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
          {/* Security Code Icon */}
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
              src="/icons/security-code.png"
              alt="Security Code"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              mb: 2,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            Please request the client to provide their security code to confirm
            the start of the service.
          </Typography>

          {/* Security Code Display */}
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{ color: "#2F6B8E", mb: 1 }}
          >
            Security Code
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            {securityCode.map((digit, index) => (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "0.0625rem solid #D1D5DB",
                  borderRadius: 1,
                  bgcolor: "#F9FAFB",
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ color: "#1F2937" }}>
                  {digit}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Question */}
          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              mb: 3,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            Does the provided security code match the one shown below?
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              px: 2,
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderColor: "#D1D5DB",
                color: "#6B7280",
                textTransform: "none",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#9CA3AF",
                  bgcolor: "transparent",
                },
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              sx={{
                bgcolor: "#2F6B8E",
                color: "white",
                textTransform: "none",
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
