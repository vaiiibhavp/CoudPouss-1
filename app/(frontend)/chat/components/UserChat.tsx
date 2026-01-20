import { formatTime } from "@/utils/utils";
import { Avatar, Box, Typography } from "@mui/material";

interface OtherUser {
  name?: string;
  avatarUrl?: string;
}
interface User {
  id: string;
}
interface Chat {
  id: string;
  updatedAt: Date | number;
  lastMessage?: string;
  lastMessageSenderId?: string;
}
interface UserChatProps {
  chat: Chat;
  setSelectedChat: (chatId: string) => void;
  isActive: boolean;
  userData: User | null;
  otherUser: OtherUser | null;
}

export const UserChat = ({
  chat,
  setSelectedChat,
  isActive,
  userData,
  otherUser,
}: UserChatProps) => {
  return (
    <Box
      key={chat.id}
      onClick={() => setSelectedChat(chat.id)}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        position: "relative", // For the active indicator
        bgcolor: isActive ? "grey.100" : "transparent",
        transition: "background-color 0.2s",
        "&:hover": {
          bgcolor: isActive ? "grey.100" : "grey.50",
        },
        "&::after": isActive
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: "15%",
              height: "70%",
              width: "4px",
              bgcolor: "primary.main",
              borderRadius: "0 4px 4px 0",
            }
          : {},
      }}
    >
      <Avatar
        src={otherUser?.avatarUrl}
        sx={{ width: 48, height: 48 }} // Standard size
      >
        {otherUser?.name?.[0] || "?"}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline", // Better alignment for text and time
            mb: 0.5,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={isActive ? 700 : 600}
            noWrap
          >
            {otherUser?.name || "Unknown User"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: isActive ? "primary.main" : "text.secondary",
              fontWeight: isActive ? 600 : 400,
              fontSize: "0.7rem",
            }}
          >
            {formatTime(chat.updatedAt)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: isActive ? "text.primary" : "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.85rem",
            // If the user sent the last message, prefix it
            fontWeight:
              chat.lastMessageSenderId !== userData?.id && isActive ? 600 : 400,
          }}
        >
          {chat.lastMessageSenderId === userData?.id ? "You: " : ""}
          {chat.lastMessage || "No messages yet"}
        </Typography>
      </Box>
    </Box>
  );
};
