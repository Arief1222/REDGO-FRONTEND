/**
 * Auth Service
 * Application-level authentication utilities
 */

import type { User } from '../api/auth/type';

export const authService = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Store authentication token
   * Called by auth feature after successful login
   */
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  /**
   * Get authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Store user data
   * Called by auth feature after successful login
   */
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Store authentication data with synchronization
   * Promise-based method to ensure state is properly set before navigation
   */
  setAuthData: async (token: string, user: User): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Setting auth data with synchronization...');
        
        // Set localStorage operations
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Verify data was stored correctly
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!storedToken || !storedUser) {
          throw new Error('Failed to store authentication data');
        }
        
        console.log('Auth data stored successfully, triggering state sync...');

        // Dispatch custom event untuk same-tab sync
        window.dispatchEvent(new CustomEvent('auth-token-changed', {
          detail: { token, user }
        }));

        // Also dispatch storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'token',
          newValue: token,
          storageArea: localStorage
        }));

        // Beri waktu untuk React batch updates
        setTimeout(() => {
          console.log('Auth data synchronization complete');
          resolve();
        }, 50);
      } catch (error) {
        console.error('Error setting auth data:', error);
        reject(error);
      }
    });
  },

  /**
   * Clear all authentication data
   * Called by auth feature after logout
   */
  clearAuth: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user has specific permission
   */
  hasPermission: (_permission: string): boolean => {
    // Note: User type from API doesn't include permissions directly
    // This would need to be extended if permission checking is needed
    return false;
  },

  /**
   * Check if user has specific role
   * Note: Reads from localStorage for convenience
   */
  hasRole: (roleName: string): boolean => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr) as User;
    return user?.role?.name === roleName;
  },
};
