// lib/redux/authSlice.ts
"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../api";
import { buildInputData } from "@/utils/validation";

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
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
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

     if (!emailOrMobile || !password) {
        return rejectWithValue("Email/Mobile and password are required");
      }

      // Build payload here
      let inputData;
      try {
        inputData = buildInputData(emailOrMobile);
      } catch (err) {
        return rejectWithValue("Invalid email or mobile number");
      }

      // Now add password
      const apiPayload = {
        ...inputData,
        password,
      };

      console.log(apiPayload)
      const data = await apiPost("userService/auth/login",apiPayload);
      console.log(data);
      console.log("Login attempt (thunk):", { emailOrMobile, password });

      // Simple fake validation
      if (!emailOrMobile || !password) {
        return rejectWithValue("Invalid credentials. Please try again.");
      }

      const email = emailOrMobile; // adjust if you support mobile separately
      const user: User = {
        email,
        initial: email.charAt(0).toUpperCase(),
      };

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
      state.isAuthenticated = false;
      
      // Clear localStorage on logout (mirroring login persistence)
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userInitial");
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
    setUserFromStorage(state) {
      if (typeof window !== "undefined") {
        const email = localStorage.getItem("userEmail");
        const initial = localStorage.getItem("userInitial");
        if (email && initial) {
          state.user = { email, initial };
          state.isAuthenticated = true;
        }
      }
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
        state.isAuthenticated = true;
        
        // Persist to localStorage for page refresh
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", action.payload.email);
          localStorage.setItem("userInitial", action.payload.initial);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;