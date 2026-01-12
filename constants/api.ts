/**
 * API endpoints constants
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const API_HOME_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

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
    PLANS_ALL: `${API_BASE_URL}userService/auth/plans/all`,
    SELECT_PLAN: `${API_BASE_URL}userService/auth/select-plan`,
    EXPERIENCE: `${API_BASE_URL}userService/auth/experience`,
    GET_USER: `${API_BASE_URL}userService/auth/get_user`,
    DELETE_PROFILE: `${API_BASE_URL}userService/auth/delete-profile`,
    SAVE_SERVICES: `${API_BASE_URL}userService/auth/services`,
  },
  HOME:{
    HOME: `${API_BASE_URL}home_module/home`,
    ALL_CATEGORIES: `${API_BASE_URL}home_module/all_categories`,
    ALL_BANNERS: `${API_BASE_URL}home_module/all_banners`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE: `${API_BASE_URL}/user/update`,
  },
  PROFILE: {
    USER_PROFILE: `${API_BASE_URL}profile_module/user_profile`,
    UPDATE_PROFILE: `${API_BASE_URL}profile_module/profile`,
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
  SERVICE_REQUEST: {
    UPLOAD_FILE: `${API_BASE_URL}service_request/upload-job-file`,
    CREATE: `${API_BASE_URL}service_request/service-requests`,
    GET_SERVICES: `${API_BASE_URL}service_confirmation/service_accept/get_services`,
    GET_SERVICE_DETAIL: `${API_BASE_URL}service_confirmation/service_accept/get_service`,
    OPEN_SERVICES: `${API_BASE_URL}quote_request/open-services`,
  },
} as const;

