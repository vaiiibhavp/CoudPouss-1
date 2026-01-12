"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function AddCategoryModal({
  open,
  onClose,
  onProceed,
}: AddCategoryModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1rem",
          padding: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              position: "relative",
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: 48,
                color: "#4CAF50",
                position: "absolute",
              }}
            />
            <AddCircleOutlineIcon
              sx={{
                fontSize: 24,
                color: "#4CAF50",
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#FFFFFF",
                borderRadius: "50%",
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              lineHeight: "1.75rem",
              color: "#0F232F",
              textAlign: "center",
              mb: 1,
            }}
          >
            Want to add more service categories?
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: "140%",
              color: "#6D6D6D",
              textAlign: "center",
              mb: 3,
            }}
          >
            Additional category you add will incur a monthly fee of €1.
          </Typography>

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
                fontSize: "1.1875rem",
                lineHeight: "1.25rem",
                letterSpacing: "0.01em",
                bgcolor: "#FFFFFF",
                "&:hover": {
                  borderColor: "#214C65",
                  bgcolor: "#FFFFFF",
                },
              }}
            >
              No
            </Button>
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
                fontSize: "1.1875rem",
                lineHeight: "1.25rem",
                letterSpacing: "0.01em",
                "&:hover": {
                  bgcolor: "#1b3f55",
                },
              }}
            >
              Proceed to pay
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

