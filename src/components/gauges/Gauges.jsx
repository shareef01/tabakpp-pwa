import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * Hyper-Realistic Burning Tip
 * Ultra-precise plasma line with soft atmospheric bloom.
 */
const BurningTip = ({ isDanger }) => (
  <div className="absolute left-[-1px] top-0 bottom-0 w-3 flex items-center justify-center z-30 pointer-events-none">
    {/* Plasma Hot-Spot */}
    <motion.div
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className={cn("w-[1.5px] h-[95%] blur-[0.3px] rounded-full shadow-[0_0_8px_var(--accent)]", isDanger ? "bg-red-400 shadow-red-500" : "bg-white shadow-accent")}
    />
    {/* Inner Combustion Glow */}
    <div className={cn("absolute inset-y-0 left-0 w-2 blur-sm rounded-l-full", isDanger ? "bg-red-600/40" : "bg-accent/40")} />
    {/* Outer Atmospheric Bloom */}
    <motion.div
      animate={{ scaleY: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("absolute -left-3 w-10 h-14 blur-xl rounded-full", isDanger ? "bg-red-600" : "bg-accent")}
    />
  </div>
);

/**
 * RyoRollProgress (Hand-Rolled Mastery)
 * Captures the organic, "perfectly imperfect" twisted cone look.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-48 h-10" : "w-36 h-8")}>
      {/* Ambient Shadow for depth */}
      <div className="absolute inset-x-2 bottom-0 h-2 bg-black/40 blur-md rounded-full translate-y-2 opacity-40" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[80%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{
            // Organic twisted cone: Wide at burning tip, thin at filter
            clipPath: 'polygon(0% 5%, 100% 20%, 100% 80%, 0% 95%)',
            background: 'linear-gradient(180deg, #f3f4f6 0%, #ffffff 40%, #f9fafb 60%, #d1d5db 100%)',
          }}
        >
          {/* Subtle Paper Texture */}
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* Dark Roach (Filter) */}
      <div
        className="w-8 h-[55%] bg-[#1a1a1a] border-l border-black/50 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 15%, 100% 30%, 100% 70%, 0% 85%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );
});

/**
 * JointProgress (King/Queen Conical Elegance)
 * Specialized cone geometry with translucent paper feel.
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? (isQueen ? "w-52 h-12" : "w-60 h-10") : (isQueen ? "w-40 h-9" : "w-48 h-8"))}>
      <div className="absolute inset-x-4 bottom-0 h-3 bg-black/50 blur-xl rounded-full translate-y-3 opacity-30" />

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
          {/* Rice Paper Grain */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]" />
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* Long Card Roach */}
      <div
        className="w-14 h-[40%] bg-neutral-900 border-l border-black/60 relative shadow-inner overflow-hidden"
        style={{ clipPath: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Schachtel Precision)
 * Cylindrical factory-standard look with refined cork filter.
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
    <div className={cn("relative flex items-center justify-end group", isLarge ? "w-56 h-11" : "w-44 h-8")}>
      {/* Soft Ground Shadow */}
      <div className="absolute inset-x-4 bottom-0 h-2 bg-black/60 blur-xl rounded-full translate-y-3 opacity-40" />

      {/* Main Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-xl"
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 40%, #f0f0f0 60%, #e0e0e0 100%)',
            borderRadius: '2px 0 0 2px'
          }}
        >
          <BurningTip isDanger={isOver} />
        </motion.div>
      </div>

      {/* Refined Cork Filter */}
      <div className="w-16 h-full bg-[#f4a261] rounded-r-[3px] border-l border-black/10 relative overflow-hidden">
        {/* Fine Cork Noise */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8b4513_0.8px,transparent_0.8px)] bg-[length:3px_3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/25" />

        {/* High-Fidelity Gold Band */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#d4af37] shadow-[1px_0_3px_rgba(0,0,0,0.2)]" />
        <div className="absolute left-[5px] top-0 bottom-0 w-[1.5px] bg-black/10" />
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
