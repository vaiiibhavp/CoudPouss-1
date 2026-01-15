import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export const createUserDoc = async (user: User | null): Promise<void> => {
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
};
