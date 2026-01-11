import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostForgotPassword } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';

interface ForgotPasswordFormData {
  email: string;
}

export const useForgotPasswordForm = () => {
  const toast = useToast();

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = usePostForgotPassword({
    onSuccess: () => {
      toast.success('Password reset instructions have been sent to your email.');
      form.reset();
    },
  });

  const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to send reset instructions. Please try again.';
      toast.error(errorMessage);
      console.error('Forgot password error:', error);
    }
  }, [forgotPasswordMutation, toast]);

  return {
    form,
    errorMessage: (forgotPasswordMutation.error as any)?.response?.data?.message || '',
    successMessage: forgotPasswordMutation.isSuccess ? 'Password reset instructions have been sent to your email.' : '',
    isLoading: forgotPasswordMutation.isPending,
    onSubmit,
  };
};
