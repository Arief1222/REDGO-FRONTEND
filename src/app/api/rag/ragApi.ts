import { apiService } from '@/app/services/apiService';
import type { UploadRagResponse } from './type';

export const ragApi = {
  listDocuments: (params?: { limit?: number; page?: number; search?: string }) =>
    apiService.get('/core/v1/rag/documents', params ?? { limit: 100, page: 1 }),

  updateDocument: (id: number, payload: { title?: string; source?: string }) =>
    apiService.put(`/core/v1/rag/documents/${id}`, payload),

  deleteDocument: (id: number) =>
    apiService.delete(`/core/v1/rag/documents/${id}`),

  uploadDocument: (file: File, data?: { title?: string; source?: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data?.title) formData.append('title', data.title);
    if (data?.source) formData.append('source', data.source);

    // sama persis kayak itemApi: pakai post biasa
    return apiService.post<UploadRagResponse>(
      '/core/v1/rag/documents/upload',
      formData,
    );
  },

  listChunks: (documentId: number) =>
    apiService.get<any[]>(
      `/core/v1/rag/documents/${documentId}/chunks`,
      {},
    ),
};
