import React from 'react';
import { VenturoTable, Typography, Chip } from '@/shared/components/venturo-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@/shared/components/venturo-ui';
import { IconEdit } from '@tabler/icons-react';

interface PromptTableProps {
  prompts: any[];
  isLoading: boolean;
  onEdit: (row: any) => void;
}

export const PromptTable: React.FC<PromptTableProps> = ({ prompts, isLoading, onEdit }) => {
  const columns: VenturoTableColumn<any>[] = [
    {
      id: 'mode',
      header: 'Mode',
      render: (row) => (
        <Chip
          label={row.mode.toUpperCase()}
          color={
            row.mode === 'engine' ? 'primary' : row.mode === 'explorer' ? 'secondary' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      id: 'model',
      header: 'Model',
      render: (row) => (
        <Typography variant="body2" fontFamily="monospace">
          {row.model}
        </Typography>
      ),
    },
    {
      id: 'system_prompt',
      header: 'System Prompt',
      render: (row) => (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          {row.system_prompt}
        </Typography>
      ),
    },
    {
      id: 'updated_at',
      header: 'Last Updated',
      render: (row) => (
        <Typography variant="body2" color="textSecondary">
          {new Date(row.updated_at).toLocaleString()}
        </Typography>
      ),
    },
  ];

  const getActions = (row: any): VenturoTableAction<any>[] => [
    {
      icon: <IconEdit size={18} />,
      color: 'primary',
      onClick: () => onEdit(row),
    },
  ];

  return (
    <VenturoTable
      columns={columns}
      data={prompts}
      loading={isLoading}
      actions={getActions}
      emptyState={{
        title: 'No prompts found',
        description: 'Prompts will appear here.',
      }}
      getRowKey={(row) => String(row.id)}
    />
  );
};