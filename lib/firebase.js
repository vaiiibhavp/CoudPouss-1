import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaJW9Jfp24frBvzFHoCz-fOQLTmgE6XXM",
  authDomain: "chat-app-586f5.firebaseapp.com",
  projectId: "chat-app-586f5",
  storageBucket: "chat-app-586f5.firebasestorage.app",
  messagingSenderId: "579428998104",
  appId: "1:579428998104:web:afee317065a1ee06fc70ad",
  measurementId: "G-H5GCRVMT0Z",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
