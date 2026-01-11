import React, { useEffect } from 'react';
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
import { useFormEditRag } from '../hooks/useFormEditRag';

interface RagEditFormProps {
  open: boolean;
  document: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RagEditForm: React.FC<RagEditFormProps> = ({
  open,
  document,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isSubmitting } = useFormEditRag({
    document,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  // ✅ biar pas dialog kebuka, value selalu ngikut dokumen yg dipilih
  useEffect(() => {
    if (open) form.reset({ title: document?.title ?? '', source: document?.source ?? '' });
  }, [open, document, form]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit RAG Document</DialogTitle>

      <Form form={form} onSubmit={handleFormSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormTextField
              name="title"
              label="Title"
              placeholder="Title"
              fullWidth
              disabled={isSubmitting}
              rules={{ required: 'Title wajib diisi' }}
            />

            <FormTextField
              name="source"
              label="Source"
              placeholder="Source"
              fullWidth
              disabled={isSubmitting}
            />

            {isSubmitting && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <CircularProgress size={18} />
                <span>Updating...</span>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
