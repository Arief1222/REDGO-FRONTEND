import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Card, Stack, TextField } from '@/shared/components/venturo-ui';
import { IconRefresh } from '@tabler/icons-react';

import { PromptTable } from './components/PromptTable';
import { PromptEditForm } from './components/PromptEditForm';
import { useTablePrompt } from './hooks/useTablePrompt';
import { useBoolean } from '@/shared/hooks';

const PromptPage: React.FC = () => {
  const { prompts, isLoading, isError, error, search, handleSearch, refetch } = useTablePrompt();

  const editDialog = useBoolean();
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEditOpen = (row: any) => {
    setSelectedPrompt(row);
    editDialog.setTrue();
  };

  const handleEditClose = () => {
    editDialog.setFalse();
    setTimeout(() => setSelectedPrompt(null), 200);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            Prompt Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Configure AI prompts and models for different modes
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<IconRefresh size={20} />}
          onClick={refetch}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {isError && (
        <Card sx={{ mb: 2, p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            {(error as any)?.message || 'Failed to load prompts'}
          </Typography>
        </Card>
      )}

      <Stack direction="column" gap={2}>
        <Box sx={{ maxWidth: 320 }}>
          <TextField
            label="Search prompt"
            placeholder="Search by mode..."
            fullWidth
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
        </Box>

        <PromptTable prompts={prompts} isLoading={isLoading} onEdit={handleEditOpen} />
      </Stack>

      <PromptEditForm
        open={editDialog.value}
        prompt={selectedPrompt}
        onClose={handleEditClose}
        onSuccess={() => {
          refetch();
          handleEditClose();
        }}
      />
    </Box>
  );
};

export default PromptPage;