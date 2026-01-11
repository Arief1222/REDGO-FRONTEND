import React from 'react';
import { VenturoTable, Chip, Box, Typography } from '@/shared/components/venturo-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@/shared/components/venturo-ui';
import { IconEdit, IconTrash, IconUsers } from '@tabler/icons-react';
import type { RoleWithPermissions } from '@/app/api/role/type';

interface RoleTableProps {
  roles: RoleWithPermissions[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (role: RoleWithPermissions) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  isLoading,
  isDeleting,
  meta,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  canEdit = true,
  canDelete = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<RoleWithPermissions>[] = [
    {
      id: 'name',
      header: 'Role Name',
      render: (role) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {role.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {role.description}
          </Typography>
        </Box>
      )
    },
    {
      id: 'status',
      header: 'Status',
      render: (role) => (
        <Chip
          label={role.is_active ? 'Active' : 'Inactive'}
          color={role.is_active ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      id: 'permissions',
      header: 'Permissions',
      render: (role) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconUsers size={16} />
          <Typography variant="body2">
            {role.permissions?.length || 0} permissions
          </Typography>
        </Box>
      )
    },
    {
      id: 'created',
      header: 'Created',
      render: (role) => (
        <Typography variant="body2">
          {new Date(role.created_at).toLocaleDateString()}
        </Typography>
      )
    }
  ];

  // Action buttons configuration
  const getActions = (role: RoleWithPermissions): VenturoTableAction<RoleWithPermissions>[] => {
    const actions: VenturoTableAction<RoleWithPermissions>[] = [];

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(role),
        color: 'primary',
        disabled: isDeleting
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(role.id),
        color: 'error',
        disabled: isDeleting,
        needsConfirmation: true,
        confirmationTitle: 'Confirm Delete',
        confirmationMessage: () =>
          `Are you sure you want to delete role ${role.name}? This action cannot be undone.`
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={roles}
      loading={isLoading}
      loadingText="Loading roles..."
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        icon: <IconUsers size={48} />,
        title: 'No roles found',
        description: 'Create your first role to get started with role management.'
      }}
      getRowKey={(role) => role.id}
    />
  );
};
