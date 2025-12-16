"use client";

import { useEffect } from "react";
import { setUserFromStorage } from "@/lib/redux/authSlice";
import { refreshAccessToken } from "@/lib/redux/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatchHook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const authInitialized = useSelector((state:RootState)=>state.auth.authInitialized)

  useEffect(() => {
    // Restore user info from localStorage
    dispatch(setUserFromStorage());

    // Try to get a new access token from refresh token (httpOnly cookie)
    dispatch(refreshAccessToken());
  }, [dispatch]);

  if (!authInitialized) {
      return <div>Checking authentication...</div>;
  }

  return <>{children}</>;
}

export default AuthProvider