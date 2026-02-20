export type Mode = 'default' | 'engine' | 'explorer';

export type ChatPrompt = {
  id: number;
  mode: Mode;
  system_prompt: string;
  model: string;
  topic?: string;        // ✅ NEW: for engine mode
  sub_mode?: string;     // ✅ NEW: for engine mode
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdatePromptRequest = {
  system_prompt: string;
  topic?: string;        // ✅ NEW: for engine mode 
  sub_mode?: string;     // ✅ NEW: for engine mode
  model: string;
};

export type PromptsResponse = {
  data: ChatPrompt[];
};

export type PromptResponse = {
  data: ChatPrompt;
};