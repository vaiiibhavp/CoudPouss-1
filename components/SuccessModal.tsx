import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

interface SubscriptionDetails {
  plan?: string;
  modeOfPayment?: string;
  subscriptionDate?: string;
  startDate?: string;
  billingDate?: string;
}

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  showSubscriptionDetails?: boolean;
  subscriptionDetails?: SubscriptionDetails;
}

export default function SuccessModal({
  open,
  onClose,
  title = "Success!",
  message = "Great job! Your account is now created successfully.",
  buttonText = "Continue",
  showSubscriptionDetails = false,
  subscriptionDetails,
}: SuccessModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: showSubscriptionDetails ? 3 : 2,
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
            py: showSubscriptionDetails ? 2 : 3,
          }}
        >
          {showSubscriptionDetails ? (
            <Box
              sx={{
                width: "7.5rem",
                height: "7.5rem",
                borderRadius: "50%",
                bgcolor: "rgba(76, 175, 80, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Image
                src="/icons/crackerIcon.png"
                alt="celebration"
                width={60}
                height={60}
              />
            </Box>
          ) : (
            <CheckCircleIcon
              sx={{
                fontSize: "5rem",
                color: "#4CAF50",
                mb: 2,
              }}
            />
          )}
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#2F6B8E" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: showSubscriptionDetails ? 3 : 3, maxWidth: "28.125rem" }}
          >
            {message}
          </Typography>

          {showSubscriptionDetails && subscriptionDetails && (
            <Box
              sx={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "0.0625rem solid #E6E6E6",
                paddingTop: "0.8125rem",
                paddingRight: "1rem",
                paddingBottom: "0.8125rem",
                paddingLeft: "1rem",
                gap: "1rem",
                mb: 3,
                textAlign: "left",
                "&:hover": {
                  borderColor: "#E6E6E6",
                },
              }}
            >
              <Typography sx={{
                fontWeight:600,
                fontSize:"1rem",
                lineHeight:"1.125rem",
                color:"primary.normal",
                mb:"1rem"
              }} >
                Subscription Details
              </Typography>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Plan:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {subscriptionDetails.plan || "Professional/Monthly"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Mode of Payment:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {subscriptionDetails.modeOfPayment || "Google Pay"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Subscription Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {subscriptionDetails.subscriptionDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Start Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {subscriptionDetails.startDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Billing Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {subscriptionDetails.billingDate || "Monthly"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: "1rem",
                    letterSpacing: "0%",
                    color: "#595959",
                  }}
                >
                  Next Charge Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: "1.125rem",
                    letterSpacing: "0%",
                    color: "#424242",
                  }}
                >
                  {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Typography>
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth={showSubscriptionDetails}
            onClick={onClose}
            sx={{
              bgcolor: "#214C65",
              color: "white",
              px: showSubscriptionDetails ? 4 : 6,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "#214C65",
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
