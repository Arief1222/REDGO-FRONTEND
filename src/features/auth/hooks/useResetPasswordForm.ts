import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { usePostResetPassword } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/app/constants/router';

interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

export const useResetPasswordForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  // Reset password mutation
  const resetPasswordMutation = usePostResetPassword({
    onSuccess: () => {
      toast.success('Password has been reset successfully! Redirecting to login...');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN_1);
      }, 2000);
    },
  });

  const onSubmit = useCallback(async (data: ResetPasswordFormData) => {
    // Validate passwords match
    if (data.new_password !== data.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate token exists
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        new_password: data.new_password,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      console.error('Reset password error:', error);
    }
  }, [resetPasswordMutation, token, toast]);

  return {
    form,
    errorMessage: (resetPasswordMutation.error as any)?.response?.data?.message || '',
    successMessage: resetPasswordMutation.isSuccess ? 'Password has been reset successfully! Redirecting to login...' : '',
    isLoading: resetPasswordMutation.isPending,
    onSubmit,
    token,
  };
};
