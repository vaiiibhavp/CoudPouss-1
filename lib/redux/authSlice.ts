// lib/redux/authSlice.ts
"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../api";
import { buildInputData } from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types";

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    access_token_expire: string;
    refresh_token_expire: string;
    user_data?: {
      user_id: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      address: string;
      [key: string]: any;
    };
  };
}

interface User {
  email: string;
  initial: string;
  role:string
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

      const response = await apiPost<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN,apiPayload);
      console.log("Login attempt (thunk):", { emailOrMobile, password });
      console.log(response)
      let userData : {role?: string} = {}
      if(response && response?.data?.data?.user_data){
        userData = {...response.data.data.user_data}
      }
      console.log(userData)
      const user: User = {
        email : apiPayload["email"] || "",
        initial: (apiPayload["email"] || "").charAt(0).toUpperCase(),
        role: userData["role"] || "",
      };
      return user;
    } catch (err:unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      
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
        const role = localStorage.getItem("role");
        if (email && initial && role) {
          state.user = { email, initial, role };
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
          localStorage.setItem("role", action.payload.role);

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