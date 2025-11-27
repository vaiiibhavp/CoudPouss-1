"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  isActive: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  avatar: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string>("emily");
  const [messageInput, setMessageInput] = useState("");

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedInitial = localStorage.getItem("userInitial");
    const storedEmail = localStorage.getItem("userEmail");

    // If user details are not present, redirect to login
    if (!storedInitial || !storedEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  // Chat list data
  const chats: Chat[] = [
    {
      id: "emily",
      name: "Emily Johnson",
      avatar: "/icons/testimonilas-1.png",
      lastMessage: "I really appreciated your........",
      isActive: true,
    },
    {
      id: "susie",
      name: "Susie Howell",
      avatar: "/icons/testimonilas-2.png",
      lastMessage: "Do you think we could desi...",
      isActive: false,
    },
    {
      id: "robert",
      name: "Robert Fox",
      avatar: "/icons/testimonilas-1.png",
      lastMessage: "Hi, How are you? What's going on....",
      isActive: false,
    },
    {
      id: "alex",
      name: "Alex Martin",
      avatar: "/icons/testimonilas-2.png",
      lastMessage: "Hi, How are you? What's going on....",
      isActive: false,
    },
    {
      id: "ronald",
      name: "Ronald Richards",
      avatar: "/icons/testimonilas-1.png",
      lastMessage: "Hi, How are you? What's going on...",
      isActive: false,
    },
  ];

  // Messages data for selected chat
  const messages: Message[] = [
    {
      id: "1",
      text: "Thanks too. I'm also good. Both is going good also.",
      sender: "other",
      avatar: "/icons/testimonilas-1.png",
      timestamp: "1:29 PM",
    },
    {
      id: "2",
      text: "Hi Jordan Smith! 👋 How are you today? I appreciate your response. Let's finalize the terms.",
      sender: "user",
      avatar: "/icons/testimonilas-2.png",
      timestamp: "4:27 PM",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implement message sending logic
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      

      {/* Main Chat Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            height: { xs: "calc(100vh - 300px)", md: "calc(100vh - 250px)" },
            minHeight: 600,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* Left Panel - Chats List */}
          <Box
            sx={{
              width: { xs: "100%", md: 350 },
              borderRight: { xs: "none", md: "1px solid" },
              borderColor: "grey.200",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
            }}
          >
            {/* Chats Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Chats
              </Typography>
              {/* Search Bar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.300",
                  px: 1.5,
                  py: 1,
                }}
              >
                <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: "1.2rem" }} />
                <InputBase
                  placeholder="Search"
                  sx={{
                    flex: 1,
                    fontSize: "0.9rem",
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "text.secondary",
                      opacity: 1,
                    },
                  }}
                />
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <MicIcon sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </Box>
            </Box>

            {/* Chats List */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {chats.map((chat) => (
                <Box
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                    bgcolor: chat.isActive ? "grey.100" : "transparent",
                    borderLeft: chat.isActive ? "3px solid" : "none",
                    borderColor: chat.isActive ? "primary.main" : "transparent",
                    "&:hover": {
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  <Avatar
                    src={chat.avatar}
                    alt={chat.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                      {chat.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chat.lastMessage}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    Image
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Panel - Chat Conversation */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              overflow: "hidden",
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={chats.find((c) => c.id === selectedChat)?.avatar}
                alt={chats.find((c) => c.id === selectedChat)?.name}
                sx={{ width: 50, height: 50 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {chats.find((c) => c.id === selectedChat)?.name}
              </Typography>
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                bgcolor: "grey.50",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Date Separator */}
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  my: 1,
                  fontSize: "0.8rem",
                }}
              >
                December 12, 2022
              </Typography>

              {/* Messages */}
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    flexDirection: message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    src={message.avatar}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: message.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender === "user" ? "grey.200" : "primary.light",
                        color: message.sender === "user" ? "text.primary" : "white",
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        mt: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton sx={{ color: "text.secondary" }}>
                <MicIcon />
              </IconButton>
              <InputBase
                placeholder="Send a message here..."
                value={messageInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessageInput(e.target.value)
                  }
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                sx={{
                  flex: 1,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  "& .MuiInputBase-input": {
                    color: "text.primary",
                    fontSize: "0.9rem",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.secondary",
                    opacity: 1,
                  },
                }}
              />
              <IconButton sx={{ color: "text.secondary" }}>
                <AttachFileIcon />
              </IconButton>
              <IconButton
                onClick={handleSendMessage}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>


    </Box>
  );
}

