import React, { useRef, useEffect } from 'react';
import { 
  Terminal, 
  User, 
  Copy, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  Sparkles, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  Cpu
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { CodeSnippet } from '../ui/CodeSnippet';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSaveToKnowledge: (message: ChatMessage) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading = false,
  onSaveToKnowledge
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyMessage = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Helper to parse markdown code blocks and prose
  const renderMessageContent = (text: string) => {
    const segments: React.ReactNode[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9_#-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          segments.push(
            <div key={`text-${lastIndex}`} className="space-y-1">
              {renderFormattedText(textBefore)}
            </div>
          );
        }
      }

      const lang = match[1] || 'bash';
      const code = match[2] || '';
      segments.push(
        <CodeSnippet
          key={`code-${match.index}`}
          code={code}
          language={lang}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        segments.push(
          <div key={`text-${lastIndex}`} className="space-y-1">
            {renderFormattedText(remainingText)}
          </div>
        );
      }
    }

    // If no code blocks were found, fallback to standard formatted text
    if (segments.length === 0) {
      return (
        <div className="space-y-1">
          {renderFormattedText(text)}
        </div>
      );
    }

    return segments;
  };

  // Helper to format text with lightweight markdown bold and bullet lists
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-cyan-300 mt-3 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-slate-100 mt-4 mb-2">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-0.5 text-xs sm:text-sm">
            {formatBold(itemText)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 my-0.5 text-xs sm:text-sm">
            {formatBold(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-1 text-slate-200 text-xs sm:text-sm leading-relaxed">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-cyan-200">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[11px] sm:text-xs">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1 shadow-sm">
                  <span>CY</span>
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`flex flex-col max-w-[88%] sm:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Header label for message */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isUser ? 'You' : 'Cyvora AI Copilot'}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {msg.metadata?.model && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950/60 border border-cyan-900/50 text-cyan-400 rounded font-mono">
                      {msg.metadata.model}
                    </span>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`p-4 rounded-2xl border text-sm ${
                    isUser
                      ? 'bg-cyan-950/30 text-slate-100 border-cyan-900/50 rounded-tr-xs shadow-sm'
                      : 'bg-[#0E0E10] text-slate-200 border-[#1E293B] rounded-tl-xs shadow-sm'
                  }`}
                >
                  {renderMessageContent(msg.content)}

                  {/* Render attached legacy code blocks if any */}
                  {msg.codeBlocks && msg.codeBlocks.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {msg.codeBlocks.map((cb, idx) => (
                        <CodeSnippet
                          key={idx}
                          code={cb.code}
                          language={cb.language}
                          fileName={cb.filename}
                        />
                      ))}
                    </div>
                  )}

                  {/* Assistant Actions Bar */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyMessage(msg)}
                          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#1A1A1D] hover:text-slate-200 transition-colors text-[11px]"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onSaveToKnowledge(msg)}
                          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-cyan-950 hover:text-cyan-300 border border-transparent hover:border-cyan-900/50 transition-all text-[11px]"
                          title="Save this solution to Knowledge Base"
                        >
                          {msg.isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-cyan-400">Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                              <span>Save to Knowledge</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        {msg.metadata?.tokens && (
                          <span>{msg.metadata.tokens} tokens &bull; {msg.metadata.latencyMs}ms</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded bg-[#1A1A1D] border border-[#2D2D33] flex items-center justify-center text-slate-300 font-bold shrink-0 mt-1">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Generating State Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 animate-in fade-in duration-150">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              <span>CY</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E0E10] border border-cyan-900/50 rounded-tl-xs flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-mono text-cyan-300">Cyvora AI is analyzing architecture & compiling solution...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
