import React from 'react';
import { VenturoTable, Typography } from '@/shared/components/venturo-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@/shared/components/venturo-ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface RagTableProps {
  documents: any[];
  isLoading: boolean;
  isDeleting?: boolean;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}

export const RagTable: React.FC<RagTableProps> = ({
  documents,
  isLoading,
  isDeleting = false,
  onEdit,
  onDelete,
}) => {
  const columns: VenturoTableColumn<any>[] = [
    {
      id: 'title',
      header: 'Title',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.title}
        </Typography>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      render: (row) => <Typography variant="body2">{row.source || '-'}</Typography>,
    },
    {
      id: 'chunk_count',
      header: 'Chunks',
      render: (row) => <Typography variant="body2">{row.chunk_count ?? 0}</Typography>,
    },
    {
      id: 'created_at',
      header: 'Created',
      render: (row) => (
        <Typography variant="body2" color="textSecondary">
          {(row.created_at || '').slice(0, 19).replace('T', ' ')}
        </Typography>
      ),
    },
  ];

  const getActions = (row: any): VenturoTableAction<any>[] => [
    {
      icon: <IconEdit size={18} />,
      color: 'primary',
      disabled: isDeleting,
      onClick: () => onEdit(row), // ✅ buka dialog edit
    },
    {
      icon: <IconTrash size={18} />,
      color: 'error',
      disabled: isDeleting,
      needsConfirmation: true,
      confirmationTitle: 'Confirm Delete',
      confirmationMessage: () => `Are you sure you want to delete "${row.title}"?`,
      onClick: () => onDelete(row), // ✅ eksekusi delete dari hook
    },
  ];

  return (
    <VenturoTable
      columns={columns}
      data={documents}
      loading={isLoading}
      actions={getActions}
      emptyState={{
        title: 'No documents found',
        description: 'Try uploading a document for RAG.',
      }}
      getRowKey={(row) => String(row.id)}
    />
  );
};
