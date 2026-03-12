/** Auth types */

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role_id: string;
  is_active: boolean;
  email_verified: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface UpdateAccountData {
  name?: string;
  email?: string;
}

export interface LoginData {
  token: string;
  user: User;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}