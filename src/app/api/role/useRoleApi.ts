import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { roleApi } from './roleApi';
import type {
  CreateRoleData,
  ListRolesParams,
  UpdateRoleData,
  RoleWithPermissions,
} from './type';

/** Role API React Query hooks */

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: ListRolesParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

export const usePostRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<RoleWithPermissions>>, AxiosError, CreateRoleData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => roleApi.createRole(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<RoleWithPermissions>>, AxiosError, { id: string; data: UpdateRoleData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => roleApi.updateRole(id, data),
    onSuccess: (response, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRole(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListRoles = (
  params?: ListRolesParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<RoleWithPermissions[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleApi.listRoles(params),
    ...options,
  });
};

export const useGetRoles = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<RoleWithPermissions>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};
