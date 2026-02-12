// src/app/api/chat/useChatApi.ts - UPDATED VERSION

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type {
  SendMessageRequest,
  SaveDiagnosticRequest,
  SaveEngineAnswersRequest,
  GenerateEngineAnalysisRequest,
} from './type';

// ===== Chat Queries =====
export const useChatHistory = (params?: { limit?: number }) =>
  useQuery({
    queryKey: ['chat-history', params],
    queryFn: async () => {
      const res = await chatApi.getChatHistory(params);
      return res.data;
    },
  });

export const useSessionMessages = (sessionId: string, enabled: boolean = true) =>
  useQuery({
    queryKey: ['session-messages', sessionId],
    queryFn: async () => {
      const res = await chatApi.getSessionMessages(sessionId);
      return res.data;
    },
    enabled: enabled && !!sessionId,
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

// ===== Chat Mutations =====
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessageRequest) => {
      const res = await chatApi.sendMessage(payload);
      return res.data;
    },
    onSuccess: () => {
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

// ===== Diagnostic =====
export const useSaveDiagnostic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveDiagnosticRequest) => {
      const res = await chatApi.saveDiagnostic(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};

// ✅ NEW: Engine Mode Hooks
export const useEngineTopics = () =>
  useQuery({
    queryKey: ['engine-topics'],
    queryFn: async () => {
      const res = await chatApi.getEngineTopics();
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - topics rarely change
  });

export const useEngineQuestions = (topic: string, subMode: string, enabled: boolean = true) =>
  useQuery({
    queryKey: ['engine-questions', topic, subMode],
    queryFn: async () => {
      const res = await chatApi.getEngineQuestions(topic, subMode);
      return res.data;
    },
    enabled: enabled && !!topic && !!subMode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useSaveEngineAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveEngineAnswersRequest) => {
      const res = await chatApi.saveEngineAnswers(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};

export const useGenerateEngineAnalysis = () =>
  useMutation({
    mutationFn: async (payload: GenerateEngineAnalysisRequest) => {
      const res = await chatApi.generateEngineAnalysis(payload);
      return res.data;
    },
  });