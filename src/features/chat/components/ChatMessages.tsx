import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/app/api/chat";
import type { RefObject } from "react";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  endRef: RefObject<HTMLDivElement>;
};

// Utility function untuk format response AI
function formatAIResponse(text: string) {
  const parts = text.split(/(\d+\.\s\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    // Check if it's a numbered heading
    if (/^\d+\.\s\*\*/.test(part)) {
      const match = part.match(/^(\d+)\.\s\*\*([^*]+)\*\*/);
      if (match) {
        return (
          <div key={index} className="mt-4 mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {match[1]}. {match[2]}
            </h3>
          </div>
        );
      }
    }
    
    // Process regular text with bold and bullets
    const processedText = part
      .split('\n')
      .map((line, lineIndex) => {
        line = line.trim();
        if (!line) return null;
        
        // Handle bullet points
        if (line.startsWith('- ')) {
          const content = line.substring(2);
          const cleanContent = content.replace(/\*\*/g, '');
          return (
            <li key={lineIndex} className="ml-4 mb-1.5 text-gray-700 leading-relaxed">
              {cleanContent}
            </li>
          );
        }
        
        // Handle bold text in regular paragraphs
        const boldRegex = /\*\*([^*]+)\*\*/g;
        if (boldRegex.test(line)) {
          const segments = [];
          let lastIndex = 0;
          let match;
          const regex = /\*\*([^*]+)\*\*/g;
          
          while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              segments.push(line.substring(lastIndex, match.index));
            }
            segments.push(
              <strong key={match.index} className="font-semibold text-gray-900">
                {match[1]}
              </strong>
            );
            lastIndex = regex.lastIndex;
          }
          
          if (lastIndex < line.length) {
            segments.push(line.substring(lastIndex));
          }
          
          return (
            <p key={lineIndex} className="mb-2 text-gray-700 leading-relaxed">
              {segments}
            </p>
          );
        }
        
        // Regular paragraph
        return (
          <p key={lineIndex} className="mb-2 text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      })
      .filter(Boolean);
    
    return <div key={index}>{processedText}</div>;
  });
}

export default function ChatMessages({ messages, loading, endRef }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-4 items-start">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                m.role === "assistant"
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-md"
                  : "bg-gray-200"
              }`}
            >
              {m.role === "assistant" ? (
                <Sparkles className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`rounded-2xl px-5 py-4 ${
                  m.role === "assistant"
                    ? "bg-white shadow-sm border border-gray-100"
                    : "bg-gradient-to-br from-gray-100 to-gray-50"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    {formatAIResponse(m.content)}
                  </div>
                ) : (
                  <p className="text-gray-800 leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endRef} />
      </div>
    </div>
  );
}
