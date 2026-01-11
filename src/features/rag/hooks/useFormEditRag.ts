import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/shared/hooks/useToast';
import { ragApi } from '@/app/api/rag';

export type EditRagFormData = {
  title?: string;
  source?: string;
};

interface UseFormEditRagOptions {
  document?: any | null;
  onSuccess?: () => void;
}

export const useFormEditRag = ({ document, onSuccess }: UseFormEditRagOptions) => {
  const toast = useToast();

  const defaultValues: EditRagFormData = useMemo(
    () => ({
      title: document?.title ?? '',
      source: document?.source ?? '',
    }),
    [document],
  );

  const form = useForm<EditRagFormData>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (data: EditRagFormData) => {
    if (!document?.id) {
      toast.error('Document invalid');
      return;
    }

    try {
      await ragApi.updateDocument(Number(document.id), {
        title: data.title || undefined,
        source: data.source || undefined,
      });

      toast.success('Document updated');
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed update document');
      throw e;
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
