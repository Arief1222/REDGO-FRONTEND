import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { useGetVerifyEmail, usePostResendVerification } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';

interface TwoStepsFormData {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
}

export const useTwoStepsForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const form = useForm<TwoStepsFormData>({
    defaultValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
    },
  });

  // Verify email with token from URL (if available)
  const { isLoading: isVerifying, data: verifyData, error: verifyError } = useGetVerifyEmail(tokenFromUrl, {
    enabled: !!tokenFromUrl,
  });

  // Handle verification success/error
  useEffect(() => {
    if (verifyData) {
      toast.success('Email verified successfully!');
      navigate('/');
    }
  }, [verifyData, toast, navigate]);

  useEffect(() => {
    if (verifyError) {
      const errorMessage = (verifyError as any)?.response?.data?.message || 'Email verification failed.';
      toast.error(errorMessage);
    }
  }, [verifyError, toast]);

  // Resend verification email
  const resendMutation = usePostResendVerification({
    onSuccess: () => {
      toast.success('Verification email has been resent!');
    },
  });

  const onSubmit = useCallback(async (data: TwoStepsFormData) => {
    const verificationCode = Object.values(data).join('');

    // TODO: Implement verification with manual code input
    // Currently, the API only supports verification via token from email link
    // This requires a new API endpoint: POST /verify-email-with-code
    toast.warning('Manual code verification not yet implemented. Please check your email for verification link.');
    console.warn('Verification code entered:', verificationCode);
    console.warn('API endpoint for manual code verification is not available yet');
  }, [toast]);

  const handleResendCode = useCallback(async (email: string) => {
    try {
      await resendMutation.mutateAsync({ email });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to resend verification email.';
      toast.error(errorMessage);
      console.error('Resend verification error:', error);
    }
  }, [resendMutation, toast]);

  return {
    form,
    errorMessage: '',
    isLoading: isVerifying || resendMutation.isPending,
    onSubmit,
    handleResendCode,
  };
};
