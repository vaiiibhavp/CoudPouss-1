import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCaJW9Jfp24frBvzFHoCz-fOQLTmgE6XXM",
//   authDomain: "chat-app-586f5.firebaseapp.com",
//   projectId: "chat-app-586f5",
//   storageBucket: "chat-app-586f5.firebasestorage.app",
//   messagingSenderId: "579428998104",
//   appId: "1:579428998104:web:afee317065a1ee06fc70ad",
//   measurementId: "G-H5GCRVMT0Z",
// };

const firebaseConfig = {
  apiKey: "AIzaSyD7i9MXtBqteZd3NdV6yBomTB8q50MVMiA",
  authDomain: "coudpouss-b213b.firebaseapp.com",
  projectId: "coudpouss-b213b",
  storageBucket: "coudpouss-b213b.firebasestorage.app",
  messagingSenderId: "912798241934",
  appId: "1:912798241934:web:4c2a9c006cb2ed9cbb65df",
  measurementId: "G-1K2KZ7SH1P",
};

// const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
