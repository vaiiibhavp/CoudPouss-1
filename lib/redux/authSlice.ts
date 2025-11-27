// lib/redux/authSlice.ts
"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

interface User {
  email: string;
  initial: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Helper: read from localStorage on client (for page refresh)
const getInitialUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const email = localStorage.getItem("userEmail");
  const initial = localStorage.getItem("userInitial");
  if (!email || !initial) return null;
  return { email, initial };
};

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ emailOrMobile, password }, { rejectWithValue }) => {
    try {
      // TODO: replace with real API call
      console.log("Login attempt (thunk):", { emailOrMobile, password });

      // Fake delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple fake validation
      if (!emailOrMobile || !password) {
        return rejectWithValue("Invalid credentials. Please try again.");
      }

      const email = emailOrMobile; // adjust if you support mobile separately
      const user: User = {
        email,
        initial: email.charAt(0).toUpperCase(),
      };

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userInitial", user.initial);
      }

      return user;
    } catch (err) {
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userInitial");
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
