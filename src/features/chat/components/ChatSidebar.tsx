// src/app/chat/components/ChatSidebar.tsx
import { Plus, ChevronDown, Trash2, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import type { Mode } from "@/app/api/chat";
import { useState, useEffect } from "react";
import { useChatHistory, useDeleteSession, useUpdateSessionTitle } from "@/app/api/chat";
// import { formatDistanceToNow } from "date-fns";
// import { id as idLocale } from "date-fns/locale";
import { useToast } from "@/shared/hooks/useToast";

type Props = {
  open: boolean;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onNewChat: () => void;
  onClose: () => void;
  onLoadChat: (sessionId: string) => void;
  currentSessionId?: string;
};

export default function ChatSidebar({
  open,
  mode,
  onModeChange,
  onNewChat,
  onClose,
  onLoadChat,
  currentSessionId,
}: Props) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [savingTitle, setSavingTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSessionId, setModalSessionId] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const toast = useToast();
  const updateTitleMutation = useUpdateSessionTitle();
  const { data: historyData, isLoading } = useChatHistory({ limit: 20 });
  const deleteSessionMutation = useDeleteSession();

  const modes = [
    { id: "diagnostic" as Mode, name: "Probe", desc: "Temukan masalah bisnis" },
    { id: "engine" as Mode, name: "Thrive", desc: "Panduan terstruktur" },
  ];

  const currentMode = modes.find((m) => m.id === mode);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const handleLoadChat = (sessionId: string) => {
    onLoadChat(sessionId);
    onClose();
  };

  const handleDeleteChat = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (!confirm("Hapus chat ini?")) return;
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
    } catch {
      toast.error("Gagal menghapus chat");
    }
  };

  const handleStartEdit = (e: React.MouseEvent, session: any) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setModalSessionId(session.session_id);
    setModalTitle(getSessionTitle(session));
    setModalOpen(true);
  };

  const handleSaveTitle = async () => {
    if (!modalTitle.trim()) {
      setModalOpen(false);
      return;
    }
    setSavingTitle(true);
    try {
      await updateTitleMutation.mutateAsync({
        sessionId: modalSessionId,
        title: modalTitle.trim(),
      });
      toast.success("Judul berhasil diubah");
      setModalOpen(false);
    } catch {
      toast.error("Gagal mengubah judul");
    } finally {
      setSavingTitle(false);
    }
  };

  // const formatTimestamp = (timestamp: string) => {
  //   try {
  //     return formatDistanceToNow(new Date(timestamp), {
  //       addSuffix: true,
  //       locale: idLocale,
  //     });
  //   } catch {
  //     return timestamp;
  //   }
  // };

  const getSessionTitle = (session: any) => {
    if (session.title) return session.title;
    if (session.mode === "engine" && session.topic) {
      const topicLabels: Record<string, string> = {
        pricing: "Pricing Strategy",
        branding: "Branding Strategy",
        marketing: "Marketing Strategy",
        positioning: "Market Positioning",
        digital_marketing: "Digital Marketing",
        content_plan: "Content Planning",
        sales_system: "Sales System",
        market_analyst: "Market Analysis",
        product_development: "Product Development",
      };
      return topicLabels[session.topic] || "Engine Session";
    }
    return "New Chat";
  };

  const getModeBadge = (sessionMode: Mode, topic?: string) => {
    if (sessionMode === "engine" && topic) {
      const topicNames: Record<string, string> = {
        pricing: "💰", branding: "⭐", marketing: "📈",
        positioning: "🎯", digital_marketing: "📱", content_plan: "📝",
        sales_system: "🛒", market_analyst: "📊", product_development: "📦",
      };
      return topicNames[topic] || "⚙️";
    }
    const modeIcons: Record<Mode, string> = {
      diagnostic: "🔍", discuss: "💬", engine: "⚙️", explorer: "🚀",
    };
    return modeIcons[sessionMode] || "💬";
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-[280px]
          bg-white
          border-r border-gray-200
          transition-transform duration-300 ease-in-out
          flex flex-col
          shadow-xl md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 pb-3">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            REDGO AI
          </h1>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <Plus className="w-3 h-5" />
            <span>New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          )}

          {!isLoading && (!historyData?.sessions || historyData.sessions.length === 0) && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          )}

          {!isLoading && historyData?.sessions && historyData.sessions.length > 0 && (
            <div className="space-y-1">
              {historyData.sessions.map((session) => (
                <div key={session.session_id} className="relative group">
                  <button
                    onClick={() => handleLoadChat(session.session_id)}
                    className={`
                      w-full text-left px-3 py-3 rounded-xl
                      transition-all relative flex items-start gap-3
                      ${currentSessionId === session.session_id
                        ? "bg-red-50 border border-red-200"
                        : "hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex-shrink-0 text-lg mt-0.5">
                      {getModeBadge(session.mode as Mode, session.topic)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className={`text-sm font-medium truncate ${
                        currentSessionId === session.session_id ? "text-red-700" : "text-gray-900"
                      }`}>
                        {getSessionTitle(session)}
                      </div>
                      {session.mode === "engine" && session.topic && (
                        <div className="text-xs text-gray-500 mt-0.5 capitalize">
                          {session.topic.replace("_", " ")} • {session.sub_mode}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Three dots button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === session.session_id ? null : session.session_id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 rounded-lg transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {activeMenuId === session.session_id && (
                    <div
                      className="absolute right-2 top-10 z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-1 w-36 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleStartEdit(e, session)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        Edit judul
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(e, session.session_id)}
                        disabled={deleteSessionMutation.isPending}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {deleteSessionMutation.isPending
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-3">
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                M
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">Miftahul</div>
                <div className="text-xs text-gray-500">{currentMode?.name}</div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden">
                  <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mode</div>
                    <div className="space-y-1">
                      {modes.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { onModeChange(m.id); setProfileDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            mode === m.id ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ✅ Modal Edit Judul - di luar <aside>, sejajar top level */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Judul Chat</h3>
              <input
                autoFocus
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setModalOpen(false);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="Masukkan judul..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTitle}
                  disabled={savingTitle}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingTitle && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}