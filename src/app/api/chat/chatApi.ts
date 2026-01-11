import { apiService } from '@/app/services/apiService';
import type { 
  SendMessageRequest, 
  SendMessageResponse, 
  ChatHistoryResponse,
  ChatSession 
} from './type';

export const chatApi = {
  sendMessage: (payload: SendMessageRequest) =>
    apiService.post<SendMessageResponse>('/core/v1/chat', payload),

  getChatHistory: (params?: { limit?: number; page?: number }) =>
    apiService.get<ChatHistoryResponse>('/core/v1/chat/history', params ?? { limit: 20, page: 1 }),

  getSession: (sessionId: string) =>
    apiService.get<ChatSession>(`/core/v1/chat/sessions/${sessionId}`),

  deleteSession: (sessionId: string) =>
    apiService.delete(`/core/v1/chat/sessions/${sessionId}`),

  clearAllSessions: () =>
    apiService.delete('/core/v1/chat/sessions'),
};