import { useState } from 'react';
import { useGetListUsers, useDeleteUsers } from '@/app/api/user/useUserApi';
import { useGetListRoles } from '@/app/api/role/useRoleApi';
import type { ListUsersParams } from '@/app/api/user/type';

/**
 * Custom hook for managing user table data and operations
 * Handles pagination, filtering, and delete operations
 */
export const useTableUser = () => {
  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Fetch roles for filter
  const { data: rolesData, isLoading: isLoadingRoles } = useGetListRoles({
    page: 1,
    limit: 100,
  });

  // Build query parameters
  const params: ListUsersParams = {
    page,
    limit,
    search: search || undefined,
    role_id: roleId || undefined,
    is_active: isActive,
  };

  // Fetch users with React Query
  const { data, isLoading, error, refetch } = useGetListUsers(params);

  // Delete mutation
  const deleteMutation = useDeleteUsers({
    onSuccess: () => {
      refetch();
    },
  });

  // Handler functions
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (role: string) => {
    setRoleId(role);
    setPage(1); // Reset to first page when filtering
  };

  const handleStatusFilter = (status: boolean | undefined) => {
    setIsActive(status);
    setPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setRoleId('');
    setIsActive(undefined);
    setPage(1);
  };

  // Extract data from response
  const users = data?.data?.data || [];
  const meta = data?.data?.meta;
  const roles = rolesData?.data?.data || [];

  return {
    // Data
    users,
    meta,
    roles,

    // Loading states
    isLoading,
    isLoadingRoles,
    isDeleting: deleteMutation.isPending,
    error,

    // Filters
    search,
    roleId,
    isActive,

    // Handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
