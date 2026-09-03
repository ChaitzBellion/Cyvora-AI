import React, { useState } from 'react';
import { Check, Copy, Terminal, FileCode } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  fileName?: string;
  id?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language = 'bash',
  fileName,
  id
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div id={id} className="my-3 rounded-lg border border-[#1E293B] bg-[#0E0E10] overflow-hidden shadow-sm group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161618] border-b border-[#1E293B] text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          {language === 'bash' || language === 'sh' || language === 'zsh' ? (
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
          )}
          <span className="text-slate-300 font-medium">{fileName || language.toUpperCase()}</span>
        </div>
        <button
          id={`copy-btn-${fileName || language}`}
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-[#0E0E10] hover:bg-[#1A1A1D] text-slate-300 hover:text-white border border-[#1E293B] text-[11px] transition-all cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-3 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
        <pre className="table w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-[#1A1A1D]/60 transition-colors">
              <span className="table-cell select-none pr-4 text-slate-600 text-right w-8 text-[11px]">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre font-mono">
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
