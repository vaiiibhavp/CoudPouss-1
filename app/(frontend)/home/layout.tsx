"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    // TODO: Replace with actual authentication check
    // For now, this is a placeholder - you should check for auth token, session, etc.
    const isAuthenticated = localStorage.getItem("userInitial") || localStorage.getItem("userEmail");
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  return <>{children}</>;
}

