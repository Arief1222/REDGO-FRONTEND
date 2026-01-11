/**
 * App Constants
 * General application-wide constants
 */

export const APP_CONFIG = {
  APP_NAME: 'MatDash',
  APP_VERSION: '2.0.0',
  APP_DESCRIPTION: 'Admin Dashboard',
  
  // API Configuration
  API_TIMEOUT: 10000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  
  // Date formats
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_FORMAT: 'HH:mm:ss',
  
  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
  },
} as const;
