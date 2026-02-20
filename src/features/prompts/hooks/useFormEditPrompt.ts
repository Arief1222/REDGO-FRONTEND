import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/shared/hooks/useToast';
import { promptApi } from '@/app/api/prompt';

export type EditPromptFormData = {
  system_prompt: string;
  model: string;
};

interface UseFormEditPromptOptions {
  prompt?: any | null;
  onSuccess?: () => void;
}

export const useFormEditPrompt = ({ prompt, onSuccess }: UseFormEditPromptOptions) => {
  const toast = useToast();

  const defaultValues: EditPromptFormData = useMemo(
    () => ({
      system_prompt: prompt?.system_prompt ?? '',
      model: prompt?.model ?? 'gpt-4.1-mini',
    }),
    [prompt],
  );

  const form = useForm<EditPromptFormData>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (data: EditPromptFormData) => {
    if (!prompt?.mode) {
      toast.error('Prompt invalid');
      return;
    }

    try {
      // ✅ Kirim topic dan sub_mode ke API
      await promptApi.update(prompt.mode, {
        system_prompt: data.system_prompt,
        model: data.model,
        topic: prompt.topic ?? undefined,
        sub_mode: prompt.sub_mode ?? undefined,
      });

      toast.success('Prompt updated successfully');
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update prompt');
      throw e;
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};