'use client'
import ChatPage from "../page";

interface PageProps {
  params: { id: string };
}
export default function ChatShell({ params }: PageProps) {
  console.log("params", params);

  return <ChatPage  />;
}
