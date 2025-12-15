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
                €499
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
                €51.85
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
                €0.5
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
            }}
          >
            Proceed
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
