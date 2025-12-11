"use client";

import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
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
              fontSize: "1.375rem", // 22px
              lineHeight: "1.875rem", // 30px
              letterSpacing: 0,
              textAlign: "center",
              mb: 2,
              px: 2,
            }}
          >
            Please request the client to provide their security code to confirm
            the start of the service.
          </Typography>

          {/* Security Code Display */}
          <Box sx={{
            px:"1rem",
            py:"1.25rem",
            borderRadius:"0.75rem",
            border:"1px solid #E6E6E6",
            mb:"1.5rem"
          }}  >
            <Typography
              fontWeight={500}
              sx={{
                color: "#2C6587",
                fontSize: "1rem",
                lineHeight: "1.125rem",
                letterSpacing: 0,
                textAlign: "left",
                mb: "0.75rem",
                width: "100%",
              }}
            >
              Security Code
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "space-between" }}>
              {securityCode.map((digit, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 40,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // border: "0.0625rem solid #D1D5DB
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#1F2937" }}
                  >
                    {digit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Question */}
          <Typography
            sx={{
              color: "#555555",
              fontWeight: 600,
              fontSize: "1.375rem", // 22px
              lineHeight: "1.875rem", // 30px
              letterSpacing: 0,
              textAlign: "center",
              mb: 3,
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
              No
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              sx={{
                bgcolor: "#214C65",
                color: "#FFFFFF",
                textTransform: "none",
                py: "0.625rem",
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
              Yes
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
