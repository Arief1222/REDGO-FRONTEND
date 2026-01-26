import { useEffect, useRef, useState } from "react";
import { useSendMessage, useSaveDiagnostic } from "@/app/api/chat";
import type { Mode, ChatMessage, DiagnosticData } from "@/app/api/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("diagnostic"); // Default ke diagnostic
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessageMutation = useSendMessage();
  const saveDiagnosticMutation = useSaveDiagnostic();

  useEffect(() => {
    if (!sessionId) setSessionId(crypto.randomUUID());
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

  const sendMessage = async (customContent?: string) => {
    const content = customContent || input.trim();
    if (!content || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageMutation.mutateAsync({
        session_id: sessionId,
        mode,
        message: content,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: res.reply,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setDiagnosticData(null);
    setMode("diagnostic");
  };

  // ➕ TAMBAH: Handler untuk diagnostic complete
  const handleDiagnosticComplete = async (data: DiagnosticData) => {
    setDiagnosticData(data);

    // Jika data lengkap, save ke backend
    if (data.businessStage && data.teamSize && data.position) {
      try {
        await saveDiagnosticMutation.mutateAsync({
          session_id: sessionId,
          business_stage: data.businessStage,
          team_size: data.teamSize,
          position: data.position,
          challenges: data.challenges || [],
          situation: data.situation || '',
          perceived_problem: data.perceivedProblem || '',
          confidence: data.confidence || '',
        });
      } catch (error) {
        console.error('Failed to save diagnostic:', error);
      }
    }

    // Switch ke discuss mode
    setMode("discuss");

    // Auto-send first message
    const firstMessage = "I'll think with you as a decision partner. Bagaimana saya bisa membantu Anda hari ini?";
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: firstMessage,
      },
    ]);
  };

  return {
    messages,
    input,
    setInput,
    mode,
    setMode,
    loading,
    sendMessage,
    newChat,
    messagesEndRef,
    textareaRef,
    diagnosticData,
    handleDiagnosticComplete,
  };
}