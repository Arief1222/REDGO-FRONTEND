import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApiWithMeta } from '@/shared/types/api/type';
import { permissionApi } from './permissionApi';
import type {
  ListPermissionsParams,
  Permission,
} from './type';

/** Permission API React Query hooks */

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (params?: ListPermissionsParams) => [...permissionKeys.lists(), params] as const,
};

export const useGetListPermissions = (
  params?: ListPermissionsParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<Permission[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () => permissionApi.listPermissions(params),
    ...options,
  });
};
