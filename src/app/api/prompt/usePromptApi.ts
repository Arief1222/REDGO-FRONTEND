import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promptApi } from './promptApi';
import type { UpdatePromptRequest } from './type';

export const usePrompts = () =>
  useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const res = await promptApi.getAll();
      return res.data.data;
    },
  });

export const usePromptByMode = (mode: string) =>
  useQuery({
    queryKey: ['prompt', mode],
    queryFn: async () => {
      const res = await promptApi.getByMode(mode);
      return res.data.data;
    },
    enabled: !!mode,
  });

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      mode, 
      payload 
    }: { 
      mode: string; 
      payload: UpdatePromptRequest 
    }) => {
      const res = await promptApi.update(mode, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};