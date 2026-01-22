// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/redux/authSlice';
import profileReducer from '@/lib/redux/profileSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer
  },
});

// Types for TS (optional but recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
