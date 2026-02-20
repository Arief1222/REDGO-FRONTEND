// src/app/api/chat/chatApi.ts - UPDATED VERSION

import { apiService } from '@/app/services/apiService';
import type {
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryResponse,
  ChatSession,
  SaveDiagnosticRequest,
  SaveDiagnosticResponse,
  UploadChatFileResponse,
  SessionMessagesResponse,
  EngineTopicsResponse,
  EngineQuestionsResponse,
  SaveEngineAnswersRequest,
  SaveEngineAnswersResponse,
  GenerateEngineAnalysisRequest,
  GenerateEngineAnalysisResponse,
} from './type';
import { update } from 'lodash';

export const chatApi = {
  // ===== Regular Chat =====
  sendMessage: (payload: SendMessageRequest) =>
    apiService.post<SendMessageResponse>('/core/v1/chat', payload),

  uploadChatFile: (
    sessionId: string,
    mode: string,
    file: File,
    duration?: number
  ) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('mode', mode);
    formData.append('file', file);
    if (duration !== undefined) {
      formData.append('duration', duration.toString());
    }

    return apiService.post<UploadChatFileResponse>(
      '/core/v1/chat/upload',
      formData
    );
  },

  // ===== Chat History =====
  getChatHistory: (params?: { limit?: number }) =>
    apiService.get<ChatHistoryResponse>(
      '/core/v1/chat/history',
      params ?? { limit: 20 }
    ),

  getSessionMessages: (sessionId: string, params?: { limit?: number }) =>
    apiService.get<SessionMessagesResponse>(
      `/core/v1/chat/sessions/${sessionId}`,
      params ?? { limit: 50 }
    ),

  deleteSession: (sessionId: string) =>
    apiService.delete(`/core/v1/chat/sessions/${sessionId}`),

  updateSessionTitle: (sessionId: string, title: string) =>
    apiService.put(`/core/v1/chat/sessions/${sessionId}/title`, { title }),

  getSession: (sessionId: string) =>
    apiService.get<ChatSession>(`/core/v1/chat/sessions/${sessionId}`),

  // ===== Diagnostic =====
  saveDiagnostic: (payload: SaveDiagnosticRequest) =>
    apiService.post<SaveDiagnosticResponse>('/core/v1/diagnostic/save', payload),

  analyzeDiagnostic: (payload: SaveDiagnosticRequest) =>
    apiService.post<{ analysis: string }>('/core/v1/diagnostic/analyze', payload),

  // ✅ NEW: Engine Mode Endpoints
  getEngineTopics: () =>
    apiService.get<EngineTopicsResponse>('/core/v1/engine/topics'),

  getEngineQuestions: (topic: string, subMode: string) =>
    apiService.get<EngineQuestionsResponse>('/core/v1/engine/questions', {
      topic,
      sub_mode: subMode,
    }),

  saveEngineAnswers: (payload: SaveEngineAnswersRequest) =>
    apiService.post<SaveEngineAnswersResponse>('/core/v1/engine/answers', payload),

  generateEngineAnalysis: (payload: GenerateEngineAnalysisRequest) =>
    apiService.post<GenerateEngineAnalysisResponse>('/core/v1/engine/analyze', payload),
};