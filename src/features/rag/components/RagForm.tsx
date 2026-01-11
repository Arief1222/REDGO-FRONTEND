import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Form,
  FormTextField,
  CircularProgress,
} from '@/shared/components/venturo-ui';

import { useFormRag } from '../hooks/useFormRag';

interface RagFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RagForm: React.FC<RagFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isSubmitting } = useFormRag({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;
    form.reset();
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload RAG Document</DialogTitle>

      <Form form={form} onSubmit={handleFormSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormTextField
              name="title"
              label="Title"
              placeholder="Optional (default filename)"
              fullWidth
              disabled={isSubmitting}
            />

            <FormTextField
              name="source"
              label="Source"
              placeholder="upload"
              fullWidth
              disabled={isSubmitting}
            />

            {/* input file */}
            <Box>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                disabled={isSubmitting}
                onChange={(e) => form.setValue('file', e.target.files as any)}
              />
            </Box>

            {isSubmitting && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <CircularProgress size={18} />
                <span>Uploading & indexing...</span>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Upload
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
