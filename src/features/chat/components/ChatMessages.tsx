import { User, Download } from "lucide-react";
import type { ChatMessage } from "@/app/api/chat";
import type { RefObject } from "react";
import logoImage from "/maskot.png";
import ChatAttachment from "./ChatAttachment";
import { exportToExcel, exportToCSV } from '../hooks/exportTable';

const TOPICS = [
  { id: 'branding', label: 'Branding', emoji: '🎨' },
  { id: 'marketing', label: 'Marketing', emoji: '📣' },
];

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  endRef: RefObject<HTMLDivElement>;
  onQuickReply?: (prompt: string) => void;
  showTopicButtons?: boolean;
};

// ✅ Parse [CLARIFY] block dari AI response
function parseClarifyBlock(text: string): { isClarify: boolean; question: string; options: { label: string; text: string }[] } {
  const match = text.match(/\[CLARIFY\]([\s\S]*?)\[\/CLARIFY\]/);
  if (!match) return { isClarify: false, question: '', options: [] };

  const inner = match[1].trim();
  const lines = inner.split('\n').map(l => l.trim()).filter(Boolean);

  const question = lines[0] || '';
  const options: { label: string; text: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const optMatch = lines[i].match(/^([A-D])\.\s+(.+)/);
    if (optMatch) {
      options.push({ label: optMatch[1], text: optMatch[2] });
    }
  }

  return { isClarify: true, question, options };
}

// ✅ Clarify Card component
function ClarifyCard({ question, options, onSelect }: {
  question: string;
  options: { label: string; text: string }[];
  onSelect?: (text: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-gray-700 leading-relaxed">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect?.(opt.text)}
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-xl transition-all text-left group"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white border-2 border-gray-200 group-hover:border-red-300 group-hover:bg-red-50 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-red-600 transition-all">
              {opt.label}
            </span>
            <span className="text-sm text-gray-700 group-hover:text-red-700 font-medium transition-colors">
              {opt.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatAIResponse(text: string) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let currentListStartNumber = 1;

  let tableHeaders: string[] = [];
  let tableBodyData: string[][] = [];

  const processInlineFormatting = (line: string) => {
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
        matches.push({ index: match.index, length: match[0].length, text: match[1], tag });
      }
    });

    matches.sort((a, b) => a.index - b.index);
    matches.forEach((match, i) => {
      if (match.index > lastIndex) segments.push(line.substring(lastIndex, match.index));
      const key = `fmt-${i}`;
      if (match.tag === 'bold') {
        segments.push(<strong key={key} className="font-bold text-gray-900">{match.text}</strong>);
      } else if (match.tag === 'underline') {
        segments.push(<span key={key} className="underline font-semibold text-red-700">{match.text}</span>);
      } else if (match.tag === 'italic') {
        segments.push(<em key={key} className="italic text-gray-700">{match.text}</em>);
      }
      lastIndex = match.index + match.length;
    });

    if (lastIndex < line.length) segments.push(line.substring(lastIndex));
    const result = segments.length > 0 ? segments : line;
    if (typeof result === 'string') {
      return result.replace(/\*\*/g, '').replace(/\*/g, '');
    }
    return result;
  };

  const flushTable = () => {
    if (tableHeaders.length > 0) {
      const headers = tableHeaders;
      const bodyData = tableBodyData;
      elements.push(
        <div key={`table-wrap-${elements.length}`}>
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((h, i) => (
                    <th key={i} className="border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-800">
                      {processInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyData.map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 px-3 py-2 text-sm text-gray-700">
                        {processInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-1 mb-3">
            <button
              onClick={() => exportToExcel(headers, bodyData)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Download size={12} />
              Download Excel
            </button>
          </div>
        </div>
      );
      tableHeaders = [];
      tableBodyData = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'number') {
        elements.push(
          <ol key={`list-${elements.length}`} start={currentListStartNumber} className="list-decimal list-inside space-y-2 my-4 ml-4">
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

  lines.forEach((line, idx) => {
    line = line.trim();
    if (line === '---' || line === '***' || line === '___') return;
    if (!line) { flushList(); flushTable(); return; }

    if (line.match(/^#+\s+/)) {
      flushList(); flushTable();
      const cleanLine = line.replace(/^#+\s+/, '');
      elements.push(<h3 key={`h-${idx}`} className="font-bold text-lg text-gray-900 mt-6 mb-3">{processInlineFormatting(cleanLine)}</h3>);
      return;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.match(/^\|[\s\-:]+\|/)) return;
      flushList();
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(cell => cell.trim());
      const nextLine = lines[idx + 1]?.trim() || '';
      const isHeader = nextLine.match(/^\|[\s\-:]+\|/);
      if (isHeader) { flushTable(); tableHeaders = cells; }
      else { tableBodyData.push(cells); }
      return;
    }

    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      flushTable();
      const lineNumber = parseInt(numberedMatch[1], 10);
      if (listType !== 'number' || lineNumber === 1) { flushList(); listType = 'number'; currentListStartNumber = lineNumber; }
      listItems.push(<li key={`li-${idx}`} className="text-gray-700 leading-relaxed">{processInlineFormatting(numberedMatch[2])}</li>);
      return;
    }

    const bulletMatch = line.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      flushTable();
      if (listType !== 'bullet') { flushList(); listType = 'bullet'; }
      listItems.push(<li key={`li-${idx}`} className="text-gray-700 leading-relaxed">{processInlineFormatting(bulletMatch[1])}</li>);
      return;
    }

    flushList(); flushTable();
    elements.push(<p key={`p-${idx}`} className="text-gray-700 leading-relaxed mb-3">{processInlineFormatting(line)}</p>);
  });

  flushList();
  flushTable();
  return elements;
}

export default function ChatMessages({ messages, loading, endRef, showTopicButtons, onQuickReply }: Props) {
  const userInitial = (() => {
    try {
      const name = localStorage.getItem('userName') || localStorage.getItem('name') || 'U';
      return name.charAt(0).toUpperCase();
    } catch { return 'U'; }
  })();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 bg-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((m, index) => (
          <div key={m.id}>
            {m.role === 'user' ? (
              <div className="flex gap-3 items-start justify-end">
                <div className="flex-1 min-w-0 flex justify-end">
                  <div className="rounded-2xl px-5 py-4 max-w-[75%]" style={{ backgroundColor: '#D93B2B' }}>
                    {m.attachment && <div className="mb-3"><ChatAttachment attachment={m.attachment} /></div>}
                    <p className="text-white leading-relaxed">{m.content}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
                  {userInitial}
                </div>
              </div>
            ) : m.content.includes('[CLARIFY]') ? null : (
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                  <img src={logoImage} alt="Ready" className="w-full h-full object-cover" style={{ imageRendering: 'crisp-edges' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl px-5 py-4 bg-white shadow-sm border border-gray-100">
                    {m.attachment && <div className="mb-3"><ChatAttachment attachment={m.attachment} /></div>}
                    <div className="prose prose-sm max-w-none">
                      {formatAIResponse(m.content)}
                    </div>
                  </div>

                  {/* Topic buttons */}
                  {showTopicButtons && index === 0 && onQuickReply && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => onQuickReply(topic.label)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all text-sm font-medium text-gray-700 shadow-sm"
                        >
                          <span>{topic.emoji}</span>
                          {topic.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-start">
          
            <div className="flex-1">
              
                <div className="flex gap-1.5" style={{ paddingLeft: "52px" }}>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
     
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}