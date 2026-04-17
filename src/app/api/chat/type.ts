// src/app/api/chat/type.ts - UPDATED VERSION

export type Mode = 'diagnostic' | 'discuss' | 'engine' | 'explorer';

// ✅ NEW: Engine types
export type EngineTopic = 
  | 'pricing' 
  | 'branding' 
  | 'marketing' 
  | 'positioning'
  | 'digital_marketing'
  | 'content_plan'
  | 'sales_system'
  | 'market_analyst'
  | 'product_development';

export type EngineSubMode = 'idea' | 'analysis';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  attachment?: {
    id: number;
    filename: string;
    fileUrl: string;
    fileType: string;
  };
  created_at?: string;
};

export type ChatSession = {
  session_id: string;
  user_id: string;
  title?: string;
  mode: Mode;
  topic?: string;        // ✅ NEW
  sub_mode?: string;     // ✅ NEW
  created_at: string;
  updated_at: string;
};

export type SendMessageRequest = {
  session_id: string;
  mode: Mode;
  topic?: string;        // ✅ NEW: for engine mode
  sub_mode?: string;     // ✅ NEW: for engine mode
  message: string;
  attachment_id?: number; 
};

export type SendMessageResponse = {
  reply: string;
  session_id: string;
  mode: Mode;
  topic?: string;        // ✅ NEW
  sub_mode?: string;     // ✅ NEW
};

export type ChatHistoryResponse = {
  sessions: ChatSession[];
  total: number;
};

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

export type UploadChatFileResponse = {
  file_id: number;
  file_url: string;
  filename: string;
  transcription?: string;
};

export type BackendChatMessage = {
  ID: number;
  SessionID: string;
  Role: 'user' | 'assistant';
  Mode: string;
  Topic?: string;        // ✅ NEW
  SubMode?: string;      // ✅ NEW
  Model: string;
  Content: string;
  AttachmentID: number | null;
  CreatedAt: string;
};

export type SessionMessagesResponse = {
  session_id: string;
  messages: BackendChatMessage[];
  total: number;
  session_mode: string; 
   topic?: string;     // ✅ tambah
  sub_mode?: string;
};

// ✅ NEW: Engine mode types
export type EngineQuestion = {
  key: string;
  question: string;
  order: number;
  hint?: string;
};

export type EngineTopicConfig = {
  topic: string;
  sub_mode: string;
  title: string;
  description: string;
  questions: EngineQuestion[];
  output: string[];
};

export type EngineAnswers = {
  [key: string]: string;
};

export type EngineTopicsResponse = {
  topics: EngineTopic[];
};

export type EngineQuestionsResponse = EngineTopicConfig;

export type SaveEngineAnswersRequest = {
  session_id: string;
  topic: string;
  sub_mode: string;
  answers: EngineAnswers;
};

export type SaveEngineAnswersResponse = {
  session_id: string;
  status: string;
  message: string;
};

export type GenerateEngineAnalysisRequest = {
  session_id: string;
  topic: string;
  sub_mode: string;
};

export type GenerateEngineAnalysisResponse = {
  session_id: string;
  topic: string;
  sub_mode: string;
  analysis: string;
};