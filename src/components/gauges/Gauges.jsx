import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Cinematic Burning Edge
 * Ultra-narrow intense glow representing the active burn line.
 */
const EmberGlow = ({ isDanger }) => (
  <div className="absolute left-[-2px] top-0 bottom-0 w-3 flex items-center justify-center z-30">
    {/* Plasma Core */}
    <motion.div
      animate={{
        scaleX: [1, 1.3, 1],
        opacity: [0.9, 1, 0.9]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn(
        "w-[3px] h-full blur-[0.5px]",
        isDanger ? "bg-red-400" : "bg-white"
      )}
    />
    {/* Atmospheric Bloom */}
    <motion.div
      animate={{
        scale: [1, 1.4, 1],
        opacity: [0.4, 0.7, 0.4]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "absolute inset-0 w-6 h-12 rounded-full blur-lg",
        isDanger ? "bg-red-600" : "bg-accent"
      )}
    />
  </div>
);

/**
 * RyoRollProgress (Hand-Rolled Mastery)
 * Captures the organic, "perfectly imperfect" look of a rolled cigarette.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  // Ensure a small "stub" always remains for visual identity
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-44 h-10" : "w-36 h-8")}>
      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[80%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            clipPath: 'polygon(0% 10%, 100% 20%, 100% 80%, 0% 90%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 40%, #e5e7eb 100%)',
          }}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <EmberGlow isDanger={isOver} />
        </motion.div>
      </div>

      {/* RYO Filter / Twisted Tip */}
      <div
        className="w-8 h-[60%] bg-[#1a1a1a] border-l border-black/40 relative shadow-inner"
        style={{ clipPath: 'polygon(0% 20%, 100% 35%, 100% 65%, 0% 80%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Schachtel Precision)
 * Realistic cylindrical geometry with stub-persistence logic.
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  // Never let the cigarette vanish completely; maintain a 15% stub identity
  const progress = Math.min(0.85, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-56 h-12" : "w-44 h-9")}>
      {/* Dynamic Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-2xl"
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f9f9f9 45%, #f0f0f0 55%, #e0e0e0 100%)',
            borderRadius: '2px 0 0 2px'
          }}
        >
          <EmberGlow isDanger={isOver} />
        </motion.div>
      </div>

      {/* Cork Filter Architecture */}
      <div className="w-14 h-full bg-[#f4a261] rounded-r-[4px] border-l border-black/20 relative overflow-hidden">
        {/* Fine Grain Filter Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8b4513_1px,transparent_1px)] bg-[length:3px_3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/20" />
        {/* Professional Brand Line */}
        <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black/10" />
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
          transition={{ duration: 1, ease: "easeOut" }}
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
