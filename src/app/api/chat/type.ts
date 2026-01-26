export type Mode = 'advisor' | 'explorer' | 'diagnostic' | 'discuss';

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

// ➕ TAMBAH: Types untuk diagnostic
export type DiagnosticData = {
  businessStage?: string;
  teamSize?: string;
  position?: string;
  challenges?: string[];
  situation?: string;
  perceivedProblem?: string;
  confidence?: string;
};

export type SaveDiagnosticRequest = {
  session_id: string;
  business_stage: string;
  team_size: string;
  position: string;
  challenges: string[];
  situation: string;
  perceived_problem: string;
  confidence: string;
};

export type SaveDiagnosticResponse = {
  session_id: string;
  status: string;
  message: string;
};