"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  InputBase,
  useMediaQuery,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { listenUsers } from "@/services/user.service";
import theme from "@/lib/theme";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  getOrCreateThread,
  listenSpecificUsers,
  sendTextMessage,
  subscribeToMessages,
  subscribeToThreads,
} from "@/services/chatFirestore.service";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { NoChatSelected } from "./components/NoChatSelected";
import { UserChat } from "./components/UserChat";
import { ChatMessageItem } from "./components/ChatMessageItem ";
import {
  GetUserApiResponse,
  ProviderInfo,
  UserData,
} from "./components/interfaces";
import { Timestamp } from "firebase/firestore";
import { ChatMessageInput } from "./components/ChatMessageInput";

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
  const { id } = useParams();
  const otherUserId = Array.isArray(id) ? id[0] : id;
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const activeChat = chatUsers.find((c) => c.id === selectedChat);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [userData, setUserData] = useState<UserData | null>(null);
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
  console.log("messages", messages);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<GetUserApiResponse>(
        API_ENDPOINTS.AUTH.GET_USER,
      );

      if (response.success && response.data) {
        const apiData = response.data;
        if (apiData.data?.user) {
          setUserData(apiData.data.user);
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
  console.log("users", users, selectedChat);
  // console.log("userdata", userData, otherUserId);
  useEffect(() => {
    if (!userData || !otherUserId) return;

    (async () => {
      const threadId = await getOrCreateThread(userData.id, otherUserId);

      setSelectedChat(threadId);
    })();
  }, [userData, otherUserId]);

  useEffect(() => {
    if (chatUsers.length === 0 || !userData) return;

    // Extract all unique 'other' user IDs from all your threads
    const participantIds = chatUsers.reduce((acc: string[], thread) => {
      const otherId = thread.participantIds.find(
        (id: string) => id !== userData.id,
      );
      if (otherId && !acc.includes(otherId)) {
        acc.push(otherId);
      }
      return acc;
    }, []);

    if (participantIds.length === 0) return;

    // Only listen to these specific users
    const unsubscribe = listenSpecificUsers(participantIds, (fetchedUsers) => {
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [chatUsers, userData?.id]); // Runs whenever the thread list updates

  const activeUser = React.useMemo(() => {
    if (!activeChat || !userData) return null;

    const otherId = activeChat.participantIds.find(
      (id: string) => id !== userData.id,
    );

    const userInList = users.find((u) => u.user_id === otherId);
    const meta = activeChat.participantsMeta?.[otherId];

    return {
      name: userInList?.name || meta?.name || "Chat",
      avatarUrl: userInList?.avatarUrl || meta?.avatarUrl || "",
    };
  }, [activeChat, userData, users]); // Keeps the header in sync
  console.log("activeUser", activeUser, activeChat);

  useEffect(() => {
    if (!selectedChat || !userData) return;

    const unsubscribe = subscribeToMessages(
      selectedChat,
      (firebaseMessages) => {
        const mapped = firebaseMessages.map((msg) => {
          const isMe = msg.senderId === userData.id;

          // 1. Try to get avatar from the Thread Metadata
          let photo = activeChat?.participantsMeta?.[msg.senderId]?.avatarUrl;

          // 2. FALLBACK: If Thread Meta is empty, find the user in your 'users' state
          if (!photo) {
            const userInList = users.find((u) => u.user_id === msg.senderId);
            photo = userInList?.avatarUrl;
          }
          return {
            id: msg.id,
            text: msg.text,
            sender: (msg.senderId === userData.id ? "user" : "other") as
              | "user"
              | "other",
            // createdAt: msg.createdAt,
            createdAt: msg.createdAt
              ? msg.createdAt instanceof Timestamp
                ? msg.createdAt.toDate().toISOString()
                : new Date(msg.createdAt).toISOString()
              : "",
            photoURL: photo,
          };
        });

        // console.log("firebaseMessages", firebaseMessages, mapped);
        setMessages(mapped);
      },
    );

    return () => unsubscribe();
  }, [selectedChat, userData]);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = subscribeToThreads(userData.id, setChatUsers);

    return () => unsubscribe();
  }, [userData]);

  const handleSendMessage = async () => {
    if (!messageInput.replace(/\s/g, "").length || !userData || !selectedChat)
      return;

    const textToSend = messageInput; // Don't trim the actual content
    setMessageInput(""); // Clear immediately for Optimistic UI

    try {
      const receiverId = activeChat.participantIds.find(
        (id: string) => id !== userData.id,
      );
      if (!receiverId) return;
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

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        height: "100vh",
        display: "flex",
        // overflow:"auto",
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
            // flex:1,
            height: {
              xs: "calc(100vh - 18.75rem)",
              md: "calc(100vh - 7.625rem)",
            },
            // height:"100%",
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
                      (id: string) => id !== userData?.id,
                    );

                    // 1. Get initial meta from thread
                    const otherUserMeta = chat.participantsMeta?.[otherUserId];

                    // 2. FALLBACK: Check the global 'users' state for the real avatar
                    const userInList = users.find(
                      (u) => u.user_id === otherUserId,
                    );

                    const displayAvatar =
                      userInList?.avatarUrl || otherUserMeta?.avatarUrl || "";
                    const displayName =
                      userInList?.name || otherUserMeta?.name || "Chat";

                    const isActive = selectedChat === chat.id;

                    return (
                      <UserChat
                        key={chat.id}
                        chat={chat}
                        setSelectedChat={setSelectedChat}
                        isActive={isActive}
                        userData={userData}
                        // Pass the enriched data here
                        otherUser={{
                          ...otherUserMeta,
                          name: displayName,
                          avatarUrl: displayAvatar,
                        }}
                      />
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
                      <ChatMessageItem
                        key={message.id}
                        message={{
                          ...message,
                          createdAt: new Date(message.createdAt),
                        }}
                      />
                    ))}
                  </Box>

                  {/* Message Input */}
                  {/* <Box
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
                          e: React.KeyboardEvent<HTMLInputElement>,
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
                  </Box> */}
                  <ChatMessageInput
                    value={messageInput}
                    onChange={setMessageInput}
                    onSend={handleSendMessage}
                  />
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
