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
import Image from "next/image";

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
      <Box sx={{ flex: 1, px: "7.5rem", py: "1.875rem" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            height: { xs: "calc(100vh - 18.75rem)", md: "calc(100vh - 15.625rem)" },
            minHeight: 600,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* Left Panel - Chats List */}
          <Box
            sx={{
              width: { xs: "100%", md: "27.813rem" },
              borderRight: " 0.0625rem solid   #E6E6E6",
              borderColor: "grey.200",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
            }}
          >
            {/* Chats Header */}
            <Box sx={{ p: 2, borderBottom: "0.0625rem solid", borderColor: "grey.200" }}>
              <Typography sx={{ mb: "2rem", color: "primary.normal", fontSize: "2rem", lineHeight: "1.75rem ", fontWeight: 600 }}>
                Chats
              </Typography>
              {/* Search Bar */}


              <Box sx={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                gap: "1.125rem",

              }}  >
                <Box
                  sx={{
                    display: "flex",
                    minWidth:"19.125rem",
                    alignItems: "center",
                    bgcolor: "white",
                    borderRadius: "0.625rem",
                    border: "0.0625rem solid",
                    borderColor: "grey.300",
                    px: "1rem",
                    py: "0.75rem",
                  }}
                >
                  {/* <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: "1.2rem" }} /> */}
                  <Image
                    src={"/icons/Loupe.png"}
                    width={24}
                    height={24}
                    alt="searchIcon"
                    style={{
                      marginRight: "0.625rem"
                    }}
                  />
                  <InputBase
                    placeholder="Search"
                    sx={{
                      flex: 1,
                      fontSize: "0.9rem",

                      "& .MuiInputBase-input": {
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#939393",
                        opacity: 1,
                        fontSize: "1.25rem",
                        m: 0,
                        p: 0
                      },
                    }}
                  />
                </Box>

                <Box sx={{
                  py: "0.75rem",
                  px: "1rem",
                  border: "0.0625rem solid #BECFDA",
                  borderRadius: "0.625rem"
                }} >
                  <Image
                    height={24}
                    width={24}
                    alt="microphone"
                    src={"/icons/Microphone.png"}
                  />
                </Box>
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
                    borderLeft: chat.isActive ? "0.1875rem solid" : "none",
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
                    <Typography sx={{ mb: 0.5, fontWeight: 500, fontSize: "1.125rem", lineHeight: "1.25rem" }}>
                      {chat.name}
                    </Typography>
                    <Typography

                      sx={{
                        color: "#8A8A8A",
                        fontSize: '0.875rem',
                        lineHeight: "140%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chat.lastMessage}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    1 hour ago
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
                borderBottom: "0.0625rem solid",
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
              <Typography sx={{

                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: "600"
              }}>
                {chats.find((c) => c.id === selectedChat)?.name}
              </Typography>
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                justifyContent:"flex-end",
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
                        bgcolor: "#EAF0F3",
                        color: "#0F232F",
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

            <Box sx={{
              px: "1.75rem",
              py: "1.188rem",
              borderTop: "0.0625rem solid",
              borderColor: "#E6E6E6",
            }}  >
              <Box
                sx={{
                  px: "1.25rem",
                  py: "1rem",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#F6F7F7"
                }}
              >
                <Image
                  width={24}
                  height={24}
                  alt="mic"
                  src={"/icons/micGray.png"}
                />
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
                    // bgcolor: "grey.50",
                    // borderRadius: 2,
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                      fontSize: "0.9rem",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#ACADAD",
                      opacity: 1,
                      fontSize: "1rem"

                    },
                  }}
                />
                <Image
                  src={"/icons/attachment-line.png"}
                  alt="file"
                  width={24}
                  height={24}
                />

                <Image
                  onClick={handleSendMessage}
                  src={"/icons/sendMsg.png"}
                  alt="file"
                  width={24}
                  height={24}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>


    </Box>
  );
}

