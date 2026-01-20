import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const listenFirebaseAuth = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
