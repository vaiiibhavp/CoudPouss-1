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
} from 'firebase/firestore';

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

export async function upsertUserProfile(user: FirestoreUser) {
  if (!user?.user_id) return;

  const userRef = doc(db, USERS_COLLECTION, user.user_id);
  const snapshot = await getDoc(userRef);
  const timestamp = serverTimestamp();

  const exists = snapshot.exists();

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

export async function sendTextMessage(payload: {
  threadId: string;
  text: string;
  senderId: string;
  receiverId: string;
}) {
  const text = payload.text.trim();
  if (!text) return;

  const timestamp = serverTimestamp();

  const messagesRef = collection(
    db,
    THREADS_COLLECTION,
    payload.threadId,
    MESSAGES_SUBCOLLECTION
  );

  await addDoc(messagesRef, {
    text,
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    type: 'text',
    createdAt: timestamp,
  });

  const threadRef = doc(db, THREADS_COLLECTION, payload.threadId);

  await setDoc(
    threadRef,
    {
      lastMessage: text,
      lastMessageSenderId: payload.senderId,
      updatedAt: timestamp,
    },
    { merge: true }
  );
}
