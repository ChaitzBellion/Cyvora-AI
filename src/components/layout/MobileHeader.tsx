import React from 'react';
import { Menu, Terminal, Plus, Sparkles } from 'lucide-react';

interface MobileHeaderProps {
  title?: string;
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Cyvora AI',
  onOpenSidebar,
  onNewChat
}) => {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0E0E10] border-b border-[#1E293B] sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1D] transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            <span>CY</span>
          </div>
          <span className="font-semibold text-sm text-white">{title}</span>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-slate-200 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New</span>
      </button>
    </header>
  );
};
