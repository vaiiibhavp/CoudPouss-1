"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Image from "next/image";
import { apiPut } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";
import { ApiResponse } from "@/types";

/* ---------------------------------- Types --------------------------------- */

type RejectReason = "Price higher than competitors" | "Late response" | "other";

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<void> | void;
  data: {
    service_id?: string;
    quote_id?: string;
  };
}
/* ---------------- API Response ---------------- */

export interface RejectServiceResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: RejectServiceData;
}

/* ---------------- Payload Data ---------------- */

export interface RejectServiceData {
  service_id: string;
  quote_id: string;
  task_status: "open" | "closed" | "cancelled";
  is_taken: boolean;
  quote_status: "rejected" | "accepted" | "pending";
  failure_reason: string | null;
}


/* ------------------------------ Constants ---------------------------------- */

const OTHER_REASON_MAX_LENGTH = 250;

const REJECT_REASONS: { label: string; value: RejectReason }[] = [
  {
    label: "Price higher than competitors",
    value: "Price higher than competitors",
  },
  {
    label: "Late response",
    value: "Late response",
  },
  {
    label: "Rejected for another reason",
    value: "other",
  },
];

/* ------------------------------ Component ---------------------------------- */

const RejectServiceModal = ({
  open,
  onClose,
  onSubmit,
  data,
}: RejectModalProps) => {
  const [reason, setReason] = useState<RejectReason | "">("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ----------------------------- Side Effects ----------------------------- */

  // Clear "other" text when switching reasons
  useEffect(() => {
    if (reason !== "other") {
      setOtherReasonText("");
    }
  }, [reason]);

  /* ----------------------------- Validation -------------------------------- */

  const trimmedOtherReason = otherReasonText.trim();

  const isValid = useMemo(() => {
    if (!reason) return false;
    if (reason === "other") return trimmedOtherReason.length > 0;
    return true;
  }, [reason, trimmedOtherReason]);

  /* ----------------------------- Handlers ---------------------------------- */

  const handleReject = useCallback(async () => {
  if (!isValid || submitting) return;

  const finalReason =
    reason === "other" ? trimmedOtherReason : reason;

  try {
    setSubmitting(true);

    const payload = {
      service_id: data?.service_id,
      quote_id: data?.quote_id,
      reject_reason: finalReason,
    };

    const response = await apiPut<ApiResponse<RejectServiceData>>(
      API_ENDPOINTS.SERVICE_REQUEST.REJECT_SERVICE,
      payload
    );

    // ✅ optional: validate API response
    if (response?.error?.message ) {
      throw new Error(response?.error?.message || "Reject failed");
    }

    // ✅ refresh parent data
    await onSubmit?.();

    // ✅ close modal only on success
    onClose();
  } catch (error) {
    console.error("Reject submission failed:", error);
    toast.error("Failed to reject service")
  } finally {
    setSubmitting(false);
  }
}, [
  isValid,
  submitting,
  reason,
  trimmedOtherReason,
  data?.service_id,
  data?.quote_id,
  onSubmit,
  onClose,
]);


  /* -------------------------------- Render -------------------------------- */

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      aria-labelledby="reject-service-title"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          p: "20px",
          width: "520px",
          maxWidth: "90vw",
        },
      }}
    >
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={2}
        >
          {/* Icon */}
          <Image
            alt="Reject service"
            height={60}
            width={60}
            src="/icons/fi_2279060.png"
          />

          {/* Title */}
          <Typography
            id="reject-service-title"
            fontWeight={600}
            color="#2C6587"
            fontSize={{ xs: 18, sm: 22 }}
          >
            Reject Service Request
          </Typography>

          {/* Reasons */}
          <RadioGroup
            value={reason}
            onChange={(e) => setReason(e.target.value as RejectReason)}
            sx={{ width: "100%", gap: 1.5, mt: 1 }}
          >
            {REJECT_REASONS.map(({ label, value }) => (
              <Box
                key={value}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "12px",
                  px: 2,
                  py: value === "other" ? 1 : 0.5,
                }}
              >
                <FormControlLabel
                  value={value}
                  control={<Radio size="small" />}
                  label={label}
                  labelPlacement="start"
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    m: 0,
                  }}
                />

                {value === "other" && reason === "other" && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                    placeholder="Write your reason here..."
                    inputProps={{
                      maxLength: OTHER_REASON_MAX_LENGTH,
                    }}
                    helperText={`${otherReasonText.length}/${OTHER_REASON_MAX_LENGTH}`}
                    sx={{
                      mt: 1.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FAFAFA",
                      },
                    }}
                  />
                )}
              </Box>
            ))}
          </RadioGroup>

          {/* Actions */}
          <Box display="flex" width="100%" gap={2} mt={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                borderColor: "#214C65",
                color: "#214C65",
                fontWeight: 600,
                py: 1.2,
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleReject}
              disabled={!isValid || submitting}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                bgcolor: "#214C65",
                fontWeight: 600,
                py: 1.2,
                "&:hover": { bgcolor: "#1a3d52" },
              }}
            >
              {submitting ? "Rejecting..." : "Reject"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RejectServiceModal;
