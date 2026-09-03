import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Archive, 
  MessageSquare, 
  Pin, 
  Calendar, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Conversation, AppView } from '../types';
import { Badge } from '../components/ui/Badge';

interface HistoryPageProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onNavigate: (view: AppView) => void;
  onNewChat: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onTogglePin,
  onToggleArchive,
  onNavigate,
  onNewChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'archived'>('all');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'pinned') return matchesSearch && c.isPinned;
    if (activeFilter === 'archived') return matchesSearch && c.isArchived;
    return matchesSearch && !c.isArchived;
  });

  const handleOpenConversation = (id: string) => {
    onSelectConversation(id);
    onNavigate('workspace');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">Conversation History</h1>
              <Badge variant="cyan">{conversations.length} Sessions</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Audit log of past technical problem-solving sessions, architecture designs, and debug traces.
            </p>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onNavigate('workspace');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span>Start New Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                  : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
              }`}
            >
              Active Sessions
            </button>
            <button
              onClick={() => setActiveFilter('pinned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'pinned'
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                  : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
              }`}
            >
              Pinned
            </button>
            <button
              onClick={() => setActiveFilter('archived')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFilter === 'archived'
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                  : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
              }`}
            >
              Archived
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past logs & queries..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0E0E10] border border-[#1E293B]">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-200 mb-1">No conversation sessions found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Conversation List */}
        <div className="space-y-2.5">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              id={`history-row-${conv.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0E0E10] border border-[#1E293B] hover:border-cyan-500/50 transition-all shadow-sm group"
            >
              <div 
                onClick={() => handleOpenConversation(conv.id)}
                className="flex items-start gap-3.5 cursor-pointer flex-1 min-w-0"
              >
                <div className="p-2 rounded-lg bg-[#161618] border border-[#2D2D33] group-hover:border-cyan-700/50 shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {conv.title}
                    </h3>
                    {conv.isPinned && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-900/50 flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {conv.snippet}
                  </p>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1E293B] text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {conv.date}
                  </span>
                  <span className="px-2 py-0.5 bg-[#161618] border border-[#2D2D33] rounded text-[11px] text-slate-300">
                    {conv.messageCount} msgs
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(conv.id)}
                    className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-[#161618] transition-colors cursor-pointer"
                    title={conv.isPinned ? 'Unpin session' : 'Pin session'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${conv.isPinned ? 'text-cyan-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => onToggleArchive(conv.id)}
                    className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-[#161618] transition-colors cursor-pointer"
                    title={conv.isArchived ? 'Unarchive' : 'Archive session'}
                  >
                    <Archive className={`w-3.5 h-3.5 ${conv.isArchived ? 'text-sky-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => onDeleteConversation(conv.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-[#161618] transition-colors cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
