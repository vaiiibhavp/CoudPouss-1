import { Box, Typography } from "@mui/material";

export const CancelServiceConfirmation = () => {
  return (
    <Box>
      <Typography
        fontSize={{ xs: 12, sm: 12 }}
        fontWeight={400}
        lineHeight={"150%"}
        height={"56px"}
        sx={{
          alignItems: "center",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Since you are cancelling more than 48 hours ahead of time, a full refund
        will be processed for your payment.
      </Typography>

      {/* Buttons */}
    </Box>
  );
};
