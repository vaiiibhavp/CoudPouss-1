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

interface LocationShareModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LocationShareModal({
  open,
  onClose,
  onConfirm,
}: LocationShareModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          py: "2.5rem",
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
          {/* Location Icon */}
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
              src="/icons/location.png"
              alt="Location"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Message */}
          <Typography
            sx={{
              color: "#0F232F",
              fontWeight: 400,
              fontSize: "1.25rem",
              lineHeight: "100%",
              letterSpacing: 0,
              textAlign: "center",
              mb: 4,
              px: 2,
            }}
          >
            Sharing your location with the client is required to start the
            service. Would you like to continue?
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
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
              py: "0.625rem",
              px: "1rem",
              borderRadius: "0.75rem",
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: "140%",
              letterSpacing: 0,
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
