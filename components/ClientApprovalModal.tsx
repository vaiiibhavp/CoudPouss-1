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

interface ClientApprovalModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function ClientApprovalModal({
  open,
  onClose,
  onProceed,
}: ClientApprovalModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx:{
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
            variant="body1"
            sx={{
              color: "#374151",
              mb: 2,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            The client has approved your request. Would you like to proceed with
            the next steps?
          </Typography>

          {/* Payment Breakdown */}
          <Box sx={{ width: "100%", mb: 3, textAlign: "left", bgcolor: "#F9FAFB", p: 2, borderRadius: 2 }}>
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
                €51.85
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Taxes
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ color: "#1F2937" }}>
                €0.5
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
                €374.00
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
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
      </DialogContent>
    </Dialog>
  );
}
