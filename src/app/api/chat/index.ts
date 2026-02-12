// src/app/api/chat/index.ts - UPDATED VERSION

export type {
  Mode,
  ChatMessage,
  BackendChatMessage,
  ChatSession,
  SessionMessagesResponse,
  ChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
  DiagnosticData,
  UploadChatFileResponse,
  // ✅ NEW: Engine exports
  EngineTopic,
  EngineSubMode,
  EngineQuestion,
  EngineTopicConfig,
  EngineAnswers,
  EngineTopicsResponse,
  EngineQuestionsResponse,
  SaveEngineAnswersRequest,
  SaveEngineAnswersResponse,
  GenerateEngineAnalysisRequest,
  GenerateEngineAnalysisResponse,
} from './type';

export { chatApi } from './chatApi';

export {
  useSendMessage,
  useSaveDiagnostic,
  useChatHistory,
  useDeleteSession,
  useSessionMessages,
  useChatSession,
  // ✅ NEW: Engine hooks
  useEngineTopics,
  useEngineQuestions,
  useSaveEngineAnswers,
  useGenerateEngineAnalysis,
} from './useChatApi';