import { Menu } from "lucide-react";
import type { Mode } from "@/app/api/chat";
import logoImage from "@/assets/images/logos/pp.jpeg";

type Props = {
  mode: Mode;
  onToggleSidebar: () => void;
};

export default function ChatHeader({ mode, onToggleSidebar }: Props) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="REDGO AI Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="font-bold text-lg text-gray-900 hidden sm:block">
            REDGO AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-4 py-2 rounded-full border border-red-200">
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </span>
      </div>
    </header>
  );
}