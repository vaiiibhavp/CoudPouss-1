import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Radio,
  TextField,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { CancelServiceConfirmation } from "./cancel-service/CancelServiceConfirmation";
import { CancellationPaymentSummary } from "./cancel-service/CancellationPaymentSummary";
import { CancelServiceSuccess } from "./cancel-service/CancelServiceSuccess";
import CloseIcon from "@mui/icons-material/Close";
interface RejectServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

const REASONS = [
  "Price higher than competitors",
  "Late response",
  "Rejected for another reason",
];
const ServiceHeaders = {
  1: "Are you sure you want to cancel your scheduled service with the expert?",
  2: "Are you sure you want to cancel your scheduled service with the expert?",
  3: "",
  4: "Your service has been successfully cancelled. Here are the details regarding your payment and the cancellation policy.",
};
const TITLE_MAP: Record<Step, string> = {
  1: "Cancel Scheduled Service",
  2: "Cancel Scheduled Service",
  3: "Cancellation Not Possible",
  4: "Cancellation Successful",
};

type Step = 1 | 2 | 3 | 4;
const STEP_WIDTH: Record<Step, number> = {
  1: 506,
  2: 545,
  3: 430,
  4: 430,
};
export default function RejectServiceRequestModal({
  open,
  onClose,
  onReject,
}: RejectServiceRequestModalProps) {
  const [step, setStep] = useState<Step>(1);


  const handleReject = () => {
    // onReject();
    onClose();
  };
  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);
  const handleStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // setStep(3);
      setStep(4);
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: STEP_WIDTH[step],
          },
          maxWidth: "95vw",
          maxHeight: "90vh",
          borderRadius: {
            xs: "0.75rem",
            sm: "1.5rem",
          },
          p: {
            xs: "1.5rem",
            sm: "2.5rem",
          },
          overflow: "hidden",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          {step === 4 && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: 12, sm: 16 },
                right: { xs: 12, sm: 16 },
                zIndex: 1,
              }}
            >
              <IconButton sx={{ p: 0.5 }} onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "10px",
            }}
          >
            <Image
              alt="doc"
              height={60}
              width={60}
              src={"/icons/fi_2279060.png"}
            />
            <Typography
              fontWeight={500}
              sx={{
                fontSize: { xs: 18, sm: 22 },
                lineHeight: "1.875rem",
                color: "#2C6587",
              }}
            >
              {TITLE_MAP[step]}
            </Typography>
          </Box>
          <Box>
            <Typography
              fontSize={{ xs: 15, sm: 19 }}
              fontWeight={500}
              lineHeight={"28px"}
            >
              {ServiceHeaders[step]}
            </Typography>
          </Box>
          {step === 3 && (
            <Typography fontSize={12} fontWeight={400}>
              The scheduled service is already within its execution period or
              completed. At this stage, cancellation is no longer possible. if
              you still wish to cancel, no money will be refunded.
            </Typography>
          )}
          {step === 1 && <CancelServiceConfirmation />}
          {step === 2 && <CancellationPaymentSummary />}
          {step === 4 && (
            <>
              <CancelServiceSuccess />
              <CancellationPaymentSummary />
            </>
          )}
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {(step === 1 || step === 2) && (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onClose}
                  sx={{
                    borderRadius: "0.75rem",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: { xs: 16, sm: 19 },
                    padding: "0.625rem",
                    gap: "0.625rem",
                    bgcolor: "#214C65",
                    "&:hover": {
                      bgcolor: "#214C65",
                      opacity: 0.9,
                    },
                  }}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleStep}
                  sx={{
                    borderRadius: "0.75rem",
                    textTransform: "none",
                    fontWeight: 700,
                    padding: "0.625rem",
                    fontSize: { xs: 16, sm: 19 },
                    border: "0.0625rem solid",
                    borderColor: "#C62828",
                    color: "#C62828",
                    gap: "0.625rem",
                  }}
                >
                  Confirm Cancellation
                </Button>
              </>
            )}
            {step == 3 && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setStep(2)}
                sx={{
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  fontSize: { xs: 16, sm: 19 },
                  fontWeight: 500,
                  padding: "0.625rem",
                  gap: "0.625rem",
                  bgcolor: "#214C65",
                  "&:hover": {
                    bgcolor: "#214C65",
                    opacity: 0.9,
                  },
                }}
              >
                Back
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
