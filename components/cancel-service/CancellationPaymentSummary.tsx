import { formatDisplayNumber } from "@/utils/utils";
import { Box, Typography } from "@mui/material";

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
interface CancellationPaymentSummaryProps {
  serviceBreakdown?: CancellationBreakdown;
}

export const CancellationPaymentSummary = ({
  serviceBreakdown,
}: CancellationPaymentSummaryProps) => {
  if (!serviceBreakdown) return null;

  const { total_amount, service_fee, total_refund, is_within_48_hours } =
    serviceBreakdown;
  return (
    <>
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #E6E6E6",
          p: { xs: "12px", sm: "13px 16px" },
          display: "flex",
          gap: "16px",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Typography
          fontWeight={600}
          fontSize={{ xs: 16, sm: 18 }}
          textAlign={"left"}
        >
          Payment Breakdown
        </Typography>
        <Box sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
          <Box
            width={"100%"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={{ xs: 12, sm: 14 }}
              sx={{ color: "#595959" }}
            >
              Finalized Quote Amount{" "}
            </Typography>
            <Typography
              fontWeight={600}
              fontSize={{ xs: 12, sm: 14 }}
              sx={{ color: "#595959" }}
            >
              €{formatDisplayNumber(total_amount, true)}
            </Typography>
          </Box>
          <Box
            width={"100%"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={{ xs: 12, sm: 14 }}
              sx={{ color: "#595959" }}
            >
              Service Fee{" "}
              <Box
                component={"span"}
                fontWeight={400}
                fontSize={{ xs: 10, sm: 11 }}
              >
                (5%)
              </Box>
            </Typography>
            <Typography
              fontWeight={600}
              fontSize={{ xs: 12, sm: 14 }}
              sx={{ color: "#595959" }}
            >
              €{formatDisplayNumber(service_fee, true)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            borderTop: "1px dashed #2C6587",
          }}
        />

        <Box
          width={"100%"}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography
            fontSize={{ xs: 16, sm: 20 }}
            fontWeight={600}
            // sx={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            Total
            <Box
              component={"span"}
              fontSize={{ xs: 10, sm: 11 }}
              fontWeight={400}
              pl={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              (final amount you will get)
            </Box>
          </Typography>
          <Typography
            fontSize={{ xs: 16, sm: 20 }}
            fontWeight={600}
            sx={{ color: "#2C6587" }}
          >
            €{formatDisplayNumber(total_refund, true)}
          </Typography>
        </Box>
      </Box>
      <Box width={"100%"}>
        {is_within_48_hours && (
          <Typography
            fontSize={{ xs: 10, sm: 12 }}
            fontWeight={400}
            sx={{ color: "#555555" }}
          >
            This cancellation is happening less than 48 hours before the
            scheduled service time. According to policy, your payment will not
            be fully refunded. A 5% service fee will also be charged.
          </Typography>
        )}
      </Box>
    </>
  );
};
