import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { usePostRegister } from '@/app/api/auth/useAuthApi';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/app/constants/router';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Register mutation
const registerMutation = usePostRegister({
  onSuccess: (_, variables) => {
    toast.success('Registrasi berhasil! Cek email kamu untuk kode OTP.');
    navigate(ROUTES.AUTH.VERIFY_EMAIL, {
      state: { email: variables.email }, // ← kirim email ke OTP page
    });
  },
})

  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    }
  }, [registerMutation, toast]);

  return {
    form,
    errorMessage: (registerMutation.error as any)?.response?.data?.message || '',
    isLoading: registerMutation.isPending,
    onSubmit,
  };
};
