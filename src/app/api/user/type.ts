import type { User, Role } from '../auth/type';

/** User types */

export type { User, Role };

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role_id: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role_id?: string;
  is_active?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role_id?: string;
  is_active?: boolean;
}
