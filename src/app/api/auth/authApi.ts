import { apiService } from '@/app/services/apiService';
import { ResponseApi } from '@/shared/types/api/type';
import type {
  RegisterData,
  LoginCredentials,
  LoginData,
  ResendVerificationData,
  UpdateAccountData,
  User,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
} from './type';

/** Auth API endpoints */
export const authApi = {
  register: (data: RegisterData) =>
    apiService.post<ResponseApi<void>>('/core/v1/register', data),

  login: (credentials: LoginCredentials) =>
    apiService.post<ResponseApi<LoginData>>('/core/v1/login', credentials),

  verifyEmail: (data: VerifyEmailData) =>
    apiService.post<ResponseApi<void>>('/core/v1/verify-email', data),

  resendVerification: (data: ResendVerificationData) =>
    apiService.post<ResponseApi<void>>('/core/v1/resend-verification', data),

  getProfile: () =>
    apiService.get<ResponseApi<User>>('/core/v1/profile'),

  updateAccount: (data: UpdateAccountData) =>
    apiService.put<ResponseApi<User>>('/core/v1/account', data),

  forgotPassword: (data: ForgotPasswordData) =>
    apiService.post<ResponseApi<void>>('/core/v1/forgot-password', data),

  resetPassword: (data: ResetPasswordData) =>
    apiService.post<ResponseApi<void>>('/core/v1/reset-password', data),
};
