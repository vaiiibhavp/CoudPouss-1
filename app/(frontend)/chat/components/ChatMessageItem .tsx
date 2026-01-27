import { Avatar, Box, Paper, Typography } from "@mui/material";
import { formatDateString, formatTime } from "@/utils/utils";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  createdAt: Date | number | string;
  photoURL?: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.sender === "user";
  

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1.5,
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Avatar src={message.photoURL} sx={{ width: 36, height: 36 }} />

      <Box
        sx={{
          maxWidth: "70%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? "#F5F5F5" : "#EAF0F3",
            color: "#0F232F",
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" fontSize={16}>
            {message.text}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: 10,
                whiteSpace: "nowrap",
              }}
            >
              {formatDateString(message.createdAt,'hh:mm A')}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
