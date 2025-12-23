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

interface SecurityCodeSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function SecurityCodeSuccessModal({
  open,
  onClose,
  onProceed,
}: SecurityCodeSuccessModalProps) {
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
          {/* Success Icon */}
          <Box
            sx={{
              mb: "2.124rem",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/icons/security-code-success.png"
              alt="Success"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Message */}
          <Typography
            fontWeight="600"
            sx={{
              color: "#565656",
              fontSize: "1.125rem",
              lineHeight: "1.25rem",
              letterSpacing: "0",
              mb: 4,
              px: 2,
            }}
          >
            Security Code validated successfully.
          </Typography>

          {/* Proceed Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={onProceed}
            sx={{
              bgcolor: "#2C6587",
              color: "white",
              textTransform: "none",
              py: "1.125rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "1.188rem",
              lineHeight: "1.25rem",
              letterSpacing: "1%",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#2C6587",
                boxShadow: "none",
              },
            }}
          >
            Proceed
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
