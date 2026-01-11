import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostLogin } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';
import { authService } from '@/app/services/authService';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const toast = useToast();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Login mutation
  const loginMutation = usePostLogin({
    onSuccess: async (response) => {
      try {
        console.log('Login successful, processing authentication data...');

        // Extract auth data from response
        const { token, user } = response.data.data;

        console.log('Token received:', token ? '✓' : '✗');
        console.log('User data received:', user ? '✓' : '✗');

        // Store auth data - will trigger AuthProvider update
        await authService.setAuthData(token, user);

        console.log('Auth data stored, GuestGuard will handle redirect...');

        // Show success message
        toast.success('Login successful!');

        // Note: No manual navigation needed
        // GuestGuard will automatically redirect when it detects isAuthenticated = true

      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      }
    },
  });

  const onSubmit = useCallback(async (data: LoginFormData, event?: React.BaseSyntheticEvent): Promise<void> => {
    try {
      // Explicit prevent default to ensure SPA behavior
      event?.preventDefault();
      event?.stopPropagation();
      
      console.log('Form submission started for email:', data.email);
      
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      
      console.log('Form submission completed successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    }
  }, [loginMutation, toast]);

  return {
    form,
    errorMessage: (loginMutation.error as any)?.response?.data?.message || '',
    isLoading: loginMutation.isPending,
    onSubmit,
  };
};
