import React from 'react';
import { 
  Cloud, 
  Terminal, 
  Code2, 
  Database, 
  GraduationCap, 
  Sparkles, 
  ArrowUpRight,
  Layers,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { SuggestedPrompt } from '../../types';

interface EmptyStateProps {
  suggestedPrompts: SuggestedPrompt[];
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  suggestedPrompts,
  onSelectPrompt,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-cyan-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-sky-400" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-teal-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
      {/* Brand Hero Visual */}
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
          <span>CY</span>
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-900/50 rounded text-[9px] font-mono font-semibold">
          AI Copilot
        </div>
      </div>

      {/* Headline & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2.5">
        Turn technical problems into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">actionable solutions.</span>
      </h1>
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-8 leading-relaxed">
        Cyvora AI is your AI technology copilot for cloud, code, Linux, DevOps, data, and generative AI.
      </p>

      {/* Tech capability tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0E0E10] border border-[#1E293B] text-slate-300">
          <Cloud className="w-3 h-3 text-cyan-400" /> Google Cloud / GCP
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0E0E10] border border-[#1E293B] text-slate-300">
          <Terminal className="w-3 h-3 text-sky-400" /> Linux & Bash
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0E0E10] border border-[#1E293B] text-slate-300">
          <Code2 className="w-3 h-3 text-indigo-400" /> Python & TypeScript
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0E0E10] border border-[#1E293B] text-slate-300">
          <Database className="w-3 h-3 text-teal-400" /> SQL & Databases
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0E0E10] border border-[#1E293B] text-slate-300">
          <Cpu className="w-3 h-3 text-purple-400" /> DevOps & Docker
        </span>
      </div>

      {/* Suggested Prompts Section */}
      <div className="w-full text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Suggested Quick Prompts
          </span>
          <span className="text-[11px] text-slate-500">Click to start session</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedPrompts.map((item) => (
            <button
              key={item.id}
              id={`suggested-prompt-${item.id}`}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group relative flex items-start gap-3 p-3.5 rounded-xl bg-[#0E0E10] hover:bg-[#121215] border border-[#1E293B] hover:border-cyan-500/50 text-left transition-all duration-150 shadow-sm cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-[#161618] border border-[#2D2D33] shrink-0 group-hover:border-cyan-800/60 transition-colors">
                {getIcon(item.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h2 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h2>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
                {item.badge && (
                  <span className="mt-2 inline-block text-[10px] font-mono text-cyan-400/90 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-900/50">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ecosystem reassurance */}
      <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
        <span>Cyvora Studio Ecosystem Foundation Mode &bull; Sandboxed Execution Ready</span>
      </div>
    </div>
  );
};
