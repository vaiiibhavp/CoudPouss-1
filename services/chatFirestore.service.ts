import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '@/lib/firebase';

/* =======================
   Types
======================= */

export type FirestoreUser = {
  user_id: string;
  name: string;
  email?: string;
  mobile?: string;
  role?: string;
  address?: string;
  avatarUrl?: string;
};

export type ChatThread = {
  id: string;
  participantIds: string[];
  participantsMeta?: Record<
    string,
    { name?: string; email?: string; avatarUrl?: string }
  >;
  lastMessage?: string;
  lastMessageSenderId?: string;
  updatedAt?: Timestamp | null;
};

export type ChatMessage = {
  attachments: never[];
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt?: Timestamp | null;
  type: 'text';
};

/* =======================
   Constants
======================= */

const USERS_COLLECTION = 'users';
const THREADS_COLLECTION = 'threads';
const MESSAGES_SUBCOLLECTION = 'messages';

/* =======================
   Utils
======================= */

export const buildThreadId = (first: string, second: string) =>
  [first, second].sort().join('__');

/* =======================
   User
======================= */
interface CreateOrUpdateUserParams {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  fcmToken?: string | null;
}

export const createOrUpdateUser = async (data: CreateOrUpdateUserParams) => {
  if (!data.userId) return;

  // We manually point to the document named after your SQL ID
  const userRef = doc(db, "users", String(data.userId));

  const userData = {
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
    avatarUrl: data.avatarUrl,
    updatedAt: serverTimestamp(),
  };

  // This creates the user record if it doesn't exist
  await setDoc(userRef, userData, { merge: true });
};
export async function upsertUserProfile(user: FirestoreUser) {
  if (!user?.user_id) return;

  const userRef = doc(db, USERS_COLLECTION, user.user_id);
  const snapshot = await getDoc(userRef);
  const timestamp = serverTimestamp();

  const exists = snapshot.exists();
  console.log('login user', {
    user_id: user.user_id,
    name: user.name ?? '',
    email: user.email ?? '',
    mobile: user.mobile ?? '',
    role: user.role ?? '',
    address: user.address ?? '',
    avatarUrl: user.avatarUrl ?? '',
    updatedAt: timestamp,
    createdAt: exists ? snapshot.data()?.createdAt ?? timestamp : timestamp,
  },);


  await setDoc(
    userRef,
    {
      user_id: user.user_id,
      name: user.name ?? '',
      email: user.email ?? '',
      mobile: user.mobile ?? '',
      role: user.role ?? '',
      address: user.address ?? '',
      avatarUrl: user.avatarUrl ?? '',
      updatedAt: timestamp,
      createdAt: exists ? snapshot.data()?.createdAt ?? timestamp : timestamp,
    },
    { merge: true }
  );
}

/* =======================
   Thread
======================= */

export async function ensureThreadDocument(
  threadId: string,
  participants: FirestoreUser[]
) {
  if (!threadId || participants.length < 2) return;

  const threadRef = doc(db, THREADS_COLLECTION, threadId);
  const snapshot = await getDoc(threadRef);
  const timestamp = serverTimestamp();

  const participantIds = participants.map(p => p.user_id);

  const participantsMeta = participants.reduce<Record<string, any>>(
    (acc, participant) => {
      acc[participant.user_id] = {
        name: participant.name ?? '',
        email: participant.email ?? '',
        avatarUrl: participant.avatarUrl ?? '',
      };
      return acc;
    },
    {}
  );

  if (snapshot.exists()) {
    await setDoc(
      threadRef,
      {
        participantIds,
        participantsMeta,
        updatedAt: timestamp,
      },
      { merge: true }
    );
    return;
  }

  await setDoc(threadRef, {
    participantIds,
    participantsMeta,
    lastMessage: '',
    lastMessageSenderId: '',
    updatedAt: timestamp,
    createdAt: timestamp,
  });
}

/* =======================
   Subscribe Threads
======================= */

export function subscribeToThreads(
  userId: string,
  onNext: (threads: ChatThread[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, THREADS_COLLECTION),
    where('participantIds', 'array-contains', userId)
  );

  return onSnapshot(
    q,
    snapshot => {
      const threads: ChatThread[] = snapshot.docs
        .map(docSnap => ({
          ...(docSnap.data() as ChatThread),
          id: docSnap.id,
        }))
        .sort((a, b) => {
          const aTime = a.updatedAt?.toMillis?.() ?? 0;
          const bTime = b.updatedAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });

      onNext(threads);
    },
    error => onError?.(error)
  );
}

/* =======================
   Subscribe Messages
======================= */

export function subscribeToMessages(
  threadId: string,
  onNext: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, THREADS_COLLECTION, threadId, MESSAGES_SUBCOLLECTION),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    q,
    snapshot => {
      const messages: ChatMessage[] = snapshot.docs.map(docSnap => ({
        ...(docSnap.data() as ChatMessage),
        id: docSnap.id,
      }));

      onNext(messages);
    },
    error => onError?.(error)
  );
}

/* =======================
   Send Message
======================= */

// export async function sendTextMessage(payload: {
//   threadId: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
// }) {
//   const text = payload.text.trim();
//   if (!text) return;

//   const timestamp = serverTimestamp();

//   const messagesRef = collection(
//     db,
//     THREADS_COLLECTION,
//     payload.threadId,
//     MESSAGES_SUBCOLLECTION
//   );

//   await addDoc(messagesRef, {
//     text,
//     senderId: payload.senderId,
//     receiverId: payload.receiverId,
//     type: 'text',
//     createdAt: timestamp,
//   });

//   const threadRef = doc(db, THREADS_COLLECTION, payload.threadId);

//   await setDoc(
//     threadRef,
//     {
//       lastMessage: text,
//       lastMessageSenderId: payload.senderId,
//       updatedAt: timestamp,
//     },
//     { merge: true }
//   );
// }

// chatFirestore.service.ts

export async function getOrCreateThread(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  const q = query(
    collection(db, "threads"),
    where("participantIds", "array-contains", currentUserId)
  );

  const snap = await getDocs(q);
  const existing = snap.docs.find((doc) =>
    doc.data().participantIds.includes(otherUserId)
  );

  // 🔹 FETCH LATEST DATA REGARDLESS (to ensure avatars are up to date)
  const [currentUser, otherUser] = await Promise.all([
    getUserMeta(currentUserId),
    getUserMeta(otherUserId),
  ]);

  if (!currentUser || !otherUser) {
    throw new Error("User metadata missing in users collection");
  }

  const meta = {
    [currentUserId]: {
      name: currentUser.name || "",
      avatarUrl: currentUser.avatarUrl || "", // Make sure this field name matches your users db
    },
    [otherUserId]: {
      name: otherUser.name || "",
      avatarUrl: otherUser.avatarUrl || "",
    },
  };

  if (existing) {
    // 🔹 OPTIONAL: Update existing thread if meta is empty
    const threadRef = doc(db, "threads", existing.id);
    if (!existing.data().participantsMeta?.[otherUserId]?.avatarUrl) {
      await setDoc(threadRef, { participantsMeta: meta }, { merge: true });
    }
    return existing.id;
  }

  // Create new
  const threadRef = await addDoc(collection(db, "threads"), {
    participantIds: [currentUserId, otherUserId],
    participantsMeta: meta,
    lastMessage: "",
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return threadRef.id;
}


async function getUserMeta(userId: string) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}

export function listenSpecificUsers(userIds: string[], onNext: (users: any[]) => void) {
  if (userIds.length === 0) {
    onNext([]);
    return () => { };
  }

  // Firestore 'in' query supports up to 30 IDs at a time
  const q = query(
    collection(db, "users"),
    where("user_id", "in", userIds)
  );

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data());
    onNext(users);
  });
}

const storage = getStorage();

/**
 * Uploads a file to Firebase Storage and returns the public URL
 */
export const uploadChatImage = async (file: File, threadId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const storageRef = ref(storage, `threads/${threadId}/images/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

/**
 * Updated Send Message function
 */
export async function sendTextMessage(payload: {
  threadId: string;
  text: string;
  senderId: string;
  receiverId: string;
  imageUrls?: string[]; // Add this
}) {
  const timestamp = serverTimestamp();
  const messagesRef = collection(db, "threads", payload.threadId, "messages");

  const messageData = {
    text: payload.text,
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    attachments: payload.imageUrls || [], // Store the URLs here
    type: payload.imageUrls?.length ? 'image' : 'text',
    createdAt: timestamp,
  };

  await addDoc(messagesRef, messageData);

  // Update thread last message
  const threadRef = doc(db, "threads", payload.threadId);
  await setDoc(threadRef, {
    lastMessage: payload.imageUrls?.length ? "Sent an image" : payload.text,
    lastMessageSenderId: payload.senderId,
    updatedAt: timestamp,
  }, { merge: true });
}