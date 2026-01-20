import { db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp, query, collection, where, orderBy, onSnapshot } from "firebase/firestore"

export const createChat = async (userA: string, userB: string) => {
  const chatId = [userA, userB].sort().join("_")

  await setDoc(
    doc(db, "chats", chatId),
    {
      participants: [userA, userB],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return chatId
}


export const listenUserChats = (
  uid: string,
  callback: (chats: any[]) => void
) => {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid),
    // orderBy("updatedAt", "desc")
  )

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(chats)
  })
}