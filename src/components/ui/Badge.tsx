import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'slate' | 'emerald' | 'amber' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  className = '',
  id
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium tracking-wide uppercase rounded-md border';
  
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-1'
  }[size];

  const variantClasses = {
    cyan: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/50',
    slate: 'bg-[#161618] text-slate-300 border-[#2D2D33]',
    emerald: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50',
    amber: 'bg-amber-950/40 text-amber-400 border-amber-900/50',
    purple: 'bg-purple-950/40 text-purple-400 border-purple-900/50',
    outline: 'bg-transparent text-slate-400 border-[#1E293B]'
  }[variant];

  return (
    <span id={id} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};
