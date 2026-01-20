import { Box, Typography } from "@mui/material";
import Image from "next/image";

export const NoChatSelected = () => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#F8F9FA", // Light neutral background
      textAlign: "center",
      p: 3,
    }}
  >
    <Box
      sx={{
        width: 120,
        height: 120,
        bgcolor: "primary.light",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
        opacity: 0.8,
      }}
    >
      <Image
        src="/icons/sendMsg.png"
        width={60}
        height={60}
        alt="Select Chat"
        style={{ opacity: 0.5 }}
      />
    </Box>
    <Typography variant="h5" fontWeight={600} gutterBottom>
      Your Messages
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300 }}>
      Select a conversation from the left to start chatting or view your
      history.
    </Typography>
  </Box>
);