import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  SlidersHorizontal, 
  Code2, 
  Terminal, 
  CornerDownLeft,
  X,
  FileCode,
  Check
} from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  onOpenSettings?: () => void;
  initialValue?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  isLoading = false,
  onOpenSettings,
  initialValue = ''
}) => {
  const [input, setInput] = useState(initialValue);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const finalContent = attachedFile 
      ? `[Attached context: ${attachedFile}]\n\n${input}`
      : input;
    onSendMessage(finalContent);
    setInput('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none">
      {/* Attached file chip */}
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-xs text-cyan-300 w-fit animate-in fade-in slide-in-from-bottom-1">
          <FileCode className="w-3.5 h-3.5" />
          <span className="font-mono">{attachedFile}</span>
          <button 
            onClick={() => setAttachedFile(null)}
            className="p-0.5 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative rounded-2xl bg-[#161618] border border-[#2D2D33] focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 shadow-xl transition-all">
        {/* Top bar inside composer: Model tag & quick actions */}
        <div className="flex items-center justify-between px-3.5 pt-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0E0E10] border border-[#1E293B] text-[11px] font-mono text-cyan-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Cyvora Ultra Copilot
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono hidden sm:flex">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-[#0E0E10] border border-[#1E293B] rounded text-[10px] text-slate-400">Enter</kbd>
            <span>to send</span>
          </div>
        </div>

        {/* Textarea Input */}
        <textarea
          id="cyvora-chat-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a technical question about Cloud Run, Linux systems, SQL, Python, or Architecture..."
          rows={3}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none leading-relaxed"
        />

        {/* Bottom Bar: Action buttons */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t border-[#1E293B]">
          <div className="flex items-center gap-1">
            {/* Attachment Button Placeholder */}
            <button
              id="composer-attachment-btn"
              type="button"
              onClick={() => setShowAttachmentModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#1A1A1D] transition-colors"
              title="Attach code snippet or log file (Placeholder)"
            >
              <Paperclip className="w-4 h-4 text-slate-400 hover:text-cyan-400 transition-colors" />
              <span className="text-xs hidden sm:inline">Attach Log / Snippet</span>
            </button>

            <button
              type="button"
              onClick={() => setInput((prev) => prev + (prev ? '\n```\n\n```' : '```\n\n```'))}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#1A1A1D] transition-colors"
              title="Insert code block"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Send Button */}
            <button
              id="composer-send-btn"
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                input.trim() && !isLoading
                  ? 'bg-white hover:bg-slate-200 text-black cursor-pointer'
                  : 'bg-[#1A1A1D] text-slate-500 cursor-not-allowed border border-[#2D2D33]'
              }`}
            >
              <span>{isLoading ? 'Thinking...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Attachment Placeholder Modal */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0E0E10] border border-[#1E293B] rounded-xl p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Attach Technical Context</h3>
              </div>
              <button onClick={() => setShowAttachmentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Select a sample snippet or diagnostic log to include with your query:
            </p>

            <div className="space-y-2 mb-4">
              {[
                { name: 'gcloud-deploy-error.log', desc: 'Cloud Run HTTP 504 Timeout Trace' },
                { name: 'schema.sql', desc: 'PostgreSQL Database Schema' },
                { name: 'systemd-journal.txt', desc: 'Linux Out-of-Memory (OOM) Dump' },
                { name: 'main.py', desc: 'FastAPI Async Redis Connection Pool' },
              ].map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => {
                    setAttachedFile(sample.name);
                    setShowAttachmentModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#161618] border border-[#2D2D33] hover:border-cyan-500/50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    <div>
                      <p className="text-xs font-mono text-slate-200">{sample.name}</p>
                      <p className="text-[10px] text-slate-500">{sample.desc}</p>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAttachmentModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#1A1A1D] border border-[#2D2D33]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
