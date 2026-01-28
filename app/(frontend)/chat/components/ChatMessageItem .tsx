import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { formatDateString, formatTime } from "@/utils/utils";
import Image from "next/image";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  createdAt: Date | number | string;
  photoURL?: string;
  attachments: string[];
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.sender === "user";
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState("");

  const handleOpenPreview = (url: string) => {
    setCurrentImg(url);
    setPreviewOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1.5,
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Box
  sx={{
    width: 36,
    height: 36,
    position: "relative",
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
  }}
>
  <Image
    src={
      message.photoURL && message.photoURL.startsWith("http")
        ? message.photoURL
        : "/icons/appLogo.png"
    }
    alt="User avatar"
    fill
    sizes="36px"
    style={{ objectFit: "cover" }}
  />
</Box>

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
          {/* // Inside ChatMessageItem component */}
          {message.attachments && message.attachments.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gap: 0.5,
                gridTemplateColumns:
                  message.attachments.length === 1 ? "1fr" : "1fr 1fr",
                mb: message.text ? 1 : 0,
              }}
            >
              {message.attachments.map((fullUrl, index) => (
                <Box
                  onClick={() => handleOpenPreview(fullUrl)}
                  key={index}
                  sx={{
                    position: "relative",
                    width: message.attachments.length === 1 ? "250px" : "140px",
                    height:
                      message.attachments.length === 1 ? "250px" : "140px",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <ChatImage src={fullUrl} />
                </Box>
              ))}
            </Box>
          )}
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
              {formatDateString(message.createdAt, "hh:mm A")}
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={() => setPreviewOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
          <img
            src={currentImg}
            alt="Preview"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

const ChatImage = ({ src }: { src: string }) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Image
        src={error || !src ? "/icons/appLogo.png" : src}
        alt="attachment"
        fill
        sizes="(max-width: 768px) 150px, 250px" // Production: hint to browser for correct resolution
        style={{
          objectFit: error ? "contain" : "cover",
          padding: error ? "20px" : "0px",
          opacity: isLoading ? 0 : 1, // Prevent partial load flash
          transition: "opacity 0.3s ease-in-out",
        }}
        unoptimized={src?.startsWith("http://")}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && !error && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "#eee",
            // Add a shimmer animation here if you have one
          }}
        />
      )}
    </>
  );
};
