import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/utils';

/**
 * ARCHITECTURAL DESIGN TOKENS - REFINED
 * Strict 8pt Grid System + Accessibility Contrast Hardening
 */
export const UI = {
  // Base Glassmorphism - consistent surface treatment
  CARD: "bg-neutral-900/60 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] shadow-2xl shadow-black/80 transition-all duration-300 h-full flex flex-col",

  // Standardized Spacing (8pt Grid)
  GAP_1: "gap-2",   // 8px
  GAP_2: "gap-4",   // 16px
  GAP_3: "gap-6",   // 24px
  GAP_4: "gap-8",   // 32px

  P_1: "p-4",       // 16px
  P_2: "p-6",       // 24px
  P_3: "p-8",       // 32px
  P_4: "p-12",      // 48px

  // Input & Interactive (Min 44pt touch target)
  // Refined for readability: md:text-sm -> md:text-base (16px) for zero-zoom on iOS
  INPUT: "h-14 md:h-12 px-4 rounded-2xl border bg-neutral-900/60 border-white/10 text-white focus:ring-2 focus:ring-accent/40 outline-none transition-all duration-200 ease-in-out font-bold text-base shadow-inner placeholder:text-white/30",

  // Button Base with tactile feedback
  BUTTON_BASE: "min-h-[48px] px-6 rounded-2xl font-[1000] uppercase tracking-[0.4em] flex items-center justify-center transition-all duration-200 ease-in-out active:scale-95 disabled:opacity-40 select-none overflow-hidden relative group shadow-lg shadow-black/40",

  // Layout Constraint
  MAX_CONTAINER: "max-w-[1200px] mx-auto w-full px-4 md:px-8",
  MODAL_OVERLAY: "fixed inset-0 z-[5000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 isolate pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",

  // Labels with HARDENED contrast for accessibility (WCAG 4.5:1)
  // Bumped from text-white/50 to text-neutral-400 (lightened gray)
  LABEL: "text-[11px] md:text-[12px] font-bold text-neutral-400 tracking-widest uppercase ml-1"
};

export const Card = React.memo(({ children, className, danger, noPadding }) => (
  <div className={cn(
    UI.CARD,
    !noPadding && "p-6 md:p-8",
    danger && "border-danger/30 bg-danger/[0.05]",
    className
  )}>
    {children}
  </div>
));

export const Button = React.memo(({ children, onClick, className, variant = 'primary', disabled, size = 'md', style, type = "button" }) => {
  const variants = {
    primary: "bg-accent text-zinc-950 hover:brightness-110",
    secondary: "bg-white/[0.05] text-white border border-white/10 hover:bg-white/10",
    danger: "bg-danger text-white hover:brightness-110",
    ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
    outline: "bg-transparent border-2 border-accent/20 text-inherit hover:border-accent hover:text-accent"
  };

  const sizes = {
    sm: "h-11 px-4 text-[10px]",
    md: "h-14 px-8 text-[11px]",
    lg: "h-16 px-10 text-[12px]"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cn(UI.BUTTON_BASE, variants[variant], sizes[size], className)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
});

export const Input = React.memo(({ value, onChange, label, type = "text", placeholder, isDark, className, required }) => (
  <div className={cn("flex flex-col w-full gap-2.5", className)}>
    {label && <span className={UI.LABEL}>{label}</span>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={cn(UI.INPUT, !isDark && "bg-black/[0.05] border-black/10 text-zinc-950")}
    />
  </div>
));
