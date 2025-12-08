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

interface DeleteProfileModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProfileModal({
  open,
  onClose,
  onConfirm,
}: DeleteProfileModalProps) {
  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Warning Icon */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/icons/Warning.png"
            alt="Warning"
            width={60}
            height={60}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Main Question */}
        <Typography
          sx={{
            fontSize: "22px",
            lineHeight: "30px",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#2C6587",
            mb: 2,
          }}
        >
          Are you sure you want to delete your your account?
        </Typography>

        {/* Warning/Consequences Text */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#424242",
            mb: 4,
            maxWidth: "90%",
          }}
        >
          This action cannot be reversed once your account is deleted. All of
          your data will be permanently erased. If you proceed, there will be no
          refunds issued.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Cancel Button */}
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              flex: 1,
              maxWidth: "200px",
              textTransform: "none",
              height: "56px",
              borderRadius: "12px",
              border: "1px solid #214C65",
              borderColor: "#214C65",
              padding: "10px",
              gap: "10px",
              bgcolor: "#FFFFFF",
              fontSize: "19px",
              lineHeight: "20px",
              letterSpacing: "1%",
              color: "#214C65",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#214C65",
                bgcolor: "#F5F5F5",
              },
            }}
          >
            Cancel
          </Button>

          {/* Delete Profile Button */}
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              flex: 1,
              maxWidth: "200px",
              textTransform: "none",
              height: "56px",
              borderRadius: "12px",
              padding: "10px",
              gap: "10px",
              bgcolor: "#214C65",
              fontSize: "19px",
              lineHeight: "20px",
              letterSpacing: "1%",
              color: "#FFFFFF",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#1a3d52",
              },
            }}
          >
            Delete Profile
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

