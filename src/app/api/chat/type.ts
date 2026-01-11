export type Mode = 'default' | 'advisor' | 'explorer';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

export type ChatSession = {
  session_id: string;
  mode: Mode;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
};

export type SendMessageRequest = {
  session_id: string;
  mode: Mode;
  message: string;
};

export type SendMessageResponse = {
  reply: string;
  session_id: string;
  mode: Mode;
};

export type ChatHistoryResponse = {
  sessions: ChatSession[];
  total: number;
};