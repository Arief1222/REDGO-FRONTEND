import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  CreateRoleData,
  ListRolesParams,
  UpdateRoleData,
  RoleWithPermissions,
} from './type';

/** Role API endpoints */

export const roleApi = {
  createRole: (data: CreateRoleData) =>
    apiService.post<ResponseApi<RoleWithPermissions>>('/core/v1/roles', data),

  listRoles: (params?: ListRolesParams) =>
    apiService.get<ResponseApiWithMeta<RoleWithPermissions[]>>('/core/v1/roles', params || {}),

  getRoleById: (id: string) =>
    apiService.get<ResponseApi<RoleWithPermissions>>(`/core/v1/roles/${id}`),

  updateRole: (id: string, data: UpdateRoleData) =>
    apiService.put<ResponseApi<RoleWithPermissions>>(`/core/v1/roles/${id}`, data),

  deleteRole: (id: string) =>
    apiService.delete<ResponseApi<void>>(`/core/v1/roles/${id}`),
};
