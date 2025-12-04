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
          p: "2.5rem",
          minWidth: "27.5rem"
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
              fontSize: "1.375rem",
              lineHeight: "1.875rem",
              letterSpacing: "0%",
              my: 2,
              color: "#214C65",
            }}
          >
            Proceed to payment
          </Typography>

          {/* Subtitle */}
          <Typography
            fontWeight={400}
            sx={{
              fontSize: "0.875rem",
              lineHeight: "1.125rem",
              letterSpacing: "0%",
              color: "#555555",
              maxWidth: "26.25rem",
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
              borderRadius: "0.75rem",
              border: "0.0625rem solid #E6E6E6",
              backgroundColor: "#FFF",
              paddingTop: "0.8125rem",
              paddingRight: "1rem",
              paddingBottom: "0.8125rem",
              paddingLeft: "1rem",
              mb: 3,
              "&:hover": {
                border: "0.0625rem solid #E6E6E6",
              },
            }}
          >
            <Typography
              fontWeight={500}
              sx={{
                fontSize: "1.125rem",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
                textAlign: "left",
                mb: "1rem",
                color: "#323232",
              }}
            >
              Payment Breakdown
            </Typography>

            {/* Rows */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "1rem",
              }}
            >
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                Finalized Quote Amount
              </Typography>
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                {formatAmount(finalizedQuoteAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "1rem",
              }}
            >
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                Platform Fee ({platformFeePercent}%)
              </Typography>
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                {formatAmount(platformFeeAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "1rem",
              }}
            >
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                Taxes
              </Typography>
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: "1rem",
                  letterSpacing: "0%",
                  color: "#595959",
                }}
              >
                {formatAmount(taxes)}
              </Typography>
            </Box>

            {/* Dashed Divider */}
            <Divider
              sx={{
                my: "1rem",
                borderStyle: "dashed",
                borderWidth: "0.0625rem",
                borderColor: "#2C6587",
                borderImageSource: "none",
                "&::before, &::after": {
                  borderStyle: "dashed",
                  borderWidth: "0.0625rem",
                },
              }}
            />

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  letterSpacing: "0%",
                  color: "#0F232F",
                }}
              >
                Total
              </Typography>
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "1.25rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
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
              gap: "1rem",
              width: "100%",
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
                bgcolor: "#FFFFFF",
                color: "#214C65",
                fontWeight: 500,
                "&:hover": {
                  border: "0.0625rem solid #214C65",
                  bgcolor: "#FFFFFF",
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
                height: "3.5rem",
                borderRadius: "0.75rem",
                padding: "0.625rem",
                textTransform: "none",
                bgcolor: "#214C65",
                color: "#FFFFFF",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#214C65",
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
