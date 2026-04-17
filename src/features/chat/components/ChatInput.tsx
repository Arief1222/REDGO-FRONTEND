import { Send, Paperclip, X, Mic, Square } from "lucide-react";
import { useRef } from "react";
import type { RefObject } from "react";

type ClarifyOption = { label: string; text: string };

type Props = {
  input: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  loading: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop?: () => void; // ✅ NEW: stop streaming
  onFileAttach?: (file: File) => void;
  attachedFile?: { name: string; url: string; id: number } | null;
  onRemoveFile?: () => void;
  isRecording?: boolean;
  recordingTime?: number;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onCancelRecording?: () => void;
  uploadingFile?: boolean;
  centered?: boolean;
  clarifyQuestion?: string;
  clarifyOptions?: ClarifyOption[];
  onClarifySelect?: (text: string) => void;
  onClarifyDismiss?: () => void;
};

export default function ChatInput({
  input,
  textareaRef,
  loading,
  onChange,
  onSend,
  onStop,
  onFileAttach,
  attachedFile,
  onRemoveFile,
  isRecording,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  uploadingFile,
  centered = false,
  clarifyQuestion,
  clarifyOptions,
  onClarifySelect,
  onClarifyDismiss,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileAttach) onFileAttach(file);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const hasClarify = !!(clarifyQuestion && clarifyOptions && clarifyOptions.length > 0);

  return (
    <div className={centered ? "" : "pb-4 px-4"}>
      <div className="max-w-3xl mx-auto">

        {/* Clarify Panel */}
        {hasClarify && (
          <div className="mb-2 bg-white dark:bg-gray-800 border border-gray-100 rounded-2xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{clarifyQuestion}</p>
              <button onClick={onClarifyDismiss} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              {clarifyOptions!.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => { onClarifySelect?.(opt.text); onClarifyDismiss?.(); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-all text-left group"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 group-hover:bg-red-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-red-600 transition-all">
                    {opt.label}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-red-700 transition-colors">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* File Preview */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl mx-1">
            <Paperclip className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-600 flex-1 truncate">{attachedFile.name}</span>
            <button onClick={onRemoveFile} className="text-gray-400 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-2 flex items-center gap-3 px-4 py-2.5 bg-red-50 rounded-xl border border-red-100">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-600">Merekam... {formatTime(recordingTime || 0)}</span>
            <button onClick={onCancelRecording} className="ml-auto text-red-500 hover:text-red-600 text-xs font-medium">Batal</button>
          </div>
        )}

        {/* Processing Indicator */}
        {uploadingFile && (
          <div className="mb-2 flex items-center gap-3 px-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-600">Memproses pesan suara...</span>
          </div>
        )}

        {/* ✅ Main floating input — no border box, just subtle bg + shadow */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition-shadow duration-200">

          {/* Top row: textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isRecording || uploadingFile}
            rows={1}
            placeholder={
              uploadingFile
                ? "Memproses pesan suara..."
                : isRecording
                  ? "Merekam..."
                  : "Discuss With Ready..."
            }
            className="w-full bg-transparent border-0 rounded-3xl px-5 pt-4 pb-2 pr-5 focus:outline-none resize-none text-gray-800 placeholder-gray-400 disabled:opacity-40 text-sm leading-relaxed"
            style={{ minHeight: "52px", maxHeight: "200px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 200) + "px";
            }}
          />

          {/* Bottom row: actions */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            {/* Left: attach */}
            <div className="flex items-center gap-1">
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx,.xls,.txt" onChange={handleFileSelect} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || isRecording || uploadingFile}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30"
                title="Lampirkan file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Right: voice + send/stop */}
            <div className="flex items-center gap-1.5">
              {/* Voice button */}
              {!isRecording && !uploadingFile && !loading && (
                <button
                  onClick={onStartRecording}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  title="Rekam pesan suara"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Stop recording */}
              {isRecording && (
                <button
                  onClick={onStopRecording}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                  title="Stop recording"
                >
                  <Square className="w-4 h-4" fill="currentColor" />
                </button>
              )}

              {/* ✅ Stop streaming — shown when AI is answering */}
              {loading && !isRecording && onStop && (
                <button
                  onClick={onStop}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                  title="Stop"
                >
                  <Square className="w-4 h-4" fill="currentColor" />
                </button>
              )}

              {/* Send button */}
              {!loading && !isRecording && !uploadingFile && (
                <button
                  onClick={onSend}
                  disabled={!input.trim()}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Kirim"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mt-2 text-center">
          {uploadingFile
            ? "Memproses pesan suara..."
            : isRecording
              ? "Klik stop untuk selesai merekam"
              : "Ready is AI and can make mistakes. Please double-check responses."}
        </p>
      </div>
    </div>
  );
}