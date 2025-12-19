/**
 * API endpoints constants
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
// const API_HOME_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

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
    REFRESH: `${API_BASE_URL}userService/auth/refresh-token`,
    RESET_PASSWORD_START: `${API_BASE_URL}userService/auth/reset/start`,
    VERIFY_RESET_PASSWORD_OTP: `${API_BASE_URL}userService/auth/reset/verify`,
    RESET_PASSWORD: `${API_BASE_URL}userService/auth/reset/confirm`,
    VERIFY_EMAIL: `${API_BASE_URL}userService/auth/verify-email`,
  },
  HOME:{
    SERVICENAME:(serviceName:string) => `${API_BASE_URL}home_module/home?service_name=${serviceName}`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE: `${API_BASE_URL}/user/update`,
  },
  SERVICE_REQUESTS: {
    REQUEST_DETAILS: (requestId: string) => `${API_BASE_URL}service-request/service-requests/${requestId}`,
    CREATE_REQUEST: `${API_BASE_URL}service-request/service-requests`,
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

