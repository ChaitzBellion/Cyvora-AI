import React from 'react';
import { 
  Terminal, 
  Cloud, 
  Code2, 
  Database, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  CheckCircle2,
  Lock,
  GitBranch,
  Server,
  Play
} from 'lucide-react';
import { AppView } from '../types';
import { Navbar } from '../components/layout/Navbar';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onLaunchPrompt: (promptText: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLaunchPrompt }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col bg-tech-grid">
      <Navbar currentView="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Subtle tech ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Ecosystem badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E0E10] border border-[#1E293B] text-xs font-mono text-cyan-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Cyvora Studio Ecosystem &bull; Technical AI Copilot</span>
          </div>

          {/* Core Headline requested */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
            Turn technical problems into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
              actionable solutions.
            </span>
          </h1>

          {/* Core Subtitle requested */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Cyvora AI is your AI technology copilot for cloud, code, Linux, DevOps, data, and generative AI.
          </p>

          {/* Primary and Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <button
              id="landing-primary-start-btn"
              onClick={() => onNavigate('workspace')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>Start with Cyvora AI.</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-secondary-workflows-btn"
              onClick={() => onNavigate('workflows')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0E0E10] hover:bg-[#1A1A1D] text-slate-200 hover:text-white font-semibold text-sm border border-[#1E293B] transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Explore AI Workflows</span>
            </button>
          </div>

          {/* Terminal / Live Preview Interactive Mockup */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#0E0E10] border border-[#1E293B] shadow-2xl overflow-hidden text-left relative">
            {/* Window title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161618] border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">cyvora-copilot-engine // gcp-cloud-run.ts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-900/50">
                  Model: Cyvora Ultra
                </span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 sm:p-6 space-y-4 font-mono text-xs sm:text-sm">
              {/* User prompt preview */}
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold select-none">&gt;</span>
                <p className="text-slate-200">
                  How do I eliminate HTTP 504 gateway timeouts on Google Cloud Run when connecting to Cloud SQL?
                </p>
              </div>

              {/* Copilot response preview */}
              <div className="p-4 rounded-xl bg-[#0A0A0B] border border-cyan-900/40 text-slate-300 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Direct VPC Egress Solution
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Verified for GCP 2026</span>
                </div>
                <p className="text-xs text-slate-300">
                  Switch from Serverless VPC Access connector to **Direct VPC Egress** to bypass throughput bottlenecks and sub-millisecond connection delays:
                </p>
                <div className="p-3 bg-[#0E0E10] rounded-lg border border-[#1E293B] text-xs text-cyan-300 overflow-x-auto">
                  <code>
                    gcloud run deploy cyvora-backend \<br />
                    &nbsp;&nbsp;--network default --subnet default \<br />
                    &nbsp;&nbsp;--vpc-egress private-ranges-only \<br />
                    &nbsp;&nbsp;--min-instances 1 --region asia-southeast1
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Technical Domains */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1E293B]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
              Domain Expertise
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Modern Engineering Stacks
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0E0E10] hover:bg-[#121215] border border-[#1E293B] hover:border-cyan-500/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Cloud className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Cloud & Infrastructure</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Diagnose Google Cloud Platform, AWS, Kubernetes manifests, IAM policies, and VPC routing with production precision.
              </p>
              <span className="text-[11px] font-mono text-cyan-400">GCP &bull; Kubernetes &bull; Terraform</span>
            </div>

            <div className="p-6 rounded-xl bg-[#0E0E10] hover:bg-[#121215] border border-[#1E293B] hover:border-cyan-500/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-sky-950/70 border border-sky-800/50 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Linux Systems & Shell</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Trace kernel socket states, automate systemd background services, analyze memory leaks, and generate safe shell scripts.
              </p>
              <span className="text-[11px] font-mono text-sky-400">systemd &bull; Bash &bull; Sockets &bull; iptables</span>
            </div>

            <div className="p-6 rounded-xl bg-[#0E0E10] hover:bg-[#121215] border border-[#1E293B] hover:border-cyan-500/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-indigo-950/70 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Data & SQL Engineering</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Generate complex PostgreSQL window queries, BigQuery analytics, index optimization, and connection pool architectures.
              </p>
              <span className="text-[11px] font-mono text-indigo-400">PostgreSQL &bull; BigQuery &bull; CTEs &bull; Redis</span>
            </div>
          </div>
        </section>

        {/* Quick Launch CTA Banner */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-2xl bg-[#0E0E10] border border-[#1E293B] p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ready to accelerate your technical workflows?
              </h3>
              <p className="text-sm text-slate-400">
                Launch the Cyvora AI Workspace now. No credit card or complex setup required.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('workspace')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0E0E10] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
              CY
            </div>
            <span className="font-semibold text-white">Cyvora AI</span>
            <span className="text-slate-500">&bull; Part of the Cyvora Studio Ecosystem</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('workflows')} className="hover:text-white cursor-pointer">Workflows</button>
            <button onClick={() => onNavigate('knowledge')} className="hover:text-white cursor-pointer">Saved Knowledge</button>
            <button onClick={() => onNavigate('settings')} className="hover:text-white cursor-pointer">Settings</button>
            <button onClick={() => onNavigate('signin')} className="hover:text-white cursor-pointer">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
