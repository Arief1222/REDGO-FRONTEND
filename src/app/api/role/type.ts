/** Role types */

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
}

export interface ListRolesParams {
  page?: number;
  limit?: number;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  is_active?: boolean;
  permissions?: string[];
}
