import { apiService } from '@/app/services/apiService';
import type { 
  PromptsResponse, 
  PromptResponse, 
  UpdatePromptRequest 
} from './type';

export const promptApi = {
  getAll: () =>
    apiService.get<PromptsResponse>('/core/v1/prompts'),

  getByMode: (mode: string) =>
    apiService.get<PromptResponse>(`/core/v1/prompts/${mode}`),

  update: (mode: string, payload: UpdatePromptRequest) =>
    apiService.put<{ message: string }>(`/core/v1/prompts/${mode}`, payload),
};