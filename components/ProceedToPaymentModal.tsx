import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import Image from "next/image";

interface ProceedToPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  finalizedQuoteAmount: number;
  platformFeePercent?: number;
  taxes?: number;
  currencySymbol?: string;
}

export default function ProceedToPaymentModal({
  open,
  onClose,
  onProceed,
  finalizedQuoteAmount,
  platformFeePercent = 10,
  taxes = 0,
  currencySymbol = "€",
}: ProceedToPaymentModalProps) {
  const platformFeeAmount = (finalizedQuoteAmount * platformFeePercent) / 100;
  const total = finalizedQuoteAmount + platformFeeAmount + taxes;

  const formatAmount = (value: number) =>
    `${currencySymbol}${value.toFixed(1)}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: "40px",
          minWidth:"440px"
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
          {/* Icon */}
          <Image
            alt="wallet"
            height={60}
            width={60}
            src={"/icons/fi_10473393.png"} // change path as needed
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
            Proceed to payment
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "22px",
              color: "#4B4B4B",
              maxWidth: 420,
              mb: 3,
            }}
          >
            Once the payment is done, the funds will be held securely in escrow.
            After the service is rendered, the payment will be released to the
            provider upon entering the security code.
          </Typography>

          {/* Payment Breakdown */}
          <Box
            sx={{
              width: "100%",
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFF",
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: "14px",
                color: "#1F2933",
              }}
            >
              Payment Breakdown
            </Typography>

            {/* Rows */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#424242" }}>
                Finalized Quote Amount
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#111827" }}>
                {formatAmount(finalizedQuoteAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#424242" }}>
                Platform Fee ({platformFeePercent}%)
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#111827" }}>
                {formatAmount(platformFeeAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#424242" }}>
                Taxes
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#111827" }}>
                {formatAmount(taxes)}
              </Typography>
            </Box>

            {/* Dashed Divider */}
            <Divider
              sx={{
                my: 2,
                borderStyle: "dashed",
                borderColor: "#CBD5E1",
              }}
            />

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: "20px", fontWeight: 600, lineHeight: "24px", color: "#0F232F" }}>
                Total
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#2C6587",
                }}
              >
                {formatAmount(total)}
              </Typography>
            </Box>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                borderColor: "primary.main",
                bgcolor: "#FFFFFF",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#94A3B8",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={onProceed}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#FFFFFF",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#0C3B64",
                },
              }}
            >
              Proceed to Pay
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
