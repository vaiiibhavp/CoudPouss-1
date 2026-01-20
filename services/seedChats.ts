import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Creates 10 fake users + chats with current user
 * Run ONLY ONCE for development
 */
export const seedChatsForUser = async (currentUserId: string) => {
  const fakeUsers = Array.from({ length: 10 }).map((_, i) => ({
    uid: `fake_user_${i + 1}`,
    email: `fake${i + 1}@chat.com`,
    displayName: `Chat User ${i + 1}`,
    photoURL: "",
  }));

  for (const user of fakeUsers) {
    // 1️⃣ Create user profile
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    // 2️⃣ Create chat with logged-in user
    const chatId = [currentUserId, user.uid].sort().join("_");

    await setDoc(
      doc(db, "chats", chatId),
      {
        participants: [currentUserId, user.uid],
        lastMessage: "Hello 👋",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  console.log("✅ 10 chat users + chats created");
};
