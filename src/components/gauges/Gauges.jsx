import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * RYO_ROLL Visualization
 * A specialized gauge for rolled cigarettes.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-center", isLarge ? "w-40 h-8" : "w-32 h-6")}>
      <div className="absolute inset-0 bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          className="h-full bg-accent origin-left rounded-full shadow-[0_0_15px_var(--accent)] opacity-80"
          transition={{ type: 'spring', damping: 20 }}
        />
      </div>
      <div className="absolute -right-2 w-4 h-full bg-amber-600/40 rounded-r-full blur-[2px]" />
    </div>
  );
});

export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  const colors = {
    CIGARETTE: 'bg-white',
    KING: 'bg-gradient-to-r from-neutral-200 to-white',
    QUEEN: 'bg-gradient-to-r from-white to-neutral-200'
  };

  return (
    <div className={cn("relative flex items-center", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      <div className="flex-1 h-full bg-neutral-800/40 rounded-l-2xl rounded-r-3xl border border-white/5 overflow-hidden flex relative">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress * 100}%` }}
          className={cn("h-full origin-left", colors[variant] || colors.CIGARETTE)}
          transition={{ type: 'spring', damping: 25 }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-amber-500 rounded-r-3xl shadow-inner border-l border-black/10" />
      </div>
    </div>
  );
});

export const RingProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const radius = 30;
  const circum = 2 * Math.PI * radius;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-center", isLarge ? "w-24 h-24" : "w-16 h-16")}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-white/5" strokeWidth="6" />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          className="fill-none stroke-accent drop-shadow-[0_0_8px_var(--accent)]"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: circum, strokeDashoffset: circum }}
          animate={{ strokeDashoffset: circum - (progress * circum) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent)]" />
      </div>
    </div>
  );
});

export const GenericBarProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  return (
    <div className="w-full max-w-[200px] h-3 bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className="h-full bg-accent origin-left rounded-full"
        transition={{ type: 'spring', damping: 20 }}
      />
    </div>
  );
});
