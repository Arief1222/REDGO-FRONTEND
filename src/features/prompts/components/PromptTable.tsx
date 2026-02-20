import React from 'react';
import { VenturoTable, Typography, Chip } from '@/shared/components/venturo-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@/shared/components/venturo-ui';
import { IconEdit } from '@tabler/icons-react';

interface PromptTableProps {
  prompts: any[];
  isLoading: boolean;
  onEdit: (row: any) => void;
}

const MODE_COLOR: Record<string, any> = {
  engine: 'primary',
  explorer: 'secondary',
  discuss: 'default',
};

export const PromptTable: React.FC<PromptTableProps> = ({ prompts, isLoading, onEdit }) => {
  const columns: VenturoTableColumn<any>[] = [
    {
      id: 'mode',
      header: 'Mode',
      render: (row) => (
        <Chip
          label={row.mode.toUpperCase()}
          color={MODE_COLOR[row.mode] ?? 'default'}
          size="small"
        />
      ),
    },
    // ✅ Kolom baru: Topic
    {
      id: 'topic',
      header: 'Topic',
      render: (row) =>
        row.topic ? (
          <Chip
            label={row.topic.replace(/_/g, ' ').toUpperCase()}
            color="info"
            size="small"
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            —
          </Typography>
        ),
    },
    // ✅ Kolom baru: Sub Mode
    {
      id: 'sub_mode',
      header: 'Sub Mode',
      render: (row) =>
        row.sub_mode ? (
          <Chip
            label={row.sub_mode.toUpperCase()}
            color={row.sub_mode === 'idea' ? 'success' : 'warning'}
            size="small"
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            —
          </Typography>
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
            maxWidth: 350,
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