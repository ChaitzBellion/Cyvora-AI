import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg bg-[#0E0E10] border border-[#1E293B] shadow-2xl shadow-black/80 text-sm text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-100">{t.title}</p>
            {t.description && <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-500 hover:text-slate-300 p-1 -mr-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
