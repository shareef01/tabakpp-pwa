import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/utils';

/**
 * UI Constants for Design System Consistency
 * Standardized for elite-level high-fidelity presentation.
 */
export const UI = {
  CARD: "bg-neutral-900/50 backdrop-blur-2xl border border-white/[0.05] rounded-[32px] shadow-2xl shadow-black/80 transition-all duration-500",
  INPUT: "h-14 px-6 rounded-2xl border bg-neutral-900/60 border-white/5 text-white focus:ring-2 focus:ring-accent/40 focus:border-accent/40 focus:bg-neutral-900/90 outline-none transition-all duration-300 placeholder:text-neutral-600 font-bold shadow-inner text-base",
  BUTTON_BASE: "min-h-[56px] px-8 rounded-2xl font-[1000] uppercase tracking-[0.4em] flex items-center justify-center transition-all duration-300 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-40 select-none overflow-hidden relative group shadow-[0_15px_30px_rgba(0,0,0,0.5)]",
  LABEL: "text-[10px] font-black text-neutral-500 tracking-[0.4em] uppercase ml-1 block mb-2",
  GLASS_ACTION: "p-3 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300 active:scale-90"
};

export const Card = React.memo(({ children, className, danger, noPadding }) => (
  <div className={cn(
    UI.CARD,
    !noPadding && "p-8 md:p-10",
    danger && "border-danger/20 bg-danger/[0.03]",
    "will-change-[border-color,background-color,transform]",
    className
  )}>
    {children}
  </div>
));

export const Button = React.memo(({ children, onClick, className, variant = 'primary', disabled, size = 'md', style, type = "button" }) => {
  const variants = {
    primary: "bg-accent text-zinc-950 shadow-[0_10px_25px_var(--accent-glow)] hover:brightness-110 hover:shadow-[0_15px_35px_var(--accent-glow)]",
    secondary: "bg-white/[0.03] text-white border border-white/10 hover:bg-white/[0.07] hover:border-white/20",
    danger: "bg-danger text-white shadow-[0_10px_25px_rgba(248,113,113,0.2)] hover:brightness-110",
    ghost: "bg-transparent text-neutral-500 hover:text-white hover:bg-white/5",
    outline: "bg-transparent border-2 border-accent/15 text-inherit hover:border-accent hover:text-accent hover:bg-accent/[0.03]"
  };

  const sizes = {
    sm: "h-11 px-6 text-[9px]",
    md: "h-16 px-10 text-[11px]",
    lg: "h-20 px-12 text-[13px]"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cn(
        UI.BUTTON_BASE,
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </motion.button>
  );
});

export const Input = React.memo(({ value, onChange, label, type = "text", placeholder, isDark, className, required }) => (
  <div className={cn("flex flex-col w-full", className)}>
    {label && <span className={cn(UI.LABEL)}>{label}</span>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={cn(
        UI.INPUT,
        !isDark && "bg-black/[0.03] border-black/5 text-zinc-950 focus:bg-black/[0.06] focus:ring-black/10 focus:border-black/10"
      )}
    />
  </div>
));

export const StaggeredItem = React.memo(({ children, index, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={cn("will-change-[transform,opacity]", className)}
  >
    {children}
  </motion.div>
));
