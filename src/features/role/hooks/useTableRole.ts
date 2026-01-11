import { useState, useCallback } from 'react';
import { useGetListRoles, useDeleteRoles } from '@/app/api/role/useRoleApi';
import { useGetListPermissions } from '@/app/api/permission/usePermissionApi';
import type { ListRolesParams } from '@/app/api/role/type';

interface UseTableRoleParams {
  initialParams?: ListRolesParams;
}

export const useTableRole = ({ initialParams = {} }: UseTableRoleParams = {}) => {
  // State for pagination and filters
  const [params, setParams] = useState<ListRolesParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  // State for search
  const [search, setSearch] = useState('');

  // State for status filter
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Fetch roles
  const {
    data: rolesData,
    isLoading,
    error,
    refetch,
  } = useGetListRoles(params, {
    placeholderData: (previousData) => previousData,
  });

  // Fetch permissions for reference
  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
  } = useGetListPermissions(
    { limit: 100 }, // Get all permissions for reference
    {
      enabled: true,
    }
  );

  // Delete role mutation
  const deleteRoleMutation = useDeleteRoles({
    onSuccess: () => {
      // Refetch roles list
      refetch();
    },
  });

  // Extract data
  const roles = rolesData?.data?.data || [];
  const meta = rolesData?.data?.meta;
  const permissions = permissionsData?.data?.data || [];

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setParams(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusFilter = useCallback((value: boolean | undefined) => {
    setIsActive(value);
    setParams(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteRoleMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to delete role:', error);
    }
  }, [deleteRoleMutation]);

  const handleReset = useCallback(() => {
    setSearch('');
    setIsActive(undefined);
    setParams({
      page: 1,
      limit: 10,
      ...initialParams,
    });
  }, [initialParams]);

  return {
    // Data
    roles,
    meta,
    permissions,
    
    // Loading states
    isLoading,
    isLoadingPermissions,
    isDeleting: deleteRoleMutation.isPending,
    
    // Error
    error,
    
    // Filters
    search,
    isActive,
    
    // Handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleStatusFilter,
    handleDelete,
    handleReset,
    refetch,
  };
};
