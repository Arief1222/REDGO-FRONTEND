import React from 'react';
import { VenturoTable, Chip, Typography } from '@/shared/components/venturo-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@/shared/components/venturo-ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { User } from '@/app/api/user/type';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
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
  const columns: VenturoTableColumn<User>[] = [
    {
      id: 'name',
      header: 'Name',
      render: (user) => (
        <Typography variant="body2" fontWeight={500}>
          {user.name}
        </Typography>
      )
    },
    {
      id: 'email',
      header: 'Email',
      render: (user) => (
        <Typography variant="body2" color="textSecondary">
          {user.email}
        </Typography>
      )
    },
    {
      id: 'role',
      header: 'Role',
      render: (user) => (
        <Typography variant="body2">
          {user.role?.name || '-'}
        </Typography>
      )
    },
    {
      id: 'status',
      header: 'Status',
      render: (user) => (
        <Chip
          label={user.is_active ? 'Active' : 'Inactive'}
          color={user.is_active ? 'success' : 'error'}
          size="small"
        />
      )
    }
  ];

  // Action buttons configuration
  const getActions = (user: User): VenturoTableAction<User>[] => {
    const actions: VenturoTableAction<User>[] = [];

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(user),
        color: 'primary',
        disabled: isDeleting
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(user.id),
        color: 'error',
        disabled: isDeleting,
        needsConfirmation: true,
        confirmationTitle: 'Confirm Delete',
        confirmationMessage: () =>
          `Are you sure you want to delete user ${user.name}? This action cannot be undone.`
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={users}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No users found',
        description: 'Try adjusting your search or filter to find what you are looking for.'
      }}
      getRowKey={(user) => user.id}
    />
  );
};
