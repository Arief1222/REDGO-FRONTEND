// src/app/chat/components/ChatSidebar.tsx - UPDATED WITH MODE PERSISTENCE

import { Plus, ChevronDown, Trash2, Loader2, Settings, LogOut } from "lucide-react";
import type { Mode } from "@/app/api/chat";
import { useState } from "react";
import { useChatHistory, useDeleteSession } from "@/app/api/chat";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
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
  const toast = useToast();

  const { data: historyData, isLoading } = useChatHistory({ limit: 20 });
  const deleteSessionMutation = useDeleteSession();

  const modes = [
    { id: "diagnostic" as Mode, name: "🔍 Find Problem", desc: "Temukan masalah bisnis" },
    // { id: "discuss" as Mode, name: "💬 Discuss", desc: "Diskusi masalah langsung" },
    { id: "engine" as Mode, name: "⚙️ Engine", desc: "Panduan terstruktur" },
    // { id: "explorer" as Mode, name: "🚀 Explorer", desc: "Eksplorasi ide" },
  ];

  const currentMode = modes.find((m) => m.id === mode);

  const handleLoadChat = (sessionId: string) => {
    onLoadChat(sessionId);
    onClose();
  };

  const handleDeleteChat = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    if (!confirm("Hapus chat ini?")) return;

    try {
      await deleteSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Gagal menghapus chat");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: idLocale,
      });
    } catch {
      return timestamp;
    }
  };

  const getSessionTitle = (session: any) => {
    // If has custom title, use it
    if (session.title) return session.title;
    
    // ✅ For engine mode without title, show topic-based default
    // The actual content preview will be handled by backend later
    if (session.mode === 'engine' && session.topic) {
      const topicLabels: Record<string, string> = {
        pricing: 'Pricing Strategy',
        branding: 'Branding Strategy', 
        marketing: 'Marketing Strategy',
        positioning: 'Market Positioning',
        digital_marketing: 'Digital Marketing',
        content_plan: 'Content Planning',
        sales_system: 'Sales System',
        market_analyst: 'Market Analysis',
        product_development: 'Product Development',
      };
      
      return topicLabels[session.topic] || 'Engine Session';
    }
    
    // Default fallback
    return `New Chat`;
  };

  // Get mode badge
  const getModeBadge = (sessionMode: Mode, topic?: string) => {
    if (sessionMode === 'engine' && topic) {
      const topicNames: Record<string, string> = {
        pricing: '💰',
        branding: '⭐',
        marketing: '📈',
        positioning: '🎯',
        digital_marketing: '📱',
        content_plan: '📝',
        sales_system: '🛒',
        market_analyst: '📊',
        product_development: '📦',
      };
      return topicNames[topic] || '⚙️';
    }
    const modeIcons: Record<Mode, string> = {
      diagnostic: '🔍',
      discuss: '💬',
      engine: '⚙️',
      explorer: '🚀',
    };
    return modeIcons[sessionMode] || '💬';
  };

  return (
    <>
      {/* Overlay untuk mobile */}
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
        {/* Header dengan Logo */}
        <div className="p-4 pb-3">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            REDGO AI
          </h1>
        </div>

        {/* New Chat Button - ✅ NOW SHOWS CURRENT MODE */}
        <div className="px-4 pb-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <Plus className="w-3 h-5" />
            <div className="flex flex-col items-start">
              <span>New chat</span>
            </div>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!historyData?.sessions || historyData.sessions.length === 0) && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          )}

          {/* Chat List */}
          {!isLoading && historyData?.sessions && historyData.sessions.length > 0 && (
            <div className="space-y-1">
              {historyData.sessions.map((session) => (
                <div key={session.session_id} className="relative group">
                  <button
                    onClick={() => handleLoadChat(session.session_id)}
                    className={`
                      w-full text-left px-3 py-3 rounded-xl
                      transition-all relative flex items-start gap-3
                      ${
                        currentSessionId === session.session_id
                          ? "bg-red-50 border border-red-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    {/* Mode Badge */}
                    <div className="flex-shrink-0 text-lg mt-0.5">
                      {getModeBadge(session.mode as Mode, session.topic)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className={`
                        text-sm font-medium truncate
                        ${currentSessionId === session.session_id ? "text-red-700" : "text-gray-900"}
                      `}>
                        {getSessionTitle(session)}
                      </div>
                      {/* Show topic for engine mode */}
                      {session.mode === 'engine' && session.topic && (
                        <div className="text-xs text-gray-500 mt-0.5 capitalize">
                          {session.topic.replace('_', ' ')} • {session.sub_mode}
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={(e) => handleDeleteChat(e, session.session_id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition-all"
                    disabled={deleteSessionMutation.isPending}
                  >
                    {deleteSessionMutation.isPending ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section - Profile with Mode Dropdown */}
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
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden">
                  {/* Mode Section */}
                  <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Mode
                    </div>
                    <div className="space-y-1">
                      {modes.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onModeChange(m.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                            ${
                              mode === m.id
                                ? "bg-red-50 text-red-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Settings & Logout */}
                  <div className="px-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}