import { Plus, Settings, X } from "lucide-react";
import type { Mode } from "@/app/api/chat";

type Props = {
  open: boolean;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onNewChat: () => void;
  onClose: () => void;
};

export default function ChatSidebar({
  open,
  mode,
  onModeChange,
  onNewChat,
  onClose,
}: Props) {
  const modes = [
    { id: "default" as Mode, name: "Default", desc: "Mode standar" },
    { id: "advisor" as Mode, name: "Advisor", desc: "Konsultan bisnis" },
    { id: "explorer" as Mode, name: "Explorer", desc: "Eksplorasi ide" },
  ];

  return (
    <>
      {/* Overlay untuk mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 h-full w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 transition-transform duration-300 flex flex-col shadow-xl md:shadow-none`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              REDGO AI
            </h2>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Chat Baru
          </button>
        </div>

        {/* Mode Selection */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Mode Chat
          </h3>
          <div className="space-y-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onModeChange(m.id);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  mode === m.id
                    ? "bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-300 shadow-sm"
                    : "bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      mode === m.id ? "bg-red-600" : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm ${
                        mode === m.id ? "text-red-900" : "text-gray-700"
                      }`}
                    >
                      {m.name}
                    </div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-white">
          <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Pengaturan</span>
          </button>
        </div>
      </div>
    </>
  );
}