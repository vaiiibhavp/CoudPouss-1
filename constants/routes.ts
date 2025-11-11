/**
 * Application routes constants
 */

export const ROUTES = {
  HOME: '/',
  AUTH_HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  
  // Professional Signup Routes
  SIGNUP_PROFESSIONAL_ENTER_CONTACT: '/signup-professional/enter-contact',
  SIGNUP_PROFESSIONAL_VERIFY_OTP: '/signup-professional/verify-otp',
  SIGNUP_PROFESSIONAL_CREATE_PASSWORD: '/signup-professional/create-password',
  SIGNUP_PROFESSIONAL_ADD_DETAILS: '/signup-professional/add-details',
  
  // Professional Reset Password Routes
  RESET_PASSWORD_PROFESSIONAL_ENTER_EMAIL: '/reset-password-professional/enter-email',
  RESET_PASSWORD_PROFESSIONAL_VERIFY_OTP: '/reset-password-professional/verify-otp',
  RESET_PASSWORD_PROFESSIONAL_SET_PASSWORD: '/reset-password-professional/set-password',
  
  // Professional Onboarding Routes (after signup)
  PROFESSIONAL_ONBOARDING_SELECT_PLAN: '/professional-onboarding/select-plan',
  PROFESSIONAL_ONBOARDING_REVIEW_PLAN: '/professional-onboarding/review-plan',
  PROFESSIONAL_ONBOARDING_PAYMENT_MODE: '/professional-onboarding/payment-mode',
  PROFESSIONAL_ONBOARDING_ADDITIONAL_DETAILS: '/professional-onboarding/additional-details',
  PROFESSIONAL_ONBOARDING_SELECT_CATEGORY: '/professional-onboarding/select-category',
  PROFESSIONAL_ONBOARDING_BANK_DETAILS: '/professional-onboarding/bank-details',
  
  DASHBOARD: '/dashboard',
  PROFESSIONAL_DASHBOARD: '/professional-dashboard',
  PROFILE: '/profile',
  MY_REQUESTS: '/my-requests',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  HOME_ASSISTANCE: '/services/home-assistance',
  TRANSPORT: '/services/transport',
  PERSONAL_CARE: '/services/personal-care',
  TECH_SUPPORT: '/services/tech-support',
  CHAT: '/chat',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

