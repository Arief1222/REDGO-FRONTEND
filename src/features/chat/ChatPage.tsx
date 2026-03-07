// src/app/chat/ChatPage.tsx - UPDATED WITH ENGINE MODE

import { useState } from "react";
import { useChat } from "./hooks/useChat";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import { parseClarifyBlock } from "../../app/api/chat/utils/clarify";
import ChatInput from "./components/ChatInput";
import DiagnosticFlow from "./components/DiagnosticFlow";
import EngineFlow from "./components/EngineFlow";

export default function ChatPage() {
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clarifyDismissed, setClarifyDismissed] = useState(false);

  // ✅ Detect clarify dari pesan terakhir AI
  const lastMsg = chat.messages[chat.messages.length - 1];
  const clarifyData = lastMsg?.role === 'assistant' && !clarifyDismissed
    ? parseClarifyBlock(lastMsg.content)
    : { isClarify: false, question: '', options: [] };

  // Reset dismissed state ketika ada pesan baru
  const handleSend = () => {
    setClarifyDismissed(false);
    chat.sendMessage();
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <ChatSidebar
        open={sidebarOpen}
        mode={chat.mode}
        onModeChange={chat.setMode}
        onNewChat={chat.newChat}
        onClose={() => setSidebarOpen(false)}
        onLoadChat={chat.loadChatSession}
        currentSessionId={chat.sessionId}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {chat.mode === "engine" ? (
          chat.messages.length === 0 ? (
            <EngineFlow
              sessionId={chat.sessionId}
              onComplete={chat.handleEngineComplete}
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
                onSend={handleSend}
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
                onClarifySelect={(text) => { setClarifyDismissed(true); chat.sendMessage(text); }}
                onClarifyDismiss={() => setClarifyDismissed(true)}
              />
            </>
          )
        ) : chat.messages.length === 0 ? (
          // ✅ Semua mode dengan 0 messages → tampilkan DiagnosticFlow langsung
          // Tidak ada wrapper yang menghalangi klik
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
              onSend={handleSend}
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
              onClarifySelect={(text) => { setClarifyDismissed(true); chat.sendMessage(text); }}
              onClarifyDismiss={() => setClarifyDismissed(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}