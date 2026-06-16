import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * High-Fidelity Burning Ember (Leading Edge)
 */
const BurningEdge = ({ isOver }) => (
  <div className="absolute right-0 top-0 bottom-0 w-4 flex items-center justify-center z-20 pointer-events-none">
    {/* Inner Hot Spot */}
    <motion.div
      animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn("w-2 h-[90%] blur-[1px]", isOver ? "bg-red-400" : "bg-red-500")}
    />
    {/* Outer Glow */}
    <motion.div
      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("absolute inset-0 w-10 h-10 blur-xl rounded-full", isOver ? "bg-red-600" : "bg-red-500")}
    />
  </div>
);

/**
 * RyoRollProgress (Minimal Realistic Hand-Rolled)
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? "w-44 h-8" : "w-32 h-6")}>
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5 rounded-full border border-white/5" />

      {/* Progress Body */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 85}%` }} // Leave space for roach
        className="h-full bg-white relative z-10 rounded-l-full"
        transition={{ type: 'spring', damping: 20 }}
      >
        {progress > 0 && <BurningEdge isOver={isOver} />}
      </motion.div>

      {/* Roach / Filter (Fixed at Right) */}
      <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-neutral-800 rounded-r-full border-l border-black/40 z-20 shadow-inner" />
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
      <div className="absolute inset-0 bg-white/5 rounded-sm" style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }} />

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 85}%` }}
        className="h-full bg-white relative z-10"
        transition={{ type: 'spring', damping: 20 }}
        style={{ clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)' }}
      >
        {progress > 0 && <BurningEdge isOver={isOver} />}
      </motion.div>

      <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-neutral-900 border-l border-white/5 z-20" style={{ clipPath: 'polygon(0% 40%, 100% 40%, 100% 60%, 0% 60%)' }} />
    </div>
  );
});

/**
 * SmokingProgress (Minimal Realistic Schachtel)
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }

  const isOver = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-start", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      {/* Cigarette Track */}
      <div className="absolute inset-0 bg-white/5 rounded-[4px] border border-white/5" />

      {/* Progress Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 75}%` }} // Space for filter
        className="h-full bg-white relative z-10 rounded-l-[4px]"
        transition={{ type: 'spring', damping: 20 }}
      >
        {progress > 0 && <BurningEdge isOver={isOver} />}
      </motion.div>

      {/* Orange Filter (Fixed at Right) */}
      <div className="absolute right-0 top-0 bottom-0 w-[25%] bg-[#f4a261] rounded-r-[4px] border-l border-black/10 z-20 flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-3 gap-[2px] opacity-20">
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
