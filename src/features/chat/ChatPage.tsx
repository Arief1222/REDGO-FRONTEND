// src/app/chat/ChatPage.tsx - UPDATED WITH ENGINE MODE

import { useState } from "react";
import { useChat } from "./hooks/useChat";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { ChatWelcome } from "./components/ChatWelcome";
import DiagnosticFlow from "./components/DiagnosticFlow";
import EngineFlow from "./components/EngineFlow"; // ✅ NEW

export default function ChatPage() {
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePromptClick = (prompt: string) => {
    chat.sendMessage(prompt);
  };

  const isWelcomeScreen = chat.messages.length === 0;

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
        {/* ✅ NEW: Show Engine flow when in engine mode */}
        {chat.mode === "engine" ? (
          chat.messages.length === 0 ? (
            <EngineFlow
              sessionId={chat.sessionId}
              onComplete={chat.handleEngineComplete}
            />
          ) : (
            /* Engine mode with messages - show chat interface */
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
                onSend={() => chat.sendMessage()}
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
              />
            </>
          )
        ) : chat.mode === "diagnostic" ? (
          /* Show diagnostic flow when in diagnostic mode */
          <DiagnosticFlow onComplete={chat.handleDiagnosticComplete} />
        ) : (
          /* Default discuss/explorer mode */
          <>
            {isWelcomeScreen ? (
              /* Welcome Screen with Centered Input */
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-5xl px-8 -mt-20">
                  {/* Welcome Content */}
                  <div className="mb-12">
                    <ChatWelcome onPromptClick={handlePromptClick} />
                  </div>
                  
                  {/* Centered Input Box */}
                  <ChatInput
                    input={chat.input}
                    textareaRef={chat.textareaRef}
                    loading={chat.loading}
                    onChange={chat.setInput}
                    onSend={() => chat.sendMessage()}
                    onFileAttach={chat.handleFileAttach}
                    attachedFile={chat.attachedFile}
                    onRemoveFile={chat.handleRemoveFile}
                    isRecording={chat.isRecording}
                    recordingTime={chat.recordingTime}
                    onStartRecording={chat.onStartRecording}
                    onStopRecording={chat.onStopRecording}
                    onCancelRecording={chat.onCancelRecording}
                    uploadingFile={chat.uploadingFile}
                    centered={true}
                  />
                </div>
              </div>
            ) : (
              /* Chat Messages with Bottom Input */
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
                  onSend={() => chat.sendMessage()}
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
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}