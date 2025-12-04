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

interface RenegotiateModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function RenegotiateModal({
  open,
  onClose,
  onProceed,
}: RenegotiateModalProps) {
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
          {/* Renegotiation Icon */}
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
            fontWeight="600"
            sx={{
              color: "#1F2937",
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
            You can send a price renegotiation to the client
          </Typography>

          {/* Payment Breakdown */}
          <Box sx={{ width: "100%", mb: 3, textAlign: "left" }}>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: "#1F2937", mb: 2 }}
            >
              Current Payment Breakdown
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Finalized Quote Amount
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                €499
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Platform Fee (15%)
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                €74.85
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Taxes
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                €1.20
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
              <Typography variant="body1" fontWeight="600" sx={{ color: "#1F2937" }}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight="700" sx={{ color: "#2F6B8E" }}>
                €340.00
              </Typography>
            </Box>
          </Box>

          {/* Input Field */}
          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: "#1F2937", mb: 1, textAlign: "left" }}
            >
              Enter Requested Adjustment
            </Typography>
            <TextField
              fullWidth
              placeholder="€ Call"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
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
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onProceed}
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
              Proceed
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
