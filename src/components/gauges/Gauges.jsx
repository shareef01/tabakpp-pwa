import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Hyper-Fidelity Burning Ember
 * Intense core with atmospheric diffusion and accent color sync.
 */
const BurningEmber = ({ isOver }) => (
  <div className="absolute left-[-2px] inset-y-0 w-3 flex items-center justify-center z-40 pointer-events-none">
    {/* Intense Core */}
    <motion.div
      animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.1, 0.95] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={cn(
        "w-[2px] h-[92%] rounded-full blur-[0.4px] shadow-lg",
        isOver ? "bg-red-400 shadow-red-500" : "bg-white shadow-accent"
      )}
    />
    {/* Thermal Bloom */}
    <motion.div
      animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "absolute -left-5 w-14 h-20 blur-2xl rounded-full",
        isOver ? "bg-red-600" : "bg-accent"
      )}
    />
  </div>
);

/**
 * RyoRollProgress (Hand-Rolled Mastery)
 * Captures the organic, hand-twisted look of rolled tobacco.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      {/* Ground Shadow */}
      <div className="absolute inset-x-4 bottom-[-8px] h-2.5 bg-black/60 blur-xl rounded-full opacity-30" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[82%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 140 }}
          style={{
            clipPath: 'polygon(0% 4%, 100% 18%, 100% 82%, 0% 96%)',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f1f5f9 60%, #cbd5e1 100%)',
          }}
        >
          {/* Paper Grain */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <BurningEmber isOver={isOver} />
        </motion.div>
      </div>

      {/* RYO Dark Roach */}
      <div
        className="w-10 h-[55%] bg-[#1a1a1a] border-l border-black/50 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 18%, 100% 32%, 100% 68%, 0% 82%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );
});

/**
 * JointProgress (King/Queen Conical Elegance)
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? (isQueen ? "w-52 h-11" : "w-64 h-9") : (isQueen ? "w-36 h-8" : "w-44 h-7"))}>
      <div className="absolute inset-x-6 bottom-[-10px] h-3 bg-black/70 blur-2xl rounded-full opacity-25" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right"
          transition={{ type: 'spring', damping: 25, stiffness: 140 }}
          style={{
            clipPath: 'polygon(0% 0%, 100% 35%, 100% 65%, 0% 100%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 40%, #f3f4f6 60%, #cccccc 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
          <BurningEmber isOver={isOver} />
        </motion.div>
      </div>

      {/* Tapered Card Roach */}
      <div
        className="w-16 h-[32%] bg-[#080808] border-l border-black/60 relative shadow-inner"
        style={{ clipPath: 'polygon(0% 0%, 100% 12%, 100% 88%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Factory Precision)
 * Cylindrical architecture with realistic cork filter.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }

  const isOver = count >= limit;
  // Stub persistence: never let the gauge vanish
  const progress = Math.min(0.85, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-60 h-10" : "w-48 h-8")}>
      <div className="absolute inset-x-6 bottom-[-10px] h-3 bg-black/80 blur-2xl rounded-full opacity-40" />

      {/* Main Cylinder */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-xl"
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 42%, #f1f1f1 58%, #e2e8f0 100%)',
            borderRadius: '1px 0 0 1.5px'
          }}
        >
          <BurningEmber isOver={isOver} />
        </motion.div>
      </div>

      {/* Cork Filter */}
      <div className="w-18 h-full bg-[#f2a154] rounded-r-[3px] border-l border-black/10 relative overflow-hidden shadow-inner">
        {/* Fine Cork Noise */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8b4513_0.5px,transparent_0.5px)] bg-[length:3px_3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30" />

        {/* Gold Luxury Band */}
        <div className="absolute left-0 inset-y-0 w-[4px] bg-gradient-to-r from-[#d4af37] via-[#f9e875] to-[#c5a028] shadow-[1px_0_3px_rgba(0,0,0,0.3)] z-10" />
        <div className="absolute left-[5.5px] inset-y-0 w-[1px] bg-black/15 z-10" />
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
