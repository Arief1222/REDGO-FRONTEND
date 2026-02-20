// src/app/chat/hooks/useChat.ts - FIXED: Mode persistence on new chat

import { useEffect, useRef, useState } from "react";
import { useSendMessage, useSaveDiagnostic, chatApi } from "@/app/api/chat";
import type { 
  Mode, 
  ChatMessage, 
  DiagnosticData, 
  BackendChatMessage,
  EngineTopic,
  EngineSubMode 
} from "@/app/api/chat";
import { useVoiceRecorder } from './useVoiceRecorder';
import { useToast } from "@/shared/hooks/useToast";

export function useChat() {
  const toast = useToast();

  // ===== STATES =====
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("diagnostic");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const voiceRecorder = useVoiceRecorder();

  // ✅ Engine mode states
  const [engineTopic, setEngineTopic] = useState<EngineTopic | null>(null);
  const [engineSubMode, setEngineSubMode] = useState<EngineSubMode | null>(null);

  // Attachment states
  const [attachedFile, setAttachedFile] = useState<{
    id: number;
    name: string;
    url: string;
  } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // ===== REFS =====
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ===== MUTATIONS =====
  const sendMessageMutation = useSendMessage();
  const saveDiagnosticMutation = useSaveDiagnostic();

  // ===== EFFECTS =====

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 150) + "px";
  }, [input]);

  useEffect(() => {
    if (voiceRecorder.audioBlob && !voiceRecorder.isRecording) {
      handleVoiceUpload(voiceRecorder.audioBlob, voiceRecorder.recordingTime);
      voiceRecorder.resetRecording();
    }
  }, [voiceRecorder.audioBlob, voiceRecorder.isRecording]);

  // ===== HANDLERS =====

  const handleVoiceUpload = async (blob: Blob, duration: number) => {
    if (uploadingFile) return;

    setUploadingFile(true);
    try {
      const file = new File([blob], `voice_${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      console.log("🎤 Uploading voice note:", { duration, size: blob.size });

      const res = await chatApi.uploadChatFile(sessionId, mode, file, duration);

      console.log("✅ Voice uploaded:", res.data);

      const transcription = res.data.transcription || "";

      if (transcription) {
        setInput(transcription);
        toast.success("Voice berhasil ditranskripsi");
      } else {
        toast.error("Transkripsi gagal. Silakan ketik manual atau coba lagi.");
      }

    } catch (error) {
      console.error("Failed to upload voice:", error);
      toast.error("Gagal memproses voice note. Silakan coba lagi.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileAttach = async (file: File) => {
    if (uploadingFile) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setUploadingFile(true);
    try {
      const res = await chatApi.uploadChatFile(sessionId, mode, file);

      setAttachedFile({
        id: res.data.file_id,
        name: res.data.filename,
        url: res.data.file_url,
      });

      console.log("File uploaded:", res.data);
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Gagal upload file. Silakan coba lagi.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // ✅ sendMessage with Engine mode support
  const sendMessage = async (customContent?: string) => {
    const content = customContent || input.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      attachment: attachedFile ? {
        id: attachedFile.id,
        filename: attachedFile.name,
        fileUrl: attachedFile.url,
        fileType: attachedFile.name.split('.').pop() || '',
      } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageMutation.mutateAsync({
        session_id: sessionId,
        mode,
        topic: engineTopic || undefined,
        sub_mode: engineSubMode || undefined,
        message: content,
        attachment_id: attachedFile?.id,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: res.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAttachedFile(null);

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      setInput(content);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ newChat - keeps current mode, creates new session
  const newChat = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setDiagnosticData(null);
    setAttachedFile(null);
    
    // Clear mode-specific states for fresh start
    setEngineTopic(null);
    setEngineSubMode(null);
  };

  const handleDiagnosticComplete = async (data: DiagnosticData) => {
    console.log("📊 Diagnostic completed:", data);
    setDiagnosticData(data);

    if (
      data.businessStage &&
      data.teamSize &&
      data.position &&
      data.challenges &&
      data.situation &&
      data.perceivedProblem &&
      data.confidence
    ) {
      try {
        await saveDiagnosticMutation.mutateAsync({
          session_id: sessionId,
          business_stage: data.businessStage,
          team_size: data.teamSize,
          position: data.position,
          challenges: data.challenges,
          situation: data.situation,
          perceived_problem: data.perceivedProblem,
          confidence: data.confidence,
        });

        console.log("✅ Diagnostic data saved");
      } catch (error) {
        console.error("❌ Failed to save diagnostic:", error);
      }
    }

    setMode("discuss");

    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "Apa yang ingin terlebih dulu kita diskusikan?”",
    };

    setMessages([welcomeMessage]);
  };

  // ✅ Handle Engine flow completion - load messages from backend
  const handleEngineComplete = async (analysis: string, topic: EngineTopic, subMode: EngineSubMode) => {
    console.log("⚙️ Engine analysis completed:", { topic, subMode });
    
    // Set engine states
    setEngineTopic(topic);
    setEngineSubMode(subMode);

    // ✅ Load messages from backend to show the analysis
    // Backend already saved the analysis, so we just fetch it
    try {
      setLoading(true);
      await loadChatSession(sessionId);
    } catch (error) {
      console.error("Failed to load messages:", error);
      
      // Fallback: show analysis in UI even if load fails
      const analysisMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: analysis,
      };
      setMessages([analysisMessage]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ loadChatSession with Engine mode support
  const loadChatSession = async (targetSessionId: string) => {
    try {
      console.log("🔄 Loading chat session:", targetSessionId);
      setLoading(true);
      setMessages([]);

      const res = await chatApi.getSessionMessages(targetSessionId);
      console.log("📥 Raw response:", JSON.stringify(res.data, null, 2));

      if (!res.data || !res.data.messages || res.data.messages.length === 0) {
        console.log("⚠️ No messages found");
        setSessionId(targetSessionId);
        setMessages([]);
        setMode("discuss");
        return;
      }

      // ✅ Get mode, topic, and sub_mode from last message
      const lastBackendMsg = res.data.messages[res.data.messages.length - 1];
      
      if (
        lastBackendMsg?.Mode &&
        ["diagnostic", "discuss", "engine", "explorer"].includes(lastBackendMsg.Mode)
      ) {
        setMode(lastBackendMsg.Mode as Mode);
        
        // ✅ Set Engine mode states if available
        if (lastBackendMsg.Mode === 'engine') {
          if (lastBackendMsg.Topic) {
            setEngineTopic(lastBackendMsg.Topic as EngineTopic);
          }
          if (lastBackendMsg.SubMode) {
            setEngineSubMode(lastBackendMsg.SubMode as EngineSubMode);
          }
        }
      } else {
        setMode("discuss");
      }

      // Map messages
      const formattedMessages: ChatMessage[] = res.data.messages.map(
        (msg: BackendChatMessage) => ({
          id: msg.ID.toString(),
          role: msg.Role,
          content: msg.Content,
          timestamp: msg.CreatedAt,
        })
      );

      console.log("✅ Formatted messages count:", formattedMessages.length);

      setSessionId(targetSessionId);
      setMessages(formattedMessages);

    } catch (error) {
      console.error("Failed to load chat:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosErr = error as { response?: { status: number; data: unknown } };
        console.error("Status:", axiosErr.response?.status);
        console.error("Response body:", axiosErr.response?.data);
      }
      toast.error("Gagal memuat chat");
    } finally {
      setLoading(false);
    }
  };

  // ===== RETURN =====
  return {
    // States
    messages,
    input,
    mode,
    loading,
    diagnosticData,

    // ✅ Engine mode states
    engineTopic,
    engineSubMode,

    // Attachment states
    attachedFile,
    uploadingFile,

    // Setters
    setInput,
    setMode,

    // Handlers
    sendMessage,
    newChat,
    handleDiagnosticComplete,
    handleEngineComplete,

    // Attachment handlers
    handleFileAttach,
    handleRemoveFile,

    // Refs
    messagesEndRef,
    textareaRef,

    // Chat history
    loadChatSession,
    sessionId,

    // Voice recorder
    isRecording: voiceRecorder.isRecording,
    recordingTime: voiceRecorder.recordingTime,
    onStartRecording: voiceRecorder.startRecording,
    onStopRecording: voiceRecorder.stopRecording,
    onCancelRecording: voiceRecorder.cancelRecording,
  };
}