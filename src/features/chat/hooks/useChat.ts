// src/app/chat/hooks/useChat.ts - FIXED: Mode persistence on new chat

import { useEffect, useRef, useState } from "react";
import { useSaveDiagnostic, chatApi } from "@/app/api/chat";
import { useQueryClient } from "@tanstack/react-query";
import { storageService } from '@/app/services/storageService';
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
  const queryClient = useQueryClient();

  // ===== STATES =====
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, _setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('chat-mode') as Mode) || 'diagnostic';
    }
    return 'diagnostic';
  });
  const setMode = (newMode: Mode) => {
    localStorage.setItem('chat-mode', newMode);  // ✅ tambah ini
    if (newMode !== mode) {
      setMessages([]);
      setSessionId(crypto.randomUUID());
      setDiagnosticData(null);
      setAttachedFile(null);
      setEngineTopic(null);
      setEngineSubMode(null);
    }
    _setMode(newMode);
  };

  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const voiceRecorder = useVoiceRecorder();
  const [showTopicButtons, setShowTopicButtons] = useState(false);

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
  const sessionIdRef = useRef(sessionId);

  // ===== MUTATIONS =====
  // const sendMessageMutation = useSendMessage();
  const saveDiagnosticMutation = useSaveDiagnostic();
  const handleTopicSelect = (topicLabel: string) => {
    setShowTopicButtons(false); // ✅ sembunyikan buttons
    sendMessage(topicLabel);
  };


  // ===== EFFECTS =====

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
    }
  }, [sessionId]);
  useEffect(() => {
    sessionIdRef.current = sessionId;
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

    // ✅ Placeholder assistant message untuk streaming
    const assistantId = `${Date.now()}-assistant`;
    setMessages((prev) => [...prev, {
      id: assistantId,
      role: "assistant" as const,
      content: "",
    }]);

    try {
      // ✅ Ambil token dari storage
      const token = storageService.get<string>('token') || '';
      abortControllerRef.current = new AbortController();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.airedgo.com'}/core/v1/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            session_id: sessionId,
            mode,
            topic: engineTopic || undefined,
            sub_mode: engineSubMode || undefined,
            message: content,
            attachment_id: attachedFile?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // simpan sisa yang belum lengkap

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]" || data === "[ERROR]") continue;
            if (data) {
              try {
                const parsed = JSON.parse(data);
                fullReply += parsed;
              } catch {
                fullReply += data; // fallback kalau bukan JSON
              }
              setMessages((prev) => prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: fullReply }
                  : msg
              ));
            }
          }
        }
      }

      setAttachedFile(null);

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error("Stream error:", error);
      setMessages((prev) => prev.filter(
        (m) => m.id !== userMessage.id && m.id !== assistantId
      ));
      setInput(content);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['chat-history'] }); // ← tambah ini
    }
  };

  // ✅ newChat - keeps current mode, creates new session
  const newChat = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setDiagnosticData(null);
    setAttachedFile(null);
    setEngineTopic(null);
    setEngineSubMode(null);
    queryClient.invalidateQueries({ queryKey: ['chat-history'] }); // ← tambah ini
  };

  // AFTER
  const handleDiagnosticComplete = async (
    data: DiagnosticData,
    choice: 'explore' | 'skip',
    arahan: string
  ) => {
    _setMode("discuss");
    localStorage.setItem('chat-mode', 'discuss'); // ✅ bypass wrapper, jangan reset session



    // ✅ Cek apakah dari "Mulai Diskusi" di landing (data kosong)
    const isFromDiscussButton = !data.businessStage;

    if (isFromDiscussButton) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hello, Apa yang ingin didiskusikan?",
      };
      setMessages([welcomeMessage]);
      setShowTopicButtons(true); // ✅ tampilkan topic buttons
      return;
    }

    // Save diagnostic (hanya kalau data lengkap)
    if (data.businessStage && data.teamSize && data.position && data.challenges && data.situation && data.perceivedProblem && data.confidence) {
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
      } catch (error) {
        console.error("❌ Failed to save diagnostic:", error);
      }
    }

    _setMode("discuss");  // ✅ sama di bawah


    // const welcomeMessage: ChatMessage = {
    //   id: Date.now().toString(),
    //   role: "assistant",
    //   content:
    //     "Apa yang ingin terlebih dulu kita diskusikan?",
    // };

    // setMessages([welcomeMessage]);
    if (choice === 'explore' && arahan) {
      await sendMessage(arahan);
    }
  };

  // ✅ Handle Engine flow completion - load messages from backend
  const handleEngineComplete = async (
    _analysis: string,
    topic: EngineTopic,
    subMode: EngineSubMode,
    _answers: Record<string, string>
  ) => {
    const currentSessionId = sessionIdRef.current; // ✅ capture dulu sebelum apapun
    console.log("✅ sessionId yang dipakai:", currentSessionId);

    setEngineTopic(topic);
    setEngineSubMode(subMode);
      _setMode("engine");
  localStorage.setItem('chat-mode', 'engine');

    const assistantId = `${Date.now()}-assistant`;
    setMessages([{
      id: assistantId,
      role: "assistant" as const,
      content: "",
    }]);

    setLoading(true);

    try {
      const token = storageService.get<string>('token') || '';
      abortControllerRef.current = new AbortController();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.airedgo.com'}/core/v1/engine/analyze/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            session_id: currentSessionId, // ✅ pakai captured value
            topic,
            sub_mode: subMode,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]" || data === "[ERROR]") continue;
            if (data) {
              try { fullReply += JSON.parse(data); }
              catch { fullReply += data; }

              setMessages((prev) => prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: fullReply }
                  : msg
              ));
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error("Stream error:", error);
      toast.error("Gagal membuat analysis.");
    } finally {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['chat-history'] }); // ← tambah ini
    }
  };
  // ✅ loadChatSession with Engine mode support
 const loadChatSession = async (targetSessionId: string) => {
  try {
    setLoading(true);
    setMessages([]);

    const res = await chatApi.getSessionMessages(targetSessionId);
    console.log("📥 session response:", res.data);

    const resolvedMode = (res.data.session_mode || 'discuss') as Mode;

    _setMode(resolvedMode);
    localStorage.setItem('chat-mode', resolvedMode);

    if (resolvedMode === 'engine') {
      // ✅ Baca dari session level, bukan message
      if (res.data.topic) setEngineTopic(res.data.topic as EngineTopic);
      if (res.data.sub_mode) setEngineSubMode(res.data.sub_mode as EngineSubMode);
    } else {
      setEngineTopic(null);
      setEngineSubMode(null);
    }

    if (!res.data?.messages?.length) {
      setSessionId(targetSessionId);
      return;
    }

    const formattedMessages: ChatMessage[] = res.data.messages.map(
      (msg: BackendChatMessage) => ({
        id: msg.ID.toString(),
        role: msg.Role,
        content: msg.Content,
        timestamp: msg.CreatedAt,
      })
    );

    setSessionId(targetSessionId);
    setMessages(formattedMessages);

  } catch (error) {
    console.error("Failed to load chat:", error);
    toast.error("Gagal memuat chat");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteSession = (deletedSessionId: string) => {
    // kalau yang didelete adalah sesi yang sedang aktif, reset chat
    if (deletedSessionId === sessionId) {
      setMessages([]);
      setSessionId(crypto.randomUUID());
      setDiagnosticData(null);
      setAttachedFile(null);
      setEngineTopic(null);
      setEngineSubMode(null);
    }
  };
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
  };
  // ===== RETURN =====
  return {
    // States
    messages,
    input,
    mode,
    loading,
    diagnosticData,
    showTopicButtons,
    handleTopicSelect,

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
    stopGeneration,

    // Attachment handlers
    handleFileAttach,
    handleRemoveFile,

    // Refs
    messagesEndRef,
    textareaRef,

    // Chat history
    loadChatSession,
    sessionId,
    handleDeleteSession,


    // Voice recorder
    isRecording: voiceRecorder.isRecording,
    recordingTime: voiceRecorder.recordingTime,
    onStartRecording: voiceRecorder.startRecording,
    onStopRecording: voiceRecorder.stopRecording,
    onCancelRecording: voiceRecorder.cancelRecording,
  };
}