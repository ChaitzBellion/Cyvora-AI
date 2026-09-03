import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Cpu, 
  BookmarkCheck, 
  Settings, 
  History, 
  Terminal, 
  Sparkles, 
  LogOut, 
  X,
  MessageSquare,
  Pin,
  Trash2,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { AppView, Conversation, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  userProfile: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  userProfile,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = user?.displayName || userProfile.name;
  const displayEmail = user?.email || userProfile.email;
  const photoURL = user?.photoURL || userProfile.avatarUrl;

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    handleNavClick('signin');
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const recentConversations = filteredConversations.filter(c => !c.isPinned);

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const handleConvClick = (id: string) => {
    onSelectConversation(id);
    onNavigate('workspace');
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="cyvora-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-[#0E0E10] border-r border-[#1E293B] transition-all duration-200 ease-in-out select-none
          ${isOpenMobile ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-18' : 'md:w-64 lg:w-68'}
        `}
      >
        {/* Top brand header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B] bg-[#0E0E10]">
          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-3 text-left group overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="Cyvora AI Home"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs shrink-0 shadow-sm">
              <span>CY</span>
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-base text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                    Cyvora AI
                  </span>
                  <span className="text-[9px] px-1 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-900/50 rounded font-mono">
                    v1.0
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate">Technology Copilot</span>
              </div>
            )}
          </button>

          {/* Desktop collapse toggle */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-[#1A1A1D] transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile close toggle */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action: New Chat Button */}
        <div className="p-3">
          <button
            id="new-chat-btn"
            onClick={() => {
              onNewChat();
              onNavigate('workspace');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white text-black hover:bg-slate-200 font-bold text-xs tracking-wide shadow-sm transition-all group ${
              isCollapsed ? 'px-0 justify-center' : ''
            }`}
            title="Start new AI conversation"
          >
            <Plus className="w-4 h-4 text-black group-hover:rotate-90 transition-transform duration-200 shrink-0" />
            {!isCollapsed && <span>New Technical Chat</span>}
          </button>
        </div>

        {/* Search Input (Hidden when collapsed) */}
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="search-conversations-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats & code..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
          {/* Pinned Section */}
          {pinnedConversations.length > 0 && !isCollapsed && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Pin className="w-2.5 h-2.5" />
                <span>Pinned Architecture</span>
              </div>
              {pinnedConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConvClick(conv.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer border transition-all ${
                    activeConversationId === conv.id && currentView === 'workspace'
                      ? 'bg-cyan-950/30 text-cyan-400 border-cyan-900/50 shadow-xs'
                      : 'text-slate-400 border-transparent hover:bg-[#1A1A1D] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recent list */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Recent</span>
                <span className="text-[9px] font-mono text-slate-600">{recentConversations.length}</span>
              </div>
            )}

            {filteredConversations.length === 0 && !isCollapsed && (
              <div className="p-3 text-center text-xs text-slate-500">
                No chats found
              </div>
            )}

            {recentConversations.map((conv) => {
              const isActive = activeConversationId === conv.id && currentView === 'workspace';
              return (
                <div
                  key={conv.id}
                  onClick={() => handleConvClick(conv.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer border transition-all ${
                    isCollapsed ? 'justify-center px-2' : ''
                  } ${
                    isActive
                      ? 'bg-cyan-950/30 text-cyan-400 border-cyan-900/50 shadow-xs font-medium'
                      : 'text-slate-400 border-transparent hover:bg-[#1A1A1D] hover:text-white'
                  }`}
                  title={conv.title}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? '' : 'flex-1'}`}>
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    {!isCollapsed && <span className="truncate">{conv.title}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 hover:text-rose-400 rounded transition-colors"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3 text-slate-500 hover:text-rose-400" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Navigation Sections */}
        <div className="p-3 border-t border-[#1E293B] space-y-1 bg-[#0E0E10]">
          <button
            id="nav-workspace-btn"
            onClick={() => handleNavClick('workspace')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            } ${
              currentView === 'workspace'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1A1A1D] border border-transparent'
            }`}
            title="AI Workspace"
          >
            <MessageSquare className={`w-4 h-4 shrink-0 ${currentView === 'workspace' ? 'text-cyan-400' : 'text-slate-400'}`} />
            {!isCollapsed && <span>AI Workspace</span>}
          </button>

          <button
            id="nav-workflows-btn"
            onClick={() => handleNavClick('workflows')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            } ${
              currentView === 'workflows'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1A1A1D] border border-transparent'
            }`}
            title="AI Workflows"
          >
            <Cpu className={`w-4 h-4 shrink-0 ${currentView === 'workflows' ? 'text-cyan-400' : 'text-slate-400'}`} />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>AI Workflows</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#1A1A1D] text-slate-400 rounded border border-[#2D2D33] font-mono">6</span>
              </div>
            )}
          </button>

          <button
            id="nav-knowledge-btn"
            onClick={() => handleNavClick('knowledge')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            } ${
              currentView === 'knowledge'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1A1A1D] border border-transparent'
            }`}
            title="Knowledge Base"
          >
            <BookmarkCheck className={`w-4 h-4 shrink-0 ${currentView === 'knowledge' ? 'text-cyan-400' : 'text-slate-400'}`} />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Knowledge Base</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#1A1A1D] text-slate-400 rounded border border-[#2D2D33] font-mono">4</span>
              </div>
            )}
          </button>

          <button
            id="nav-history-btn"
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            } ${
              currentView === 'history'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1A1A1D] border border-transparent'
            }`}
            title="Conversation History"
          >
            <History className={`w-4 h-4 shrink-0 ${currentView === 'history' ? 'text-cyan-400' : 'text-slate-400'}`} />
            {!isCollapsed && <span>History</span>}
          </button>

          <button
            id="nav-settings-btn"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            } ${
              currentView === 'settings'
                ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1A1A1D] border border-transparent'
            }`}
            title="Settings"
          >
            <Settings className={`w-4 h-4 shrink-0 ${currentView === 'settings' ? 'text-cyan-400' : 'text-slate-400'}`} />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </div>

        {/* User Profile Area (Footer) */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0E0E10] relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full flex items-center gap-3 p-2 bg-[#1A1A1D] hover:bg-[#202025] rounded-xl border border-[#2D2D33] transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            {photoURL ? (
              <img 
                src={photoURL} 
                alt={displayName} 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-600"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex flex-col text-left min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate">{displayName}</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate">{displayEmail}</span>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute bottom-16 left-3 right-3 p-2 bg-[#1A1A1D] border border-[#2D2D33] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
              <div className="px-2.5 py-1.5 border-b border-[#2D2D33] text-xs">
                <p className="font-semibold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Firebase Authenticated</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleNavClick('settings');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#25252A] hover:text-white cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account & Preferences</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
