import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
} from "@mui/material";
import Image from "next/image";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx:{
          borderRadius: 3,
          padding: 3,
        }
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 3,
          }}
        >
          {/* Thank You Image */}
          <Box
            sx={{
              width: 300,
              height: 300,
              position: "relative",
              mb: 3,
            }}
          >
            <Image
              src="/icons/thankyou.png"
              alt="Thank you"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Message */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 400 }}
          >
            Great job! Your account is now created successfully.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
