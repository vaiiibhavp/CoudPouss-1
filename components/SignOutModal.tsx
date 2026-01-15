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

interface SignOutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutModal({
  open,
  onClose,
  onConfirm,
}: SignOutModalProps) {
  const handleSignOut = () => {
    onConfirm();
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
            src="/icons/WarningFigma.png"
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
            mb: 4,
          }}
        >
          Are you sure you want to Sign out?
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
              border: "1px solid #E0E0E0",
              borderColor: "#E0E0E0",
              padding: "10px",
              gap: "10px",
              bgcolor: "#FFFFFF",
              fontSize: "19px",
              lineHeight: "20px",
              letterSpacing: "1%",
              color: "#424242",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#BDBDBD",
                bgcolor: "#F5F5F5",
              },
            }}
          >
            Cancel
          </Button>

          {/* Sign Out Button */}
          <Button
            variant="contained"
            onClick={handleSignOut}
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
            Sign Out
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

