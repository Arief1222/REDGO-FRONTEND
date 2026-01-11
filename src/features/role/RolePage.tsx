import React, { useState } from 'react';
import { Box, Button, Typography, Card } from '@/shared/components/venturo-ui';
import { IconPlus } from '@tabler/icons-react';
import { RoleTable } from './components/RoleTable';
import { RoleForm } from './components/RoleForm';
import { RoleFilters } from './components/RoleFilters';
import { RoleFilterDrawer } from './components/RoleFilterDrawer';
import { useTableRole } from './hooks/useTableRole';
import { useBoolean, usePermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import type { RoleWithPermissions } from '@/app/api/role/type';

/**
 * RolePage Component
 * Main page for role management with CRUD operations
 */
const RolePage: React.FC = () => {
  const {
    roles,
    meta,
    isLoading,
    error,
    search,
    isActive,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleStatusFilter,
    handleDelete,
    handleReset,
  } = useTableRole();

  // Permission checks
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(PERMISSIONS.ROLE_CREATE);
  const canEdit = hasPermission(PERMISSIONS.ROLE_EDIT);
  const canDelete = hasPermission(PERMISSIONS.ROLE_DELETE);

  // Dialog states
  const roleDialog = useBoolean();
  const filterDrawer = useBoolean();
  const [dialogState, setDialogState] = useState<{
    mode: 'create' | 'edit';
    role: RoleWithPermissions | null;
  }>({
    mode: 'create',
    role: null,
  });

  // Handlers
  const handleCreateClick = () => {
    setDialogState({ mode: 'create', role: null });
    roleDialog.setTrue();
  };

  const handleEditClick = (role: RoleWithPermissions) => {
    setDialogState({ mode: 'edit', role });
    roleDialog.setTrue();
  };

  const handleDialogClose = () => {
    roleDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      setDialogState({ mode: 'create', role: null });
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
            Role Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage system roles and their permissions
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
            {error.message || 'An error occurred while loading roles'}
          </Typography>
        </Card>
      )}

      {/* Filters */}
      <RoleFilters
        search={search}
        isActive={isActive}
        onSearchChange={handleSearch}
        onFilterClick={filterDrawer.setTrue}
        onReset={handleReset}
      />

      {/* Roles Table */}
      <Box sx={{ mt: 2 }}>
        <RoleTable
          roles={roles}
          isLoading={isLoading}
          isDeleting={isLoading}
          meta={meta}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </Box>

      {/* Role Dialog (Create/Edit) */}
      <RoleForm
        open={roleDialog.value}
        mode={dialogState.mode}
        role={dialogState.role}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />

      {/* Filter Drawer */}
      <RoleFilterDrawer
        open={filterDrawer.value}
        isActive={isActive}
        onClose={filterDrawer.setFalse}
        onStatusChange={handleStatusFilter}
        onApply={filterDrawer.setFalse}
      />
    </Box>
  );
};

export default RolePage;
