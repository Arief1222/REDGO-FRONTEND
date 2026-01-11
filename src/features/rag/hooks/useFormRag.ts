import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/shared/hooks/useToast';
import { ragApi } from '@/app/api/rag';

export type RagFormMode = 'upload';

export type UploadRagFormData = {
  title?: string;
  source?: string;
  file: FileList; // input type="file" (react-hook-form enaknya FileList)
};

interface UseFormRagOptions {
  onSuccess?: () => void;
}

export const useFormRag = ({ onSuccess }: UseFormRagOptions) => {
  const toast = useToast();

  const defaultValues: UploadRagFormData = useMemo(
    () => ({
      title: '',
      source: 'upload',
      file: undefined as any,
    }),
    [],
  );

  const form = useForm<UploadRagFormData>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  // mutation sederhana (tanpa useMutation) biar mirip pola yang kamu suka.
  // Kalau kamu mau react-query, bilang ya nanti aku bikin versi useUploadRagDocument().
  const onSubmit = async (data: UploadRagFormData) => {
    try {
      const f = data.file?.[0];
      if (!f) {
        toast.error('File wajib diisi');
        return;
      }

      await ragApi.uploadDocument(f, {
        title: data.title || undefined,
        source: data.source || undefined,
      });

      toast.success('Document uploaded & indexed!');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Upload failed';
      toast.error(msg);
      throw err;
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
