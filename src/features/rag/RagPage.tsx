import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Card, Stack, TextField } from '@/shared/components/venturo-ui';
import { IconPlus } from '@tabler/icons-react';

import { RagTable } from './components/RagTable';
import { RagForm } from './components/RagForm';
import { RagEditForm } from './components/RagEditForm';
import { useTableRag } from './hooks/useTableRag';
import { useBoolean } from '@/shared/hooks';

const RagPage: React.FC = () => {
  const {
    documents,
    isLoading,
    isDeleting,
    isError,
    error,
    search,
    handleSearch,
    refetch,
    handleDelete,
  } = useTableRag();

  const uploadDialog = useBoolean();
  const editDialog = useBoolean();
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEditOpen = (row: any) => {
    setSelectedDoc(row);
    editDialog.setTrue();
  };

  const handleEditClose = () => {
    editDialog.setFalse();
    setTimeout(() => setSelectedDoc(null), 200);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            RAG Documents
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Upload files and store chunks for retrieval
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<IconPlus size={20} />}
          onClick={uploadDialog.setTrue}
          disabled={isLoading}
        >
          Upload File
        </Button>
      </Box>

      {isError && (
        <Card sx={{ mb: 2, p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            {(error as any)?.message || 'Failed to load documents'}
          </Typography>
        </Card>
      )}

      <Stack direction="column" gap={2}>
        <Box sx={{ maxWidth: 320 }}>
          <TextField
            label="Search document"
            placeholder="Search by title..."
            fullWidth
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
        </Box>

        <RagTable
          documents={documents}
          isLoading={isLoading}
          isDeleting={isDeleting}
          onEdit={handleEditOpen}
          onDelete={handleDelete}
        />
      </Stack>

      <RagForm
        open={uploadDialog.value}
        onClose={uploadDialog.setFalse}
        onSuccess={() => {
          refetch();
          uploadDialog.setFalse();
        }}
      />

      <RagEditForm
        open={editDialog.value}
        document={selectedDoc}
        onClose={handleEditClose}
        onSuccess={() => {
          refetch();
          handleEditClose();
        }}
      />
    </Box>
  );
};

export default RagPage;
