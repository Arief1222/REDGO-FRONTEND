import React, { useState } from 'react';
import { Box, Button, Typography, Card, Stack } from '@/shared/components/venturo-ui';
import { IconPlus } from '@tabler/icons-react';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';
import { UserFilters } from './components/UserFilters';
import { UserFilterDrawer } from './components/UserFilterDrawer';
import { useTableUser } from './hooks/useTableUser';
import { useBoolean, usePermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import type { User } from '@/app/api/user/type';

/**
 * UserPage Component
 * Main page for user management with CRUD operations
 */
const UserPage: React.FC = () => {
  const {
    users,
    meta,
    roles,
    isLoading,
    isLoadingRoles,
    isDeleting,
    error,
    search,
    roleId,
    isActive,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    handleDelete,
    handleReset,
  } = useTableUser();

  // Permission checks
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(PERMISSIONS.USER_CREATE);
  const canEdit = hasPermission(PERMISSIONS.USER_EDIT);
  const canDelete = hasPermission(PERMISSIONS.USER_DELETE);

  // Dialog states
  const userDialog = useBoolean();
  const filterDrawer = useBoolean();
  const [dialogState, setDialogState] = useState<{
    mode: 'create' | 'edit';
    user: User | null;
  }>({
    mode: 'create',
    user: null,
  });

  // Handlers
  const handleCreateClick = () => {
    setDialogState({ mode: 'create', user: null });
    userDialog.setTrue();
  };

  const handleEditClick = (user: User) => {
    setDialogState({ mode: 'edit', user });
    userDialog.setTrue();
  };

  const handleDialogClose = () => {
    userDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      setDialogState({ mode: 'create', user: null });
    }, 300);
  };

  const handleSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            Users Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus size={20} />}
            onClick={handleCreateClick}
            disabled={isLoading}
          >
            Add
          </Button>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Card sx={{ mb: 2, p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            {error.message || 'An error occurred while loading users'}
          </Typography>
        </Card>
      )}

      <Stack direction="column" gap={2}>
        {/* Filters */}
      <UserFilters
        search={search}
        roleId={roleId}
        isActive={isActive}
        onSearchChange={handleSearch}
        onFilterClick={filterDrawer.setTrue}
        onReset={handleReset}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        isDeleting={isDeleting}
        meta={meta}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        canEdit={canEdit}
        canDelete={canDelete}
      />
      </Stack>

      {/* Filter Drawer */}
      <UserFilterDrawer
        open={filterDrawer.value}
        roleId={roleId}
        isActive={isActive}
        roles={roles}
        isLoadingRoles={isLoadingRoles}
        onClose={filterDrawer.setFalse}
        onRoleChange={handleRoleFilter}
        onStatusChange={handleStatusFilter}
        onApply={filterDrawer.setFalse}
      />

      {/* User Dialog (Create/Edit) */}
      <UserForm
        open={userDialog.value}
        mode={dialogState.mode}
        user={dialogState.user}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default UserPage;
