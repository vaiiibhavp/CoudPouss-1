"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ROUTES } from "@/constants/routes";
import { RootState } from "@/lib/redux/store";
import { getCookie } from "@/utils/validation";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check role from Redux state or cookies
    const role = user?.role || getCookie("userRole") || localStorage.getItem("role");
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated && !role) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // If user is elderly_user, prevent access to professional pages
    if (role === "elderly_user") {
      router.push(ROUTES.AUTH_HOME);
      return;
    }

    // If user is not service_provider, redirect to login
    if (role && role !== "service_provider") {
      router.push(ROUTES.LOGIN);
      return;
    }
  }, [router, user, isAuthenticated]);

  return <>{children}</>;
}

