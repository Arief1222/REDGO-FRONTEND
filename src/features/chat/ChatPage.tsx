import { useState } from "react";
import { useChat } from "./hooks/useChat";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { ChatWelcome } from "./components/ChatWelcome";
import DiagnosticFlow from "./components/DiagnosticFlow";

export default function ChatPage() {
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePromptClick = (prompt: string) => {
    chat.sendMessage(prompt);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <ChatSidebar
        open={sidebarOpen}
        mode={chat.mode}
        onModeChange={chat.setMode}
        onNewChat={chat.newChat}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Show diagnostic flow when in diagnostic mode */}
        {chat.mode === "diagnostic" ? (
          <DiagnosticFlow onComplete={chat.handleDiagnosticComplete} />
        ) : (
          <>
            <ChatHeader
              mode={chat.mode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {chat.messages.length === 0 ? (
              <ChatWelcome onPromptClick={handlePromptClick} />
            ) : (
              <ChatMessages
                messages={chat.messages}
                loading={chat.loading}
                endRef={chat.messagesEndRef}
              />
            )}

            <ChatInput
              input={chat.input}
              textareaRef={chat.textareaRef}
              loading={chat.loading}
              onChange={chat.setInput}
              onSend={() => chat.sendMessage()}
            />
          </>
        )}
      </div>
    </div>
  );
}