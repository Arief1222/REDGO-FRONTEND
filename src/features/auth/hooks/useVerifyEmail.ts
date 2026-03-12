// features/auth/hooks/useVerifyEmail.ts
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { usePostVerifyEmail, usePostResendVerification } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/app/constants/router';

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Email dikirim via navigate state dari halaman register
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');

  const { mutate: verifyEmail, isPending: isVerifying, isSuccess, isError, error } = usePostVerifyEmail({
    onSuccess: () => {
      toast.success('Email verified successfully!');
      setTimeout(() => {
        navigate(`${ROUTES.AUTH.LOGIN_1}?direct=1`, { replace: true });
      }, 1500);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP.');
    },
  });

  const { mutate: resendOTP, isPending: isResending } = usePostResendVerification({
    onSuccess: () => {
      toast.success('OTP baru telah dikirim ke email kamu.');
    },
    onError: () => {
      toast.error('Gagal mengirim ulang OTP. Coba lagi.');
    },
  });

  const handleVerify = (otpOverride?: string) => {
    const finalOtp = (otpOverride ?? otp).replace(/\s/g, '');
    if (finalOtp.length !== 6 || !/^\d{6}$/.test(finalOtp)) {
      toast.error('OTP harus 6 digit angka.');
      return;
    }
    verifyEmail({ email, otp: finalOtp });
  };

  const handleResend = () => {
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan register ulang.');
      return;
    }
    resendOTP({ email });
  };

  return {
    email,
    otp,
    setOtp,
    isVerifying,
    isResending,
    isSuccess,
    isError,
    errorMessage: (error as any)?.response?.data?.message || '',
    handleVerify,
    handleResend,
  };
};