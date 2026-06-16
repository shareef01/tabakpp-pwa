import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * RYO_ROLL (Hand-Rolled) Gauge
 * Features a thinner, tapered silhouette that 'burns down' as count increases.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-40 h-6" : "w-32 h-5")}>
      {/* Hand-roll Paper (Burns from left) */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full bg-white/90 rounded-l-sm relative"
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Active Glow Tip */}
          {remaining > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent shadow-[0_0_15px_var(--accent)] animate-pulse" />
          )}
        </motion.div>
      </div>

      {/* RYO Filter/Tip */}
      <div className="w-6 h-full bg-neutral-700/60 rounded-r-full border-l border-black/20" />
    </div>
  );
});

/**
 * SmokingProgress (Pre-rolled Schachtel)
 * High-fidelity burn-down logic. The cigarette shortens as you smoke.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  const colors = {
    CIGARETTE: 'bg-white',
    KING: 'bg-gradient-to-l from-white to-neutral-100',
    QUEEN: 'bg-gradient-to-l from-white to-neutral-200'
  };

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      {/* Cigarette Paper Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className={cn("h-full relative shadow-lg", colors[variant] || colors.CIGARETTE)}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Active Ember Glow */}
          {remaining > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-accent shadow-[0_0_20px_var(--accent)]" />
          )}
        </motion.div>
      </div>

      {/* Classic Filter */}
      <div className="w-12 h-full bg-[#f89c33] rounded-r-3xl shadow-inner border-l border-black/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:4px_4px]" />
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
