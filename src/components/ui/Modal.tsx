import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md'
}) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className={`w-full ${maxWidthClass} bg-[#0E0E10] border border-[#1E293B] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B] bg-[#161618]">
          <div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#1F1F23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-[#1E293B] bg-[#161618]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
