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
  // ✅ Clarify props
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

  const wrapperClass = centered ? "" : "border-t border-gray-200 bg-white p-4 shadow-lg";
  const containerClass = centered ? "w-full" : "max-w-4xl mx-auto";
  const hasClarify = !!(clarifyQuestion && clarifyOptions && clarifyOptions.length > 0);

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>

        {/* ✅ Floating Clarify Panel — muncul di atas input, hilang setelah diklik */}
        {hasClarify && (
          <div className="mb-3 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">{clarifyQuestion}</p>
              <button
                onClick={onClarifyDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-3 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Options */}
            <div className="p-2 flex flex-col gap-1">
              {clarifyOptions!.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    onClarifySelect?.(opt.text);
                    onClarifyDismiss?.();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all text-left group"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 group-hover:bg-red-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-red-600 transition-all">
                    {opt.label}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-red-700 transition-colors">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* File Preview */}
        {attachedFile && (
          <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <Paperclip className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 flex-1">{attachedFile.name}</span>
            <button onClick={onRemoveFile} className="text-gray-500 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-3 flex items-center gap-3 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">Recording... {formatTime(recordingTime || 0)}</span>
            <button onClick={onCancelRecording} className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium">Cancel</button>
          </div>
        )}

        {/* Processing Indicator */}
        {uploadingFile && (
          <div className="mb-3 flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Transcribing voice message...</span>
          </div>
        )}

        <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-red-400 transition-all shadow-sm">
          {/* Attach Button */}
          <div className="absolute left-2 bottom-2">
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx,.xls,.txt" onChange={handleFileSelect} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-all"
              disabled={loading || isRecording || uploadingFile}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRecording || uploadingFile}
            rows={1}
            placeholder={uploadingFile ? "Processing voice message..." : "Ketik pesan Anda di sini..."}
            className="w-full bg-transparent border-0 rounded-2xl p-4 pl-14 pr-28 focus:outline-none resize-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
          />

          {/* Voice & Send Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            {!isRecording && !uploadingFile && (
              <button onClick={onStartRecording} className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-all" disabled={loading} title="Record voice message">
                <Mic className="w-5 h-5" />
              </button>
            )}
            {isRecording && (
              <button onClick={onStopRecording} className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all" title="Stop recording">
                <Square className="w-5 h-5" fill="currentColor" />
              </button>
            )}
            {!isRecording && !uploadingFile && (
              <button
                onClick={onSend}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          {uploadingFile ? "Processing your voice message..." : isRecording ? "Klik tombol stop untuk selesai rekam" : "Tekan Enter untuk kirim, Shift + Enter untuk baris baru"}
        </p>
      </div>
    </div>
  );
}