import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Cinematic Ember Component
 * Shared logic for the glowing burning tip.
 */
const EmberGlow = ({ accent }) => (
  <div className="absolute left-0 top-0 bottom-0 w-4 flex items-center justify-center z-20">
    {/* Inner Core */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-1.5 h-[80%] rounded-full bg-white blur-[1px]"
    />
    {/* Primary Accent Glow */}
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
      className="absolute inset-0 bg-accent rounded-full blur-md"
    />
    {/* External Bloom */}
    <div className="absolute -left-4 w-12 h-12 bg-accent opacity-10 blur-xl rounded-full" />
  </div>
);

/**
 * RyoRollProgress (Hand-Rolled)
 * Natural organic silhouette with subtle taper.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-52 h-12" : "w-40 h-10")}>
      {/* Gauge Shadow (Depth) */}
      <div className="absolute inset-x-2 bottom-0 h-2 bg-black/40 blur-lg rounded-full translate-y-2 opacity-50" />

      {/* RYO Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          style={{
            clipPath: 'polygon(0% 5%, 100% 15%, 100% 85%, 0% 95%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 40%, #f3f4f6 60%, #e5e7eb 100%)',
            boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.1)'
          }}
        >
          {/* Paper Grain */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

          {remaining > 0 && <EmberGlow />}
        </motion.div>
      </div>

      {/* Integrated RYO Filter */}
      <div
        className="w-10 h-[65%] bg-[#222222] border-l border-black/30 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 15%, 100% 25%, 100% 75%, 0% 85%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Pre-rolled Schachtel)
 * High-fidelity cylindrical geometry with realistic filter.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  const colors = {
    CIGARETTE: 'bg-white',
    KING: 'bg-gradient-to-l from-white to-neutral-50',
    QUEEN: 'bg-gradient-to-l from-white to-neutral-100'
  };

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-64 h-14" : "w-48 h-10")}>
      {/* Gauge Shadow */}
      <div className="absolute inset-x-4 bottom-0 h-3 bg-black/50 blur-xl rounded-full translate-y-3 opacity-40" />

      {/* Cigarette Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className={cn("h-full relative origin-right will-change-[width] shadow-2xl", colors[variant] || colors.CIGARETTE)}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 45%, #f7f7f7 55%, #ececec 100%)',
            borderRadius: '4px 0 0 4px'
          }}
        >
          {remaining > 0 && <EmberGlow />}
        </motion.div>
      </div>

      {/* Realistic Cork Filter */}
      <div className="w-16 h-full bg-[#f4a261] rounded-r-[6px] shadow-inner border-l border-black/20 relative overflow-hidden flex items-center justify-center">
        {/* Cork Texture Pattern */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#8b4513_1px,transparent_1px)] bg-[length:3px_3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20" />

        {/* Brand Line (Subtle Detail) */}
        <div className="w-1 h-full bg-black/10 absolute left-2" />
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
