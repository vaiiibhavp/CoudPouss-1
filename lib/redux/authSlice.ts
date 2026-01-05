// lib/redux/authSlice.ts
"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../api";
import { buildInputData,getCookie } from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types";
import { act } from "react";

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
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpire: string | null;
  refreshTokenExpire: string | null;
  authInitialized : boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  accessTokenExpire: null,
  refreshTokenExpire: null,
  authInitialized : false
};

export const loginUser = createAsyncThunk<
  {
    user: User;
    accessToken: string;
    refreshToken: string;
    accessTokenExpire: string;
    refreshTokenExpire: string;
  },
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

      // Check if API returned an error
      if (!response.success || response.error) {
        const errorMessage = response.error?.message || "Login failed. Please try again.";
        return rejectWithValue(errorMessage);
      }

      // Check if the response data indicates an error status
      if (response.data && (response.data as any).status === "error") {
        const errorMessage = (response.data as any).message || "Login failed. Please try again.";
        return rejectWithValue(errorMessage);
      }

      const data = response.data?.data;
      if (!data) return rejectWithValue("Invalid login response");

      const userData = data.user_data || {};

      const user: User = {
        email: data.user_data?.email || apiPayload["email"] || "",
        initial: (data.user_data?.name?.charAt(0) || "U").toUpperCase(),
        role: data.user_data?.role || "",
      };

      return {
        user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessTokenExpire : data.access_token_expire,
        refreshTokenExpire : data.refresh_token_expire,
      };
    } catch (err:unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await apiPost<any>(API_ENDPOINTS.AUTH.REFRESH, { refresh_token : refreshToken });
      if (!response.success) throw new Error(response.error?.message || "Failed");

      const data  = response.data.data

      return {
        accessToken: data.access_token,
        accessTokenExpire: data.access_token_expire,
        refreshToken: data.refresh_token,
        refreshTokenExpire: data.refresh_token_expire,
      };
      
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpire = null;
      state.refreshTokenExpire = null;

      document.cookie = "refreshToken=; path=/; max-age=0";
        
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
        // const token = localStorage.getItem("token");

        if (email && initial && role) {
          state.user = { email, initial, role };
          state.isAuthenticated = true;
          // state.accessToken = token
        }
      }
    },
    setTokens(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        accessTokenExpire: string;
        refreshTokenExpire: string;
        user?: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExpire = action.payload.accessTokenExpire;
      state.refreshTokenExpire = action.payload.refreshTokenExpire;
      if (action.payload.user) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
          state.accessToken = action.payload.accessToken;
          state.accessTokenExpire = action.payload.accessTokenExpire;

          if (action.payload.refreshToken) {
            state.refreshToken = action.payload.refreshToken;
            state.refreshTokenExpire = action.payload.refreshTokenExpire;
          }

          state.isAuthenticated = true;
          state.authInitialized = true
          state.error = null;
        })
      .addCase(refreshAccessToken.rejected, (state, action) => {
          state.authInitialized = true
          state.accessToken = null;
          state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        accessTokenExpire: string;
        refreshTokenExpire: string;
      }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken,
        state.refreshToken = action.payload.refreshToken,
        state.refreshTokenExpire = action.payload.refreshTokenExpire,
        state.accessTokenExpire = action.payload.accessTokenExpire,
        state.isAuthenticated = true;
        state.authInitialized = true;
        
        // Persist to localStorage for page refresh
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", action.payload.user.email);
          localStorage.setItem("userInitial", action.payload.user.initial);
          localStorage.setItem("role", action.payload.user.role);
          localStorage.setItem("token",action.payload.accessToken)
          document.cookie = `refreshToken=${action.payload.refreshToken}; path=/; max-age=${7*24*60*60}`;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError, setUserFromStorage,setTokens } = authSlice.actions;
export default authSlice.reducer;