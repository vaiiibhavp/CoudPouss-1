"use client";

import { useEffect } from "react";
import {
  setAuthInitialized,
  setFirebaseUser,
  setUserFromStorage,
} from "@/lib/redux/authSlice";

import { useAppDispatch } from "@/hooks/useAppDispatchHook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { listenFirebaseAuth } from "@/services/firebaseAuth.service";
import { createUserDoc } from "@/app/(auth)/login/CreateUserDoc";

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const authInitialized = useSelector(
    (state: RootState) => state.auth.authInitialized
  );

  useEffect(() => {
    // Restore user info from localStorage
    dispatch(setUserFromStorage());

    // Try to get a new access token from refresh token (httpOnly cookie)
    // dispatch(refreshAccessToken());
    dispatch(setAuthInitialized());

  }, [dispatch]);

  if (!authInitialized) {
    return <div></div>;
  }

  return <>{children}</>;
}

export default AuthProvider;
