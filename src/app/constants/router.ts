/**
 * Route Constants
 * Centralized route path definitions
 */

export const ROUTES = {
  // Root
  ROOT: '/',
  ROOT_PUBLIC: '/auth',

  // Dashboard
  DASHBOARD: '/',
  SAMPLE_PAGE: '/sample-page',
  // ITEMS: '/items',
  // SUPPLIERS: '/suppliers',
  // WAREHOUSE: '/warehouse',
  // RECEIVINGS: '/receivings',
  // ISSUINGS: '/issuings',

  // User Management
  USERS: '/users',
  ROLES: '/roles',
  RAG:'/rag',
  CHAT:'/chat',
  PROMPTS: '/prompts',
 
  

  // Auth Routes
  AUTH: {
    LOGIN_1: '/auth/login',
    LOGIN_2: '/auth/login-2',
    REGISTER_1: '/auth/register',
    REGISTER_2: '/auth/register-2',
    FORGOT_PASSWORD_1: '/auth/forgot-password',
    FORGOT_PASSWORD_2: '/auth/forgot-password-2',
    RESET_PASSWORD_1: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    TWO_STEPS_1: '/auth/two-steps',
    TWO_STEPS_2: '/auth/two-steps-2',
    MAINTENANCE: '/auth/maintenance',
    ERROR_404: '/auth/404',
  },

  // Error Routes
  ERROR: {
    FORBIDDEN: '/403',
    NOT_FOUND: '/404',
  },

  // Future routes can be added here

} as const;

/**
 * Convert absolute auth path to relative path for nested routing
 * Strips the ROOT_PUBLIC prefix to make path relative
 *
 * @example
 * publicUrl('/auth/login') // returns 'login'
 * publicUrl('/auth/register') // returns 'register'
 */
export const publicUrl = (path: string): string => {
  return path.replace(ROUTES.ROOT_PUBLIC + '/', '');
};
