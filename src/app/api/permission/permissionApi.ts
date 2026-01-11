import { apiService } from '@/app/services/apiService';
import { ResponseApiWithMeta } from '@/shared/types/api/type';
import type {
  ListPermissionsParams,
  Permission,
} from './type';

/** Permission API endpoints */

export const permissionApi = {
  listPermissions: (params?: ListPermissionsParams) =>
    apiService.get<ResponseApiWithMeta<Permission[]>>('/core/v1/permissions', params || {}),
};
