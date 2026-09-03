import React, { useState } from 'react';
import { 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Globe
} from 'lucide-react';
import { AppView } from '../types';
import { useAuth } from '../context/AuthContext';

interface SignInPageProps {
  onNavigate: (view: AppView) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate, onShowToast }) => {
  const { signInWithGoogle, isConfigured } = useAuth();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyDomain = async () => {
    if (!currentHostname) return;
    try {
      await navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      onShowToast('Domain Copied', currentHostname);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    setIsGoogleSigningIn(true);

    try {
      const result = await signInWithGoogle();

      if (result.success && result.user) {
        onShowToast(
          `Welcome, ${result.user.displayName || result.user.email?.split('@')[0] || 'Developer'}!`,
          'Successfully authenticated with Google via Firebase.'
        );
        onNavigate('workspace');
      } else if (result.cancelled) {
        // User closed the popup, silently reset
      } else if (result.error) {
        setErrorCode(result.errorCode || null);
        setErrorMessage(result.error);
        onShowToast('Authentication Error', result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during Google sign in.';
      setErrorMessage(msg);
      onShowToast('Authentication Failed', msg);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col justify-between p-4 sm:p-6 bg-tech-grid">
      {/* Top back link */}
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors p-2 -ml-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cyvora AI Overview</span>
        </button>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="rounded-2xl bg-[#0E0E10] border border-[#1E293B] p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Subtle tech glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-sm">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Sign in to Cyvora AI</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time Copilot &bull; Authenticate with your Google account
            </p>
          </div>

          {/* Configuration Status Notice if env vars are missing */}
          {!isConfigured && (
            <div className="mb-5 p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-200">Firebase Configuration Notice</p>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  Firebase environment variables (<code className="font-mono text-amber-200">VITE_FIREBASE_API_KEY</code>, <code className="font-mono text-amber-200">VITE_FIREBASE_PROJECT_ID</code>, etc.) are pending in the environment. Configure them to connect to your Firebase project.
                </p>
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex flex-col gap-2.5 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-semibold text-rose-100">
                    {errorCode === 'auth/unauthorized-domain' ? 'Firebase Domain Authorization Required' : 'Authentication Alert'}
                  </p>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">{errorMessage}</p>
                </div>
              </div>

              {errorCode === 'auth/unauthorized-domain' && currentHostname && (
                <div className="mt-1 pt-2.5 border-t border-rose-900/60 space-y-2 text-[11px]">
                  <p className="text-slate-300 font-medium">Quick Resolution Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Open your <span className="text-slate-200 font-medium">Firebase Console</span>.</li>
                    <li>Go to <span className="text-slate-200 font-medium">Authentication &gt; Settings &gt; Authorized domains</span>.</li>
                    <li>Click <span className="text-slate-200 font-medium">Add domain</span> and paste:</li>
                  </ol>

                  <div className="flex items-center justify-between gap-2 p-2 bg-[#09090B] border border-rose-900/80 rounded-lg text-slate-200 font-mono text-[11px]">
                    <span className="truncate select-all">{currentHostname}</span>
                    <button
                      onClick={handleCopyDomain}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 text-[10px] font-sans font-medium transition-colors cursor-pointer shrink-0"
                    >
                      {copiedDomain ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Domain</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="space-y-3 mb-6">
            <button
              id="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={isGoogleSigningIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGoogleSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Connecting to Google Account...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 20.4 7.4 23 12 23z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-[10px] font-mono uppercase text-slate-500">Security & Authentication</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          {/* Features / Security list */}
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Firebase Browser Auth Session Persistence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Secure token verification with zero leaked credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Protected workspace sessions with instant profile sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security footnote */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
        <span>Firebase Authenticated Session &bull; Sandboxed Security</span>
      </div>
    </div>
  );
};
