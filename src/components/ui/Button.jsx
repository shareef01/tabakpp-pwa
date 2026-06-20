import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/system';
import { UI } from '../../constants/ui';

/**
 * ATOMIC BUTTON (UI)
 * High-fidelity hardware interaction with tactile feedback.
 */
export const Button = React.memo(({ children, onClick, className, variant = 'primary', disabled, size = 'md', style, type = "button" }) => {
  const variants = {
    primary: "bg-accent text-zinc-950 hover:brightness-105 active:bg-accent/90 shadow-[0_0_24px_-4px_rgba(var(--accent-rgb),0.25)]",
    secondary: "bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12]",
    danger: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-[0_0_24px_-4px_rgba(244,63,94,0.25)]",
    ghost: "bg-transparent text-[#888888] hover:text-white hover:bg-white/[0.04]",
    outline: "bg-transparent border border-accent/20 text-inherit hover:border-accent/40 hover:bg-accent/[0.02]"
  };

  const sizes = {
    sm: "h-11 px-4 text-[10px]",
    md: "h-14 px-8 text-[11px]",
    lg: "h-16 px-10 text-[12px]"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cn(UI.BUTTON_BASE, variants[variant], sizes[size], 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50', className)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
});
