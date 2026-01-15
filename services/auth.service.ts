import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

/**
 * Sign up user using Firebase Auth
 */
export const signup = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.email?.split("@")[0] || "",
    photoURL: "",
    createdAt: serverTimestamp(),
  });

  return res;
};

/**
 * Listen to Firebase auth state changes
 * Returns unsubscribe function
 */
export const listenAuth = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
