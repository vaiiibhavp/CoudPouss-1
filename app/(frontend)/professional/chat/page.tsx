"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { listenUsers } from "@/services/user.service";
import theme from "@/lib/theme";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  buildThreadId,
  ensureThreadDocument,
  sendTextMessage,
  subscribeToMessages,
  subscribeToThreads,
} from "@/services/chatFirestore.service";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

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
interface GetUserApiResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
    provider_info?: ProviderInfo;
    past_work_files?: string[];
  };
}
interface UserData {
  id: string;
  email: string;
  phone_number: string;
  password: string;
  address: string;
  longitude: number | null;
  created_at: string;
  lang: string;
  first_name: string;
  phone_country_code: string;
  last_name: string;
  role: string;
  service_provider_type: string | null;
  profile_photo_id: string | null;
  profile_photo_url: string | null;
  latitude: number | null;
  is_deleted: boolean;
  updated_at: string;
}

interface ProviderInfo {
  id: string;
  services_provider_id: string;
  bio?: string;
  experience_speciality?: string;
  achievements?: string;
  years_of_experience?: number;
  is_docs_verified: boolean;
  docs_status: string;
  [key: string]: any;
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
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [pastWorkFiles, setPastWorkFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (ts: any) => {
    if (!ts) return "";
    if (typeof ts === "string") return ts;
    if (ts.toDate)
      return ts.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return "";
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<GetUserApiResponse>(
        API_ENDPOINTS.AUTH.GET_USER
      );

      if (response.success && response.data) {
        const apiData = response.data;
        if (apiData.data?.user) {
          setUserData(apiData.data.user);
          // Update role in localStorage if needed
          if (apiData.data.user.role) {
            localStorage.setItem("role", apiData.data.user.role);
          }
          // Set provider info if available
          if (apiData.data.provider_info) {
            setProviderInfo(apiData.data.provider_info);
          }
          // Set past work files if available
          if (
            apiData.data.past_work_files &&
            Array.isArray(apiData.data.past_work_files)
          ) {
            setPastWorkFiles(apiData.data.past_work_files);
          }
        } else {
          setError("User data not found");
        }
      } else {
        setError("Failed to load user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  console.log("chatUsers", chatUsers, userData);
  console.log("firebaseUser", firebaseUser, users, selectedChat, user);

  useEffect(() => {
    const unsubscribe = listenUsers(setUsers);
    return () => unsubscribe();
  }, []);

  const activeUser = React.useMemo(() => {
    if (!activeChat || !userData) return null;

    const otherUserId = activeChat.participantIds.find(
      (id: string) => id !== userData.id
    );

    return activeChat.participantsMeta?.[otherUserId] || null;
  }, [activeChat, userData]);

  // useEffect(() => {
  //   seedUsers();
  // }, []);
  useEffect(() => {
    if (!selectedChat || !userData) return;

    const unsubscribe = subscribeToMessages(
      selectedChat,
      (firebaseMessages) => {
        console.log("firebaseMessages", firebaseMessages, userData.id);

        const mapped = firebaseMessages.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === userData.id ? "user" : "other",
          createdAt: msg.createdAt,
        }));

        setMessages(mapped);
      }
    );

    return () => unsubscribe();
  }, [selectedChat, userData]);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = subscribeToThreads(userData.id, setChatUsers);

    return () => unsubscribe();
  }, [userData]);

  // useEffect(() => {
  //   if (!selectedChat && chatUsers.length > 0) {
  //     setSelectedChat(chatUsers[0].id);
  //   }
  // }, [chatUsers, selectedChat]);

  const handleSendMessage = async () => {
    // Use a regex to check if the message contains at least one non-whitespace character
    if (!messageInput.replace(/\s/g, "").length || !userData || !selectedChat)
      return;

    const textToSend = messageInput; // Don't trim the actual content
    setMessageInput(""); // Clear immediately for Optimistic UI

    try {
      const receiverId = activeChat.participantIds.find(
        (id: string) => id !== userData.id
      );

      await sendTextMessage({
        threadId: selectedChat,
        text: textToSend, // Send the raw text with newlines/spaces
        senderId: userData.id,
        receiverId,
      });
    } catch (error) {
      console.error("Failed to send:", error);
      setMessageInput(textToSend); // Restore on error
    }
  };

  const handleStartChat = async (otherUser: any) => {
    console.log("userData", userData);

    if (!userData) return;

    const threadId = buildThreadId(userData.id, otherUser.user_id);

    await ensureThreadDocument(threadId, [
      {
        user_id: userData.id,
        name: userData.first_name + " " + userData.last_name,
        avatarUrl: userData.profile_photo_url || "",
      },
      {
        user_id: otherUser.user_id,
        name: otherUser.name,
        avatarUrl: otherUser.avatarUrl,
      },
    ]);

    setSelectedChat(threadId);
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
                {chatUsers.length === 0 ? (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      No conversations yet
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Start a conversation to see it here
                    </Typography>
                  </Box>
                ) : (
                  chatUsers.map((chat) => {
                    const otherUserId = chat.participantIds.find(
                      (id: string) => id !== userData?.id
                    );

                    const otherUser = chat.participantsMeta?.[otherUserId];
                    const isActive = selectedChat === chat.id;
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
                                color: isActive
                                  ? "primary.main"
                                  : "text.secondary",
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
                              color: isActive
                                ? "text.primary"
                                : "text.secondary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.85rem",
                              // If the user sent the last message, prefix it
                              fontWeight:
                                chat.lastMessageSenderId !== userData?.id &&
                                isActive
                                  ? 600
                                  : 400,
                            }}
                          >
                            {chat.lastMessageSenderId === userData?.id
                              ? "You: "
                              : ""}
                            {chat.lastMessage || "No messages yet"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
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
              {selectedChat ? (
                <>
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

                    <Avatar src={activeUser?.avatarUrl} />

                    <Typography fontWeight={600}>
                      {activeUser?.name || "Chat"}
                    </Typography>
                  </Box>

                  {/* Messages Area */}
                  <Box
                    ref={scrollRef}
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
                              message.sender === "user"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor:
                                message.sender === "user"
                                  ? "#F5F5F5"
                                  : "#EAF0F3",
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
                        placeholder="Type a message..."
                        value={messageInput}
                        multiline // Allows box to grow
                        maxRows={4} // Limits height for long messages
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMessageInput(e.target.value)
                        }
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevents new line
                            handleSendMessage(); // Calls your send logic
                          }
                        }}
                        sx={{
                          flex: 1,
                          px: 1,
                          py: 0.5,
                          "& .MuiInputBase-input": {
                            color: "text.primary",
                            fontSize: "0.95rem",
                            lineHeight: "1.5",
                            scrollbarWidth: "none", // Hide scrollbar for clean look
                            "&::-webkit-scrollbar": { display: "none" },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#9CA3AF",
                            opacity: 1,
                            fontSize: "0.95rem",
                            fontStyle: "italic", // Optional: modern apps often use subtle italics
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
                </>
              ) : (
                <NoChatSelected />
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

const NoChatSelected = () => (
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
