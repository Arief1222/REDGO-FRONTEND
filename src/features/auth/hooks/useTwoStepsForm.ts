import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { usePostVerifyEmail, usePostResendVerification } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/app/constants/router';

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
  const location = useLocation();
  const toast = useToast();

  // Email dikirim via navigate state dari register
  const email = location.state?.email || '';

  const form = useForm<TwoStepsFormData>({
    defaultValues: {
      code1: '', code2: '', code3: '',
      code4: '', code5: '', code6: '',
    },
  });

  const { mutate: verifyEmail, isPending: isVerifying } = usePostVerifyEmail({
    onSuccess: () => {
      toast.success('Email verified successfully!');
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN_1, { replace: true });
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Invalid or expired OTP.');
    },
  });

  const resendMutation = usePostResendVerification({
    onSuccess: () => {
      toast.success('OTP baru telah dikirim ke email kamu.');
    },
    onError: () => {
      toast.error('Gagal mengirim ulang OTP.');
    },
  });

  const onSubmit = useCallback(async (data: TwoStepsFormData) => {
    const otp = Object.values(data).join('');
    if (otp.length !== 6) {
      toast.error('Masukkan 6 digit OTP.');
      return;
    }
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan register ulang.');
      navigate(ROUTES.AUTH.REGISTER_1);
      return;
    }
    verifyEmail({ email, otp });
  }, [verifyEmail, email, navigate, toast]);

  const handleResendCode = useCallback(async () => {
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan register ulang.');
      return;
    }
    try {
      await resendMutation.mutateAsync({ email });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal mengirim ulang OTP.');
    }
  }, [resendMutation, email, toast]);

  return {
    form,
    email,
    errorMessage: '',
    isLoading: isVerifying || resendMutation.isPending,
    onSubmit,
    handleResendCode,
  };
};