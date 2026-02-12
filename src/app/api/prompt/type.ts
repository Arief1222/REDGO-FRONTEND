export type Mode = 'default' | 'engine' | 'explorer';

export type ChatPrompt = {
  id: number;
  mode: Mode;
  system_prompt: string;
  model: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdatePromptRequest = {
  system_prompt: string;
  model: string;
};

export type PromptsResponse = {
  data: ChatPrompt[];
};

export type PromptResponse = {
  data: ChatPrompt;
};