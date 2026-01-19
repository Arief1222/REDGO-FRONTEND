import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Form,
  CircularProgress,
} from '@/shared/components/venturo-ui';
import { useFormEditPrompt } from '../hooks/useFormEditPrompt';

interface PromptEditFormProps {
  open: boolean;
  prompt: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PromptEditForm: React.FC<PromptEditFormProps> = ({
  open,
  prompt,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isSubmitting } = useFormEditPrompt({
    prompt,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  // ✅ biar pas dialog kebuka, value selalu ngikut prompt yg dipilih
  useEffect(() => {
    if (open && prompt) {
      form.reset({
        system_prompt: prompt.system_prompt ?? '',
        model: prompt.model ?? 'gpt-4.1-mini',
      });
    }
  }, [open, prompt, form]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Prompt - {prompt?.mode}</DialogTitle>

      <Form form={form} onSubmit={handleFormSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Model Selector */}
            <Box>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Model
              </label>
              <select
                {...form.register('model')}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              >
                <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                <option value="gpt-4.1">GPT-4.1</option>
                <option value="gpt-5.1">GPT-5.1</option>
              </select>
            </Box>

            {/* System Prompt */}
            <Box>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                System Prompt
              </label>
              <textarea
                {...form.register('system_prompt', {
                  required: 'System prompt wajib diisi',
                })}
                disabled={isSubmitting}
                rows={16}
                placeholder="Enter system prompt..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
              {form.formState.errors.system_prompt && (
                <span style={{ color: 'red', fontSize: 12, marginTop: 4, display: 'block' }}>
                  {form.formState.errors.system_prompt.message}
                </span>
              )}
              <span style={{ fontSize: 12, color: '#666', marginTop: 4, display: 'block' }}>
                {form.watch('system_prompt')?.length || 0} characters
              </span>
            </Box>

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
            Save Changes
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};