import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Rating,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";
import Image from "next/image";

interface RejectServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  onReject: () => void;
  service_id: string;
  data: ProviderInfo;
}

interface ProviderInfo {
  email: string;
  first_name: string;
  full_name: string;
  id: string;
  is_favorate: boolean;
  is_verified: boolean;
  last_name: string;
  profile_photo_url: string | null;
  profile_image_url: string | null;
}
export const RatingReviewModal = ({
  open,
  onClose,
  onReject,
  service_id,
  data,
}: RejectServiceRequestModalProps) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    reliability: 0,
    punctuality: 0,
    solution: 0,
    payout: 0,
    work_quality: 0,
  });
  const [step, setStep] = useState(1);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState<{
    rating?: string;
    review?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MIN_REVIEW_LENGTH = 1;
  const MAX_REVIEW_LENGTH = 200;

  const hasAnyRating = Object.values(ratings).every((v) => v > 0);

  const isReviewValid = review.trim().length >= MIN_REVIEW_LENGTH;

  const isFormValid = hasAnyRating && isReviewValid;

  const handleRatingChange = (key: string, value: number | null) => {
    setRatings((prev) => ({ ...prev, [key]: value || 0 }));
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!hasAnyRating) {
      newErrors.rating = "Please provide at least one rating.";
    }

    if (!review.trim()) {
      newErrors.review = "Review is required.";
    } else if (!isReviewValid) {
      newErrors.review = `Review must be at least ${MIN_REVIEW_LENGTH} characters.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      rating: {
        ...ratings,
        service_id,
      },
      review: {
        review_description: review.trim(),
        service_id,
      },
    };
    console.log("payload", payload);

    try {
      setIsSubmitting(true);

      const response = await apiPost(
        `${API_ENDPOINTS.RATING.CREATE_RATING}?type=both`,
        payload,
      );

      if (response?.success) {
        setStep(2);
      } else {
        // console.log("response", response);
        toast.error(response.error?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Rating API error:", error);
      //   toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setRatings({
        overall: 0,
        reliability: 0,
        punctuality: 0,
        solution: 0,
        payout: 0,
        work_quality: 0,
      });
      setReview("");
      setErrors({});
      setIsSubmitting(false);
      setStep(1);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      disableEscapeKeyDown={isSubmitting}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1rem",
          p: 2,
        },
      }}
    >
      <DialogContent>
        {step === 1 && (
          <>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize="22px" fontWeight={600} color="#2C6587">
                We greatly value your feedback
              </Typography>
              <IconButton
                size="small"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography fontSize="16px" mt={1} mb={2} fontWeight={500}>
              How do you rate {data.full_name ?? ""}?
            </Typography>

            {/* Ratings */}
            {[
              { label: "Overall Service", key: "overall" },
              { label: "Reliability", key: "reliability" },
              { label: "Punctuality", key: "punctuality" },
              { label: "Solution", key: "solution" },
              { label: "Payout", key: "payout" },
              { label: "Work Quality", key: "work_quality" },
            ].map((item) => (
              <Box
                key={item.key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1.25}
              >
                <Typography fontSize="0.875rem">{item.label}</Typography>
                <Rating
                  value={ratings[item.key as keyof typeof ratings]}
                  onChange={(_, value) => handleRatingChange(item.key, value)}
                />
              </Box>
            ))}

            {errors.rating && (
              <Typography fontSize="0.75rem" color="error" mt={0.5}>
                {errors.rating}
              </Typography>
            )}

            {/* Review */}
            <Typography fontSize="0.875rem" mt={2} mb={0.75}>
              Please share your experience
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write your review here..."
              value={review}
              error={Boolean(errors.review)}
              helperText={
                errors.review
                // ||`${review.length}/${MIN_REVIEW_LENGTH} characters minimum`
              }
              onChange={(e) => {
                const value = e.target.value;

                setReview(value);

                setErrors((prev) => ({
                  ...prev,
                  review:
                    value.trim().length === 0
                      ? "Review is required"
                      : value.trim().length > MAX_REVIEW_LENGTH
                        ? "Maximum 200 characters allowed"
                        : undefined,
                }));
              }}
            />

            {/* Submit */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              sx={{
                mt: 3,
                bgcolor: "#1F4C64",
                borderRadius: "0.75rem",
                py: 1.25,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#163A4D",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Submit"
              )}
            </Button>
            {/* <Button onClick={() => setStep(2)}>step 2</Button> */}
          </>
        )}
        {step === 2 && (
          <Box sx={{ textAlign: "center" }}>
            <Box mb={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Image
                src={"/icons/success_rating.png"}
                alt="logo"
                height={60}
                width={60}
              />
            </Box>

            {/* Title */}
            <Typography fontSize="1.25rem" fontWeight={600} mb={1}>
              Thank you for your review!
            </Typography>

            {/* Subtitle */}
            <Typography
              fontSize="0.875rem"
              color="#424242"
              mb={3}
              fontWeight={500}
            >
              We appreciated you taking the time to reflect on your experience
            </Typography>

            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: "#1F4C64",
                borderRadius: "0.75rem",
                py: 1.25,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#163A4D",
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
