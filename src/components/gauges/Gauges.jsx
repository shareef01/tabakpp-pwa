import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * High-Fidelity Burning Tip (Yesterday's Master)
 * Vibrant atmospheric glow synced to the user's accent color.
 */
const BurningTip = ({ isDanger }) => (
  <div className="absolute left-[-4px] top-0 bottom-0 w-4 flex items-center justify-center z-30 pointer-events-none">
    {/* Plasma Hotspot */}
    <motion.div
      animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn("w-[3px] h-full blur-[0.6px] rounded-full shadow-lg", isDanger ? "bg-red-400 shadow-red-500" : "bg-white shadow-accent")}
    />
    {/* Atmosphere Bloom */}
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      className={cn("absolute inset-0 w-10 h-14 blur-xl rounded-full", isDanger ? "bg-red-600" : "bg-accent")}
    />
  </div>
);

/**
 * RyoRollProgress (Yesterday's Organic Hand-Rolled)
 * Natural organic taper with high-fidelity burn-down logic.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      <div className="absolute inset-x-2 bottom-[-6px] h-2 bg-black/40 blur-lg rounded-full translate-y-2 opacity-50" />
      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[80%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            clipPath: 'polygon(0% 5%, 100% 15%, 100% 85%, 0% 95%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 40%, #f3f4f6 60%, #e5e7eb 100%)',
          }}
        >
          {remaining > 0 && <BurningTip isDanger={isOver} />}
        </motion.div>
      </div>
      <div
        className="w-10 h-[65%] bg-neutral-800 border-l border-black/30 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 15%, 100% 25%, 100% 75%, 0% 85%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      </div>
    </div>
  );
});

/**
 * JointProgress (Yesterday's Conical Joint)
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? (isQueen ? "w-44 h-12" : "w-56 h-10") : (isQueen ? "w-32 h-9" : "w-40 h-8"))}>
      <div className="absolute inset-x-4 bottom-[-8px] h-2.5 bg-black/50 blur-xl rounded-full translate-y-3 opacity-40" />
      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            clipPath: 'polygon(0% 0%, 100% 30%, 100% 70%, 0% 100%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 45%, #eeeeee 55%, #cccccc 100%)',
          }}
        >
          {remaining > 0 && <BurningTip isDanger={isOver} />}
        </motion.div>
      </div>
      <div
        className="w-12 h-[35%] bg-neutral-900 border-l border-black/50 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Yesterday's Realistic Schachtel)
 * High-fidelity cylinder with classic orange filter.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }

  const isOver = count >= limit;
  const progress = Math.min(0.85, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-60 h-10" : "w-44 h-8")}>
      <div className="absolute inset-x-4 bottom-[-10px] h-3 bg-black/60 blur-2xl rounded-full translate-y-3 opacity-40" />
      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-2xl bg-white"
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 45%, #f7f7f7 55%, #ececec 100%)',
            borderRadius: '2px 0 0 2px'
          }}
        >
          {remaining > 0 && <BurningTip isDanger={isOver} />}
        </motion.div>
      </div>
      <div className="w-16 h-full bg-[#f4a261] rounded-r-[4px] shadow-inner border-l border-black/20 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#8b4513_1px,transparent_1px)] bg-[length:3px_3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20" />
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
    <div className={cn("relative flex items-center justify-center", isLarge ? "w-32 h-32" : "w-20 h-20")}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-white/5" strokeWidth="8" />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          className="fill-none stroke-accent drop-shadow-[0_0_12px_var(--accent)]"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circum, strokeDashoffset: circum }}
          animate={{ strokeDashoffset: circum - (progress * circum) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_var(--accent)]" />
      </div>
    </div>
  );
});

export const GenericBarProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  return (
    <div className={cn("w-full bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden p-0.5", isLarge ? "max-w-[240px] h-6" : "max-w-[180px] h-4")}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className="h-full bg-accent origin-left rounded-full shadow-[0_0_10px_var(--accent)]"
        transition={{ type: 'spring', damping: 20 }}
      />
    </div>
  );
});
