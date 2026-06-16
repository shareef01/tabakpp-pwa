import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * High-Fidelity Burning Tip
 * Ultra-thin plasma line with atmospheric bloom.
 */
const BurningTip = ({ isDanger }) => (
  <div className="absolute left-[-2px] top-0 bottom-0 w-4 flex items-center justify-center z-30">
    {/* Plasma Core */}
    <motion.div
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={cn("w-[2px] h-[90%] blur-[0.5px] rounded-full", isDanger ? "bg-red-400" : "bg-white")}
    />
    {/* Inner Glow */}
    <div className={cn("absolute inset-0 w-3 h-full blur-sm rounded-full", isDanger ? "bg-red-600/60" : "bg-accent/60")} />
    {/* Outer Atmosphere */}
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("absolute -left-4 w-12 h-12 blur-xl rounded-full", isDanger ? "bg-red-600" : "bg-accent")}
    />
  </div>
);

/**
 * RyoRollProgress (Hand-Rolled)
 * Organic, slightly irregular silhouette for manually rolled tobacco.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-44 h-9" : "w-36 h-7")}>
      {/* Gauge Ambient Shadow */}
      <div className="absolute inset-x-2 bottom-0 h-2 bg-black/40 blur-lg rounded-full translate-y-2 opacity-50" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[85%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            clipPath: 'polygon(0% 12%, 100% 22%, 100% 78%, 0% 88%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 45%, #e5e7eb 55%, #d1d5db 100%)',
          }}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* RYO Tapered Tip */}
      <div
        className="w-10 h-[65%] bg-neutral-800 border-l border-black/40 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 20%, 100% 35%, 100% 65%, 0% 80%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );
});

/**
 * JointProgress (Conical Design)
 * Sleek, long conical geometry for King and Queen variants.
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? (isQueen ? "w-48 h-12" : "w-56 h-10") : (isQueen ? "w-36 h-9" : "w-44 h-8"))}>
      {/* Gauge Shadow */}
      <div className="absolute inset-x-4 bottom-0 h-3 bg-black/50 blur-xl rounded-full translate-y-3 opacity-40" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            // Conical perspective: Wide at burning tip, thin at roach
            clipPath: 'polygon(0% 0%, 100% 30%, 100% 70%, 0% 100%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 45%, #f4f4f4 55%, #e0e0e0 100%)',
          }}
        >
          {/* Subtle translucent wrap effect */}
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* Tapered Roach (Filter) */}
      <div
        className="w-12 h-[40%] bg-neutral-900 border-l border-black/50 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Factory-Made Cigarette)
 * Classic cylindrical architecture with cork filter.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  // Delegate Joints to specialized component
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }

  const isOver = count >= limit;
  const progress = Math.min(0.88, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-56 h-12" : "w-44 h-9")}>
      <div className="absolute inset-x-4 bottom-0 h-3 bg-black/50 blur-xl rounded-full translate-y-3 opacity-40" />

      {/* Cigarette Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-2xl"
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 45%, #f7f7f7 55%, #eeeeee 100%)',
            borderRadius: '2px 0 0 2px'
          }}
        >
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* Realistic Cork Filter */}
      <div className="w-16 h-full bg-[#f4a261] rounded-r-[4px] border-l border-black/20 relative overflow-hidden">
        {/* Cork Pattern */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#8b4513_1px,transparent_1px)] bg-[length:3.5px_3.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/25" />
        {/* Detail brand line */}
        <div className="absolute left-2 top-0 bottom-0 w-[1.5px] bg-black/10" />
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
