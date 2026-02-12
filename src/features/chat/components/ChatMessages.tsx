import { User } from "lucide-react";
import type { ChatMessage } from "@/app/api/chat";
import type { RefObject } from "react";
import logoImage from "@/assets/images/logos/pp.jpeg";
import ChatAttachment from "./ChatAttachment";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  endRef: RefObject<HTMLDivElement>;
};

// ✅ IMPROVED: Better AI response formatter
function formatAIResponse(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let currentListStartNumber = 1; // ✅ Track actual list number

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'number') {
        elements.push(
          <ol 
            key={`list-${elements.length}`} 
            start={currentListStartNumber} // ✅ Use actual start number
            className="list-decimal list-inside space-y-2 my-4 ml-4"
          >
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 my-4 ml-4">
            {listItems}
          </ul>
        );
      }
      listItems = [];
      listType = null;
      currentListStartNumber = 1;
    }
  };

  const processInlineFormatting = (line: string) => {
    // Remove any hashtags (headers)
    line = line.replace(/^#+\s*/g, '');
    
    const segments: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    
    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, tag: 'bold' },
      { regex: /__(.+?)__/g, tag: 'underline' },
      { regex: /_(.+?)_/g, tag: 'italic' },
    ];

    const matches: Array<{ index: number; length: number; text: string; tag: string }> = [];
    
    patterns.forEach(({ regex, tag }) => {
      let match;
      const r = new RegExp(regex);
      while ((match = r.exec(line)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[1],
          tag,
        });
      }
    });

    matches.sort((a, b) => a.index - b.index);

    matches.forEach((match, i) => {
      if (match.index > lastIndex) {
        segments.push(line.substring(lastIndex, match.index));
      }

      const key = `fmt-${i}`;
      if (match.tag === 'bold') {
        segments.push(
          <strong key={key} className="font-bold text-gray-900">
            {match.text}
          </strong>
        );
      } else if (match.tag === 'underline') {
        segments.push(
          <span key={key} className="underline font-semibold text-red-700">
            {match.text}
          </span>
        );
      } else if (match.tag === 'italic') {
        segments.push(
          <em key={key} className="italic text-gray-700">
            {match.text}
          </em>
        );
      }

      lastIndex = match.index + match.length;
    });

    if (lastIndex < line.length) {
      segments.push(line.substring(lastIndex));
    }

    return segments.length > 0 ? segments : line;
  };

  lines.forEach((line, idx) => {
    line = line.trim();
    
    if (!line) {
      flushList();
      return;
    }

    // Remove hashtag headers
    if (line.match(/^#+\s+/)) {
      flushList();
      const cleanLine = line.replace(/^#+\s+/, '');
      elements.push(
        <h3 key={`h-${idx}`} className="font-bold text-lg text-gray-900 mt-6 mb-3">
          {processInlineFormatting(cleanLine)}
        </h3>
      );
      return;
    }

    // ✅ FIXED: Better numbered list detection
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      const lineNumber = parseInt(numberedMatch[1], 10);
      
      // Check if this starts a new list
      if (listType !== 'number' || lineNumber === 1) {
        flushList();
        listType = 'number';
        currentListStartNumber = lineNumber;
      }
      
      listItems.push(
        <li key={`li-${idx}`} className="text-gray-700 leading-relaxed">
          {processInlineFormatting(numberedMatch[2])}
        </li>
      );
      return;
    }

    // Bullet list
    const bulletMatch = line.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'bullet') {
        flushList();
        listType = 'bullet';
      }
      listItems.push(
        <li key={`li-${idx}`} className="text-gray-700 leading-relaxed">
          {processInlineFormatting(bulletMatch[1])}
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-gray-700 leading-relaxed mb-3">
        {processInlineFormatting(line)}
      </p>
    );
  });

  flushList();
  return elements;
}

export default function ChatMessages({ messages, loading, endRef }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-4 items-start">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                m.role === "assistant"
                  ? "shadow-md"
                  : "bg-gray-200"
              }`}
            >
              {m.role === "assistant" ? (
                <img
                  src={logoImage}
                  alt="REDGO AI"
                  className="w-full h-full object-cover"
                />
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
                {m.attachment && (
                  <div className="mb-3">
                    <ChatAttachment attachment={m.attachment} />
                  </div>
                )}

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
            <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-md">
              <img
                src={logoImage}
                alt="REDGO AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
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