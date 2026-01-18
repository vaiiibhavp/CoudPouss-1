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
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
interface RejectServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  serviceId: string;
  onCancelSuccess: () => void;
}

export interface ServiceDetail {
  service_id: string;
  category_info: {
    category_id: string;
    category_name: {
      name: string;
      logo_url: string;
    };
  };
  subcategory_info: {
    sub_category_id: string;
    sub_category_name: {
      name: string;
      img_url: string;
    };
  };
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
  location: string;
}
export interface CancellationBreakdown {
  service_id: string;
  cancellation_allowed: boolean;
  is_within_48_hours: boolean;
  is_professional: boolean;
  hours_before_service: number;
  service_fee: number;
  total_amount: number;
  total_refund: number;
}
const ActionButton = ({
  variant,
  onClick,
  children,
  colorType = "primary",
  disabled = false,
}: {
  variant: "contained" | "outlined";
  onClick: () => void;
  children: React.ReactNode;
  colorType?: "primary" | "danger";
  disabled: boolean;
}) => (
  <Button
    variant={variant}
    fullWidth
    onClick={onClick}
    disabled={disabled}
    sx={{
      borderRadius: "0.75rem",
      textTransform: "none",
      fontWeight: colorType === "danger" ? 700 : 500,
      fontSize: { xs: 16, sm: 19 },
      padding: "0.625rem",
      gap: "0.625rem",
      ...(variant === "contained" && {
        bgcolor: "#214C65",
        "&:hover": { bgcolor: "#214C65", opacity: 0.9 },
      }),
      ...(colorType === "danger" && {
        borderColor: "#C62828",
        color: "#C62828",
        "&:hover": { borderColor: "#C62828" },
      }),
    }}
  >
    {children}
  </Button>
);

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
  serviceId,
  onCancelSuccess,
}: RejectServiceRequestModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<ServiceDetail>();
  const [serviceBreakdown, setServiceBreakdown] =
    useState<CancellationBreakdown>();
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (serviceId && open) {
      const fetchData = async () => {
        try {
          const [details, breakdown] = await Promise.all([
            apiGet<ServiceDetail>(
              API_ENDPOINTS.CANCEL_SERVICE.GET_CANCEL_DETAILS(serviceId),
            ),
            apiGet<CancellationBreakdown>(
              API_ENDPOINTS.CANCEL_SERVICE.CANCEL_REQUEST_BREAKDOWN(serviceId),
            ),
          ]);
          if (details.success) setService(details.data);
          if (breakdown.success) setServiceBreakdown(breakdown.data);
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      };
      fetchData();
    }
  }, [serviceId, open]);

  const cancelService = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const response = await apiPost(
        API_ENDPOINTS.CANCEL_SERVICE.CANCEL_REQUEST(serviceId),
      );

      if (response.success) {
        setStep(4);
        onCancelSuccess();
      } else {
        console.error("Cancel failed:");
      }
    } catch (error) {
      console.error("Cancel API error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      setService(undefined);
      setServiceBreakdown(undefined);
    }
  }, [open]);

  const nextStep = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!serviceBreakdown) return;

      if (serviceBreakdown.cancellation_allowed === false) {
        setStep(3);
        return;
      }

      await cancelService();
    }
  };

  const prevStep = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setService(undefined);
      setServiceBreakdown(undefined);
    }, 300); // Reset after transition
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
              <IconButton sx={{ p: 0.5 }} onClick={handleClose}>
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
          {step === 2 && (
            <CancellationPaymentSummary serviceBreakdown={serviceBreakdown} />
          )}
          {step === 4 && (
            <>
              <CancelServiceSuccess service={service} />
              <CancellationPaymentSummary serviceBreakdown={serviceBreakdown} />
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
                <ActionButton
                  variant="contained"
                  onClick={handleClose}
                  disabled={false}
                >
                  Keep Booking
                </ActionButton>
                <ActionButton
                  variant="outlined"
                  colorType="danger"
                  onClick={nextStep}
                  disabled={isCancelling || (step === 2 && !serviceBreakdown)}
                >
                  Confirm Cancellation
                </ActionButton>
              </>
            )}
            {step === 3 && (
              <ActionButton
                variant="contained"
                onClick={prevStep}
                disabled={false}
              >
                Back
              </ActionButton>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
