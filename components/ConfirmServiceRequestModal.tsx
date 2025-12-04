import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Image from "next/image";

interface ConfirmServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rate: number | string;
  providerName: string;
  currencySymbol?: string; // default: €
}

export default function ConfirmServiceRequestModal({
  open,
  onClose,
  onConfirm,
  rate,
  providerName,
  currencySymbol = "€",
}: ConfirmServiceRequestModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
          width: "32.5rem",
          maxWidth: "32.5rem",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Top icon */}
          <Image
            alt="calendar-confirm"
            height={60}
            width={60}
            src={"/icons/fi_12607700.png"} // change path if needed
          />

          {/* Title */}
          <Typography
            fontWeight={500}
            sx={{
              fontSize: "1.375rem",
              lineHeight: "1.875rem",
              my: 2,
              color: "#2C6587",
            }}
          >
            Confirm Service request ?
          </Typography>

          {/* Description */}
          <Typography
            fontWeight={400}
            sx={{
              fontSize: "1.1875rem",
              lineHeight: "1.75rem",
              color: "#4B4B4B",
              mb: 3,
            }}
          >
            You are about to confirm a service at the rate of{" "}
            <strong>
              {rate}
              {currencySymbol}
            </strong>{" "}
            with the Provider <strong>{providerName}</strong>, Are you sure you
            want to continue?
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              mt: 1,
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                height: "3.5rem",
                borderRadius: "0.75rem",
                border: "0.0625rem solid #214C65",
                padding: "0.625rem",
                textTransform: "none",
                fontWeight: 500,
                color: "#214C65",
                "&:hover": {
                  border: "0.0625rem solid #214C65",
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
                height: "3.5rem",
                borderRadius: "0.75rem",
                padding: "0.625rem",
                textTransform: "none",
                fontWeight: 500,
                bgcolor: "#214C65",
                "&:hover": {
                  bgcolor: "#214C65",
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
