import { collection, getDocs, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface AppUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export const getAllUsers = async (): Promise<AppUser[]> => {
  const snapshot = await getDocs(collection(db, "users"))
  return snapshot.docs.map((doc) => doc.data() as AppUser)
}

export const listenUsers = (
  callback: (users: any[]) => void
) => {
  const q = query(collection(db, "users"));

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));
    callback(users);
  });
};
