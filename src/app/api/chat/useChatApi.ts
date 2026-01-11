import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type { SendMessageRequest } from './type';

export const useChatHistory = (params?: { limit?: number; page?: number }) =>
  useQuery({
    queryKey: ['chat-history', params],
    queryFn: async () => {
      const res = await chatApi.getChatHistory(params);
      return res.data;
    },
  });

export const useChatSession = (sessionId: string) =>
  useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: async () => {
      const res = await chatApi.getSession(sessionId);
      return res.data;
    },
    enabled: !!sessionId,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessageRequest) => {
      const res = await chatApi.sendMessage(payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate chat history to refresh
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await chatApi.deleteSession(sessionId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};

export const useClearAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await chatApi.clearAllSessions();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};
