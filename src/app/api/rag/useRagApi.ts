import { useMutation, useQuery } from '@tanstack/react-query';
import { ragApi } from './ragApi';

export const useRagDocuments = () =>
  useQuery({
    queryKey: ['rag-documents'],
    queryFn: async () => {
      const res = await ragApi.listDocuments();
      return res.data; // sesuaikan kalau apiService bungkus response beda
    },
  });

export const useUploadRagDocument = () =>
  useMutation({
    mutationFn: async (payload: { file: File; title?: string; source?: string }) => {
      const res = await ragApi.uploadDocument(payload.file, {
        title: payload.title,
        source: payload.source,
      });
      return res.data;
    },
  });
