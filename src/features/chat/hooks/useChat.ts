import { useEffect, useRef, useState } from "react";
import { useSendMessage } from "@/app/api/chat";
import type { Mode, ChatMessage } from "@/app/api/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessageMutation = useSendMessage();

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
  };
}