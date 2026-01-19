import { Send } from "lucide-react";
import type { RefObject } from "react";

type Props = {
  input: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  loading: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
};

export default function ChatInput({
  input,
  textareaRef,
  loading,
  onChange,
  onSend,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-red-400 focus-within:bg-white transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full bg-transparent border-0 rounded-2xl p-4 pr-14 focus:outline-none resize-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 bottom-2 p-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Tekan Enter untuk kirim, Shift + Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}