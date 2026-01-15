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
  useMediaQuery,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { createChat, listenUserChats } from "@/services/chat.service";
import {
  sendMessage,
  listenMessages,
  ChatMessage,
} from "@/services/message.service";
import { listenUsers } from "@/services/user.service";
import { seedChatsForUser } from "@/services/seedChats";
import theme from "@/lib/theme";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

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
interface UIMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  createdAt: string;
  photoURL?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const activeChat = chatUsers.find((c) => c.id === selectedChat);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const firebaseUser = useSelector(
    (state: RootState) => state?.auth?.firebaseUser
  );

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const formatTime = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("chatUsers", chatUsers, activeChat, messages);
  console.log("firebaseUser", firebaseUser, users, selectedChat);

  useEffect(() => {
    const unsubscribe = listenUsers(setUsers);
    return () => unsubscribe();
  }, []);
  const activeUser = React.useMemo(() => {
    if (!activeChat || !firebaseUser) return null;

    const otherUserId = activeChat.participants.find(
      (uid: string) => uid !== firebaseUser.uid
    );

    return users.find((u) => u.uid === otherUserId);
  }, [activeChat, users, firebaseUser]);

  // useEffect(() => {
  //   if (!selectedChat && chatUsers.length > 0) {
  //     setSelectedChat(chatUsers[0].id);
  //   }
  // }, [chatUsers, selectedChat]);

  // useEffect(() => {
  //   if (!firebaseUser) return;

  //   // ⚠️ RUN ONLY ONCE, THEN DELETE
  //   seedChatsForUser(firebaseUser.uid);
  // }, [firebaseUser]);

  useEffect(() => {
    if (!selectedChat || !firebaseUser) return;

    const unsubscribe = listenMessages(selectedChat, (firebaseMessages) => {
      const mapped = firebaseMessages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.senderId === firebaseUser.uid ? "user" : "other",
        createdAt: msg.createdAt,
      }));

      setMessages(mapped);
    });

    return () => unsubscribe();
  }, [selectedChat, firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) return;

    const unsubscribe = listenUserChats(firebaseUser.uid, (chats) => {
      setChatUsers(chats);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  // useEffect(() => {
  //   if (!selectedChat && chatUsers.length > 0) {
  //     setSelectedChat(chatUsers[0].id);
  //   }
  // }, [chatUsers, selectedChat]);

  const handleSendMessage = async () => {
    console.log("messageInput", messageInput, firebaseUser, selectedChat);

    if (!messageInput.trim() || !firebaseUser || !selectedChat) return;

    await sendMessage(selectedChat, firebaseUser.uid, messageInput.trim());
    setMessageInput("");
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Chat Content */}
      <Box sx={{ flex: 1, px: { xs: "0.5rem", sm: "7.5rem" }, py: "1.875rem" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            height: {
              xs: "calc(100vh - 18.75rem)",
              md: "calc(100vh - 15.625rem)",
            },
            minHeight: 600,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {/* Left Panel - Chats List */}
          {(!isMobile || selectedChat === null) && (
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
              <Box
                sx={{
                  p: 2,
                  borderBottom: "0.0625rem solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  sx={{
                    mb: "2rem",
                    color: "primary.normal",
                    fontSize: "2rem",
                    lineHeight: "1.75rem ",
                    fontWeight: 600,
                  }}
                >
                  Chats
                </Typography>
                {/* Search Bar */}

                <Box
                  sx={{
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                    gap: "1.125rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      minWidth: "19.125rem",
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
                        marginRight: "0.625rem",
                      }}
                    />
                    <InputBase
                      placeholder="Search"
                      sx={{
                        flex: 1,
                        fontSize: "0.9rem",

                        "& .MuiInputBase-input": {},
                        "& .MuiInputBase-input::placeholder": {
                          color: "#939393",
                          opacity: 1,
                          fontSize: "1.25rem",
                          m: 0,
                          p: 0,
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      py: "0.75rem",
                      px: "1rem",
                      border: "0.0625rem solid #BECFDA",
                      borderRadius: "0.625rem",
                    }}
                  >
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
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {chatUsers.map((chat) => {
                  const otherUserId = chat.participants.find(
                    (uid: string) => uid !== firebaseUser?.uid
                  );

                  const otherUser = users.find((u) => u.uid === otherUserId);

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
                        bgcolor:
                          selectedChat === chat.id ? "grey.100" : "transparent",
                        borderLeft:
                          selectedChat === chat.id ? "3px solid" : "none",
                        borderColor: "primary.main",
                      }}
                    >
                      <Avatar src={otherUser?.photoURL}>
                        {otherUser?.displayName?.[0]}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Top row: name + time */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Typography fontWeight={500} noWrap>
                            {otherUser?.displayName || "User"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.primary"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {formatTime(chat?.updatedAt) || ""}
                          </Typography>
                        </Box>

                        {/* Bottom row: last message */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {chat.lastMessage || "No messages yet"}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Right Panel - Chat Conversation */}
          {(!isMobile || selectedChat !== null) && (
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
                  gap: { xs: 1, sm: 2 },
                }}
              >
                {isMobile && (
                  <IconButton
                    sx={{ p: 0 }}
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                )}

                <Avatar src={activeUser?.photoURL} />

                <Typography fontWeight={600}>
                  {activeUser?.displayName || "Chat"}
                </Typography>
              </Box>

              {/* Messages Area */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1.5,
                      flexDirection:
                        message.sender === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <Avatar
                      src={message.photoURL}
                      sx={{ width: 36, height: 36 }}
                    />

                    <Box
                      sx={{
                        maxWidth: "70%",
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                          message.sender === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor:
                            message.sender === "user" ? "#F5F5F5" : "#EAF0F3",
                          color: "#0F232F",
                          maxWidth: "100%",
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>

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
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatTime(message.createdAt)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Message Input */}

              <Box
                sx={{
                  px: "1.75rem",
                  py: "1.188rem",
                  borderTop: "0.0625rem solid",
                  borderColor: "#E6E6E6",
                }}
              >
                <Box
                  sx={{
                    px: "1.25rem",
                    py: "1rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#F6F7F7",
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
                        fontSize: "1rem",
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
          )}
        </Paper>
      </Box>
    </Box>
  );
}
