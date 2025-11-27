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
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
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
            fontWeight={600}
            sx={{
              fontSize: "22px",
              lineHeight: "30px",
              my: 2,
              color: "#2C6587",
            }}
          >
            Confirm Service request ?
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "22px",
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
              gap: 2,
              width: "100%",
              mt: 1,
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 500,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
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
