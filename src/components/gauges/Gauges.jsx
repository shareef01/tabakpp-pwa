import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Neon Edge Glow
 * Pulsating accent at the leading edge of the progress bar.
 */
const NeonEdge = ({ isOver }) => (
  <motion.div
    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={cn(
      "absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-12 blur-xl rounded-full z-10",
      isOver ? "bg-red-500" : "bg-accent"
    )}
  />
);

/**
 * RyoRollProgress (Master RYO)
 * Tapered white body growing from left to right.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? "w-44 h-8" : "w-32 h-6")}>
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)' }} />

      {/* Progress Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 85}%` }}
        className="h-full bg-white relative z-20"
        transition={{ type: 'spring', damping: 20 }}
        style={{ clipPath: 'polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)' }}
      >
        {progress > 0 && <NeonEdge isOver={isOver} />}
      </motion.div>

      {/* Fixed Roach (Right) */}
      <div
        className="absolute right-[-8px] w-6 h-[40%] bg-neutral-800 rounded-sm z-30"
        style={{ transform: 'perspective(100px) rotateY(-20deg)' }}
      />
    </div>
  );
});

/**
 * JointProgress (Master Conical)
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? (isQueen ? "w-40 h-10" : "w-48 h-8") : "w-32 h-6")}>
      {/* Track */}
      <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }} />

      {/* Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 85}%` }}
        className="h-full bg-white relative z-20"
        transition={{ type: 'spring', damping: 20 }}
        style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }}
      >
        {progress > 0 && <NeonEdge isOver={isOver} />}
      </motion.div>

      {/* Roach */}
      <div className="absolute right-[-10px] w-10 h-[30%] bg-neutral-900 border-l border-white/5 z-30" />
    </div>
  );
});

/**
 * SmokingProgress (Master Schachtel)
 * Features the orange dotted filter at the fixed right end.
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
      {/* Track */}
      <div className="absolute inset-0 bg-white/5 rounded-[2px]" />

      {/* Fill (Fills 70% of total width, leaving 30% for filter) */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 70}%` }}
        className="h-full bg-white relative z-20 rounded-l-[2px]"
        transition={{ type: 'spring', damping: 20 }}
      >
        {progress > 0 && <NeonEdge isOver={isOver} />}
      </motion.div>

      {/* Orange Filter (Fixed Right) */}
      <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-[#f4a261] rounded-r-[2px] flex items-center justify-center z-10 overflow-hidden">
        <div className="grid grid-cols-3 gap-[3px] opacity-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-black" />
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
    <div className={cn("w-full bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden p-0.5 shadow-inner", isLarge ? "max-w-[200px] h-5" : "max-w-[160px] h-3.5")}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className="h-full bg-accent origin-left rounded-full shadow-[0_0_8px_var(--accent)]"
        transition={{ type: 'spring', damping: 20 }}
      />
    </div>
  );
});
