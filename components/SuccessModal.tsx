import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CelebrationIcon from "@mui/icons-material/Celebration";

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
            <CelebrationIcon
              sx={{
                fontSize: 60,
                color: "#FFB800",
                mb: 2,
              }}
            />
          ) : (
            <CheckCircleIcon
              sx={{
                fontSize: 80,
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
            sx={{ mb: showSubscriptionDetails ? 3 : 3, maxWidth: 450 }}
          >
            {message}
          </Typography>

          {showSubscriptionDetails && subscriptionDetails && (
            <Box
              sx={{
                width: "100%",
                bgcolor: "#f9fafb",
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: "left",
              }}
            >
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Subscription Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Plan:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {subscriptionDetails.plan || "Professional/Monthly"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Mode of Payment:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {subscriptionDetails.modeOfPayment || "Google Pay"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Subscription Date:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {subscriptionDetails.subscriptionDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Start Date:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {subscriptionDetails.startDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Billing Date:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {subscriptionDetails.billingDate || "Monthly"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Next Charge Date:
                </Typography>
                <Typography variant="body2" fontWeight="600">
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
              bgcolor: "#2F6B8E",
              color: "white",
              px: showSubscriptionDetails ? 4 : 6,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "#25608A",
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
