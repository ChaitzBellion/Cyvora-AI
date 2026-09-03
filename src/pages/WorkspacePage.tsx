import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Download, 
  Trash2,
  Cpu,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  Conversation, 
  ChatMessage, 
  SuggestedPrompt, 
  UserProfile, 
  AppView, 
  SavedKnowledgeItem 
} from '../types';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileHeader } from '../components/layout/MobileHeader';
import { EmptyState } from '../components/workspace/EmptyState';
import { ChatArea } from '../components/workspace/ChatArea';
import { MessageComposer } from '../components/workspace/MessageComposer';

interface WorkspacePageProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onSendMessage: (content: string) => void;
  onSaveToKnowledge: (msg: ChatMessage) => void;
  userProfile: UserProfile;
  suggestedPrompts: SuggestedPrompt[];
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isLoading?: boolean;
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onSendMessage,
  onSaveToKnowledge,
  userProfile,
  suggestedPrompts,
  currentView,
  onNavigate,
  isLoading = false,
  prefilledPrompt = '',
  onClearPrefilledPrompt
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  const handlePromptSelect = (promptText: string) => {
    onSendMessage(promptText);
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-slate-100 overflow-hidden">
      {/* ChatGPT-style Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onNewChat={onNewChat}
        onDeleteConversation={onDeleteConversation}
        userProfile={userProfile}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main AI Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#0A0A0B] relative overflow-hidden">
        {/* Mobile top header bar */}
        <MobileHeader
          title={activeConversation?.title || 'Cyvora AI Workspace'}
          onOpenSidebar={() => setIsOpenMobile(true)}
          onNewChat={onNewChat}
        />

        {/* Desktop Header for Workspace */}
        <header className="hidden md:flex items-center justify-between px-6 py-2.5 border-b border-[#1E293B] bg-[#0A0A0B]/90 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-200 truncate">
                {activeConversation ? activeConversation.title : 'New Technical Chat Session'}
              </span>
            </div>

            {activeConversation && (
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-900/50 shrink-0">
                {activeConversation.messages.length} messages
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0E0E10] p-1 rounded-lg border border-[#1E293B] text-xs">
              <button
                onClick={() => onNavigate('workspace')}
                className="px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 font-medium transition-colors"
              >
                Workspace
              </button>
              <button
                onClick={() => onNavigate('workflows')}
                className="px-2.5 py-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                Workflows
              </button>
              <button
                onClick={() => onNavigate('knowledge')}
                className="px-2.5 py-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                Knowledge
              </button>
              <button
                onClick={() => onNavigate('history')}
                className="px-2.5 py-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                History
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0E0E10] border border-[#1E293B] text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Cyvora Ultra Engine</span>
            </div>
          </div>
        </header>

        {/* Center Content: Either Empty State or Active Messages */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-tech-glow">
          {!hasMessages ? (
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              <EmptyState
                suggestedPrompts={suggestedPrompts}
                onSelectPrompt={handlePromptSelect}
              />
            </div>
          ) : (
            <ChatArea
              messages={activeConversation.messages}
              isLoading={isLoading}
              onSaveToKnowledge={onSaveToKnowledge}
            />
          )}
        </div>

        {/* Message Composer Footer */}
        <div className="border-t border-[#1E293B] bg-[#0A0A0B]/90 backdrop-blur-sm pt-2">
          <MessageComposer
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onOpenSettings={() => onNavigate('settings')}
            initialValue={prefilledPrompt}
          />
        </div>
      </div>
    </div>
  );
};
