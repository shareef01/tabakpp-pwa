import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Minimal Neon Glow
 */
const NeonGlow = ({ isOver }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 2, repeat: Infinity }}
    className={cn(
      "absolute -left-4 w-12 h-12 blur-xl rounded-full",
      isOver ? "bg-red-500" : "bg-accent"
    )}
  />
);

/**
 * RyoRollProgress (Minimal Hand-Rolled)
 * Geometric tapered shape with a dark roach.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? "w-44 h-8" : "w-32 h-6")}>
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5 rounded-sm" style={{ clipPath: 'polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)' }} />

      {/* Progress Body */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        className="h-full bg-white relative z-10"
        transition={{ type: 'spring', damping: 20 }}
        style={{ clipPath: 'polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)' }}
      >
        <NeonGlow isOver={isOver} />
      </motion.div>

      {/* Roach / Filter */}
      <div
        className="absolute right-[-8px] w-6 h-[40%] bg-neutral-800 rounded-sm z-20"
        style={{ transform: 'perspective(100px) rotateY(-20deg)' }}
      />
    </div>
  );
});

/**
 * JointProgress (King/Queen Conical)
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? (isQueen ? "w-40 h-10" : "w-48 h-8") : "w-32 h-6")}>
      <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }} />

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        className="h-full bg-white relative z-10"
        transition={{ type: 'spring', damping: 20 }}
        style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }}
      >
        <NeonGlow isOver={isOver} />
      </motion.div>

      <div className="absolute right-[-10px] w-10 h-[30%] bg-neutral-900 border-l border-white/5 z-20" />
    </div>
  );
});

/**
 * SmokingProgress (Minimal Schachtel)
 * Features the signature orange dotted filter.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }

  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-start group", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      {/* Cigarette Track */}
      <div className="absolute inset-0 bg-white/5 rounded-[2px]" />

      {/* Progress Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 70}%` }} // Leave space for filter
        className="h-full bg-white relative z-10"
        transition={{ type: 'spring', damping: 20 }}
      >
        <NeonGlow isOver={isOver} />
      </motion.div>

      {/* Minimal Dotted Filter */}
      <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-[#f4a261] rounded-r-[2px] flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-[3px] opacity-40">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-black/40" />
          ))}
        </div>
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
    <div className={cn("relative flex items-center justify-center", isLarge ? "w-28 h-28" : "w-20 h-20")}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-white/5" strokeWidth="8" />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          className="fill-none stroke-accent drop-shadow-[0_0_10px_var(--accent)]"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circum, strokeDashoffset: circum }}
          animate={{ strokeDashoffset: circum - (progress * circum) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_12px_var(--accent)]" />
      </div>
    </div>
  );
});

export const GenericBarProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  return (
    <div className={cn("w-full bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden p-0.5", isLarge ? "max-w-[200px] h-5" : "max-w-[160px] h-3.5")}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className="h-full bg-accent origin-left rounded-full shadow-[0_0_8px_var(--accent)]"
        transition={{ type: 'spring', damping: 20 }}
      />
    </div>
  );
});
