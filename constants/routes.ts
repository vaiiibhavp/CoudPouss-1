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
  
  // Professional Reset Password Route
  RESET_PASSWORD_PROFESSIONAL: '/reset-password-professional',
  
  // Professional Onboarding Routes (after signup)
  PROFESSIONAL_ONBOARDING_SELECT_PLAN: '/professional-onboarding/select-plan',
  PROFESSIONAL_ONBOARDING_REVIEW_PLAN: '/professional-onboarding/review-plan',
  PROFESSIONAL_ONBOARDING_PAYMENT_MODE: '/professional-onboarding/payment-mode',
  PROFESSIONAL_ONBOARDING_ADDITIONAL_DETAILS: '/professional-onboarding/additional-details',
  PROFESSIONAL_ONBOARDING_SELECT_CATEGORY: '/professional-onboarding/select-category',
  PROFESSIONAL_ONBOARDING_BANK_DETAILS: '/professional-onboarding/bank-details',
  
  DASHBOARD: '/dashboard',
  PROFESSIONAL_DASHBOARD: '/professional/dashboard',
  PROFESSIONAL_EXPLORE_REQUESTS: '/professional/explore-requests',
  PROFESSIONAL_TASK_MANAGEMENT: '/professional/task-management',
  PROFESSIONAL_PROFILE: '/professional/profile',
  PROFESSIONAL_TRANSACTION_HISTORY: '/professional/profile/transaction-history',
  PROFILE: '/profile',
  MY_REQUESTS: '/my-requests',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  HOME_ASSISTANCE: '/services/home-assistance',
  TRANSPORT: '/services/transport',
  PERSONAL_CARE: '/services/personal-care',
  TECH_SUPPORT: '/services/tech-support',
  CHAT: '/chat',
  Favorite: "/favorites",
  HELP_CENTER: '/help-center',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

