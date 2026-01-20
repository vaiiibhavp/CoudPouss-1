// src/services/message.service.ts

import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

/* ---------------- TYPES ---------------- */

export interface ChatMessage {
  createdAt: any
  id: string
  text: string
  senderId: string
}

/* ---------------- SEND MESSAGE ---------------- */

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  const messagesRef = collection(db, "chats", chatId, "messages")
  console.log('chatId', chatId, senderId, text);


  await addDoc(messagesRef, {
    text,
    senderId,
    createdAt: serverTimestamp(),
  })

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    updatedAt: serverTimestamp(),
  })
}

/* ---------------- LISTEN MESSAGES ---------------- */

export const listenMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ChatMessage, "id">),
    }))

    callback(messages)
  })

  return unsubscribe
}
