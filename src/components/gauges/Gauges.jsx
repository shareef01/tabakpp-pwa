import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * RyoRollProgress (Hand-Rolled / Tabak Beutel)
 * Specialized geometry for organic, tapered "RYO" cigarettes.
 * Shortens from the wide 'tip' towards the thin 'filter'.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-44 h-10" : "w-36 h-8")}>
      {/* Organic RYO Body (Tapered) */}
      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative overflow-visible"
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          style={{
            // Perspective Taper: Wide on the left (burning tip), thinner on the right (filter)
            clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)'
          }}
        >
          {/* Paper Texture Overlay (Subtle wrinkles) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pulp.png')] mix-blend-multiply" />

          {/* High-Fidelity Active Ember Glow */}
          {remaining > 0 && (
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 15px var(--accent)',
                  '0 0 25px var(--accent)',
                  '0 0 15px var(--accent)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute left-0 top-0 bottom-0 w-3 bg-accent z-10"
              style={{
                clipPath: 'polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)'
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Tapered RYO Filter (Thinner than body) */}
      <div
        className="w-8 h-[70%] bg-neutral-600/40 border-l border-black/20 relative"
        style={{ clipPath: 'polygon(0% 20%, 100% 30%, 100% 70%, 0% 80%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Factory-Made Schachtel)
 * Standard uniform cylinder geometry.
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
      {/* Cigarette Body */}
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

      {/* Standard Filter */}
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
