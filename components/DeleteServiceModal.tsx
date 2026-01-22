"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

interface DeleteServiceModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteServiceModal({
  open,
  onClose,
  onConfirm,
}: DeleteServiceModalProps) {
  const handleDelete = async () => {
    await onConfirm();
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
          p: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3, textAlign: "center" }}>
        <Box sx={{ position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: -16,
              top: -16,
              color: "#6B7280",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Warning Icon */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                position: "relative",
              }}
            >
              <Image
                src="/icons/delete-service.png"
                alt="Delete Service"
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>

          {/* Confirmation Message */}
          <Typography
            variant="h6"
            fontWeight="500"
            sx={{ color: "#1F2937", mb: 3 }}
          >
            Are you sure to delete the service?
          </Typography>

          {/* Delete Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleDelete}
            sx={{
              bgcolor: "#EF4444",
              color: "white",
              textTransform: "none",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Delete Service
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
