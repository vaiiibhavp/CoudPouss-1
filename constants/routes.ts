/**
 * Application routes constants
 */

export const ROUTES = {
  HOME: '/',
  AUTH_HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',

  // Professional Reset Password Route
  RESET_PASSWORD_PROFESSIONAL: '/reset-password-professional',

  DASHBOARD: '/dashboard',
  PROFESSIONAL_DASHBOARD: '/professional/dashboard',
  PROFESSIONAL_HOME: '/professional/home',
  PROFESSIONAL_EXPLORE_REQUESTS: '/professional/explore-requests',
  PROFESSIONAL_TASK_MANAGEMENT: '/professional/task-management',
  PROFESSIONAL_PROFILE: '/professional/profile',
  PROFESSIONAL_TRANSACTION_HISTORY: '/professional/profile/transaction-history',
  PROFESSIONAL_CHAT: '/professional/chat',
  PROFESSIONAL_CHAT_Id: '/professional/chat/:id',
  PROFILE: '/profile',
  MY_REQUESTS: '/my-requests',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  HOME_ASSISTANCE: '/services/home-assistance',
  TRANSPORT: '/services/transport',
  PERSONAL_CARE: '/services/personal-care',
  TECH_SUPPORT: '/services/tech-support',
  CHAT: '/chat',
  CHAT_id: '/chat/:id',
  Favorite: "/favorites",
  HELP_CENTER: '/help-center',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

