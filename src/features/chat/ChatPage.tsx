// src/features/chat/ChatPage.tsx — real Midtrans premium
import { useState, useCallback } from "react";
import { useChat } from "./hooks/useChat";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import { parseClarifyBlock } from "@/app/api/chat/utils/clarify";
import ChatInput from "./components/ChatInput";
import DiagnosticFlow from "./components/DiagnosticFlow";
import EngineFlow from "./components/EngineFlow";
import PremiumModal, { type PremiumModalReason } from "./components/PremiumModal";
import { useQueryClient } from "@tanstack/react-query";
import { consumeQuota, getRemainingQuota, isAdminRole } from "./hooks/usePremium";
import { usePaymentStatus, paymentKeys } from "@/app/api/payment/usePaymentApi";
import { useAuth } from '@/app/auth';
import type { EngineTopic, EngineSubMode, EngineAnswers } from "@/app/api/chat";

const TOPIC_LABELS: Record<string, string> = {
  marketing: "Marketing Strategy",
  product_development: "Product Development",
  market_analyst: "Market Analysis",
  content_plan: "Content Planning",
};

export default function ChatPage() {
  const chat = useChat();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clarifyDismissed, setClarifyDismissed] = useState(false);

  // ── Premium status dari backend ─────────────────────────────────────────────
  const { data: paymentStatus } = usePaymentStatus();
  const isPremium = paymentStatus?.is_premium ?? false;

  // ── Premium modal state ──────────────────────────────────────────────────────
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumReason, setPremiumReason] = useState<PremiumModalReason>("quota_limit");
  const [premiumTopicName, setPremiumTopicName] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role?.name);
  const bypassLock = isAdmin || isPremium;

  // ── Clarify detection ───────────────────────────────────────────────────────
  const lastMsg = chat.messages[chat.messages.length - 1];
  const clarifyData =
    lastMsg?.role === "assistant" && !clarifyDismissed
      ? parseClarifyBlock(lastMsg.content)
      : { isClarify: false, question: "", options: [] };

  // ── Gated send ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(
    (overrideText?: string) => {
      if (!bypassLock && !consumeQuota(
        isPremium,
        chat.mode,
        chat.engineTopic ?? undefined,
        chat.engineSubMode ?? undefined
      )) {
        setPremiumReason("quota_limit");
        setPremiumOpen(true);
        return;
      }
      setClarifyDismissed(false);
      chat.sendMessage(overrideText);
    },
    [chat, isPremium, bypassLock]
  );

  // ── Gated Engine flow complete ──────────────────────────────────────────────
const handleEngineFlowComplete = useCallback(
  async (
    _analysis: string,
    topic: EngineTopic,
    subMode: EngineSubMode,
    _answers: EngineAnswers
  ) => {
    if (!bypassLock && !consumeQuota(isPremium, 'engine', topic, subMode)) {
      setPremiumReason("quota_limit");
      setPremiumOpen(true);
      return;
    }
    await chat.handleEngineComplete(_analysis, topic, subMode, _answers);
  },
  [chat, isPremium, bypassLock]
);
  // ── Setelah payment success, refresh status premium ─────────────────────────
  const handlePaymentSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: paymentKeys.status() });
  }, [queryClient]);

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <ChatSidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        mode={chat.mode}
        onModeChange={chat.setMode}
        onNewChat={chat.newChat}
        onClose={() => setSidebarOpen(false)}
        onLoadChat={chat.loadChatSession}
        currentSessionId={chat.sessionId}
        onDeleteSession={(sessionId) => {
          if (chat.sessionId === sessionId) chat.newChat();
        }}
        isPremium={isPremium}
        // di ChatPage.tsx, pass quota sesuai mode aktif
        remainingQuota={getRemainingQuota(isPremium, chat.mode, chat.engineTopic ?? undefined, chat.engineSubMode ?? undefined)}
        onUpgrade={() => {
          setPremiumReason("quota_limit");
          setPremiumTopicName(undefined);
          setPremiumOpen(true);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {chat.mode === "engine" ? (
          chat.messages.length === 0 ? (
            <EngineFlow
              sessionId={chat.sessionId}
              onComplete={handleEngineFlowComplete}
              onLockedTopic={(topic) => {
                setPremiumReason("locked_topic");
                setPremiumTopicName(TOPIC_LABELS[topic as string] ?? String(topic));
                setPremiumOpen(true);
              }}
            />
          ) : (
            <>
              <ChatMessages
                messages={chat.messages}
                loading={chat.loading}
                endRef={chat.messagesEndRef}
              />
              <ChatInput
                input={chat.input}
                textareaRef={chat.textareaRef}
                loading={chat.loading}
                onChange={chat.setInput}
                onSend={() => handleSend()}
                onFileAttach={chat.handleFileAttach}
                attachedFile={chat.attachedFile}
                onRemoveFile={chat.handleRemoveFile}
                isRecording={chat.isRecording}
                recordingTime={chat.recordingTime}
                onStartRecording={chat.onStartRecording}
                onStopRecording={chat.onStopRecording}
                onCancelRecording={chat.onCancelRecording}
                uploadingFile={chat.uploadingFile}
                centered={false}
                clarifyQuestion={clarifyData.isClarify ? clarifyData.question : undefined}
                clarifyOptions={clarifyData.isClarify ? clarifyData.options : undefined}
                onClarifySelect={(text) => { setClarifyDismissed(true); handleSend(text); }}
                onClarifyDismiss={() => setClarifyDismissed(true)}
                onStop={chat.stopGeneration}
              />
            </>
          )
        ) : chat.messages.length === 0 ? (
          <DiagnosticFlow onComplete={chat.handleDiagnosticComplete} />
        ) : (
          <>
            <ChatMessages
              messages={chat.messages}
              loading={chat.loading}
              endRef={chat.messagesEndRef}
              showTopicButtons={chat.showTopicButtons}
              onQuickReply={chat.handleTopicSelect}
            />
            <ChatInput
              input={chat.input}
              textareaRef={chat.textareaRef}
              loading={chat.loading}
              onChange={chat.setInput}
              onSend={() => handleSend()}
              onFileAttach={chat.handleFileAttach}
              attachedFile={chat.attachedFile}
              onRemoveFile={chat.handleRemoveFile}
              isRecording={chat.isRecording}
              recordingTime={chat.recordingTime}
              onStartRecording={chat.onStartRecording}
              onStopRecording={chat.onStopRecording}
              onCancelRecording={chat.onCancelRecording}
              uploadingFile={chat.uploadingFile}
              centered={false}
              clarifyQuestion={clarifyData.isClarify ? clarifyData.question : undefined}
              clarifyOptions={clarifyData.isClarify ? clarifyData.options : undefined}
              onClarifySelect={(text) => { setClarifyDismissed(true); handleSend(text); }}
              onClarifyDismiss={() => setClarifyDismissed(true)}
              onStop={chat.stopGeneration}
            />
          </>
        )}
      </div>

      {/* ── Premium Modal ── */}
      <PremiumModal
        open={premiumOpen}
        reason={premiumReason}
        topicName={premiumTopicName}
        mode={chat.mode}   
        onClose={() => setPremiumOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}