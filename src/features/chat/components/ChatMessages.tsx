import { User, Download } from "lucide-react";
import type { ChatMessage } from "@/app/api/chat";
import type { RefObject } from "react";
import logoImage from "@/assets/images/logos/pp.jpeg";
import ChatAttachment from "./ChatAttachment";
import { exportToExcel, exportToCSV } from '../hooks/exportTable'; // ✅ IMPORT EXPORT FUNCTIONS

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
  let currentListStartNumber = 1;

  // ✅ Table state
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
            {/* <button
              onClick={() => exportToCSV(headers, bodyData)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download size={12} />
              Download CSV
            </button> */}
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

    if (!line) {
      flushList();
      flushTable();
      return;
    }

    // Header
    if (line.match(/^#+\s+/)) {
      flushList();
      flushTable();
      const cleanLine = line.replace(/^#+\s+/, '');
      elements.push(
        <h3 key={`h-${idx}`} className="font-bold text-lg text-gray-900 mt-6 mb-3">
          {processInlineFormatting(cleanLine)}
        </h3>
      );
      return;
    }

    // ✅ Table
    if (line.startsWith('|') && line.endsWith('|')) {
      // Skip separator |---|---|
      if (line.match(/^\|[\s\-:]+\|/)) return;

      flushList();

      const cells = line
        .split('|')
        .filter((_, i, arr) => i > 0 && i < arr.length - 1)
        .map(cell => cell.trim());

      const nextLine = lines[idx + 1]?.trim() || '';
      const isHeader = nextLine.match(/^\|[\s\-:]+\|/);

      if (isHeader) {
        flushTable(); // flush previous table if any
        tableHeaders = cells;
      } else {
        tableBodyData.push(cells);
      }
      return;
    }

    // Numbered list
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      flushTable();
      const lineNumber = parseInt(numberedMatch[1], 10);
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
      flushTable();
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

    // Paragraph
    flushList();
    flushTable();
    elements.push(
      <p key={`p-${idx}`} className="text-gray-700 leading-relaxed mb-3">
        {processInlineFormatting(line)}
      </p>
    );
  });

  flushList();
  flushTable();

  return elements;
}

export default function ChatMessages({ messages, loading, endRef }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-4 items-start">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${m.role === "assistant"
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
                className={`rounded-2xl px-5 py-4 ${m.role === "assistant"
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