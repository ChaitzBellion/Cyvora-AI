import React from 'react';
import { Terminal, ArrowRight, LogOut, User } from 'lucide-react';
import { AppView } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('signin');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0A0B]/80 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs shrink-0 shadow-sm">
            <span>CY</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Cyvora AI
              </span>
              <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-900/50 rounded font-mono">
                Copilot
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:block">Part of Cyvora Studio</span>
          </div>
        </button>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0E0E10] p-1 rounded-lg border border-[#1E293B] text-xs">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              currentView === 'workspace'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Workspace
          </button>
          <button
            onClick={() => onNavigate('workflows')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              currentView === 'workflows'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Workflows
          </button>
          <button
            onClick={() => onNavigate('knowledge')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              currentView === 'knowledge'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Knowledge Base
          </button>
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#161618] border border-[#2D2D33]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] font-bold text-cyan-400 flex items-center justify-center">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-slate-200 font-medium max-w-[120px] truncate hidden sm:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('workspace')}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white hover:bg-slate-200 text-black shadow-sm transition-all cursor-pointer"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate('signin')}
                className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-[#1A1A1D] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('workspace')}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-black shadow-sm transition-all cursor-pointer"
              >
                <span>Launch Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
