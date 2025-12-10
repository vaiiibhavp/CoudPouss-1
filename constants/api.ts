/**
 * API endpoints constants
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: `${API_BASE_URL}userService/auth/login`,
    START: `${API_BASE_URL}userService/auth/start`,
    VERIFY_OTP: `${API_BASE_URL}userService/auth/verify`,
    CREATE_PASSWORD: `${API_BASE_URL}userService/auth/password`,
    CREATE_ACCOUNT: `${API_BASE_URL}userService/auth/details`,
    RESEND_OTP: `${API_BASE_URL}userService/auth/resend-otp`,
    UPLOAD_PROFILE_PIC: `${API_BASE_URL}userService/auth/upload-profile-photo`,
    SIGNUP: `${API_BASE_URL}userService/auth/signup`,
    LOGOUT: `${API_BASE_URL}userService/auth/logout`,
    REFRESH: `${API_BASE_URL}userService/auth/refresh`,
    RESET_PASSWORD: `${API_BASE_URL}userService/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}userService/auth/verify-email`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE: `${API_BASE_URL}/user/update`,
  },
  SERVICES: {
    LIST: `${API_BASE_URL}/services`,
    DETAIL: (id: string) => `${API_BASE_URL}/services/${id}`,
    BOOK: `${API_BASE_URL}/services/book`,
  },
  BOOKINGS: {
    LIST: `${API_BASE_URL}/bookings`,
    DETAIL: (id: string) => `${API_BASE_URL}/bookings/${id}`,
    CANCEL: (id: string) => `${API_BASE_URL}/bookings/${id}/cancel`,
  },
} as const;

