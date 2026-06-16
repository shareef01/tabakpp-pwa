import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * High-Fidelity Combustion Core
 * Realistic intense heat point with atmospheric diffusion.
 */
const CombustionCore = ({ isDanger }) => (
  <div className="absolute left-[-2px] inset-y-0 w-2 flex items-center justify-center z-40 pointer-events-none">
    {/* Intense Ignition Point */}
    <motion.div
      animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className={cn("w-[2.5px] h-[92%] rounded-full blur-[0.4px]", isDanger ? "bg-red-300 shadow-[0_0_8px_#f87171]" : "bg-white shadow-[0_0_10px_var(--accent)]")}
    />
    {/* Atmospheric Bloom */}
    <motion.div
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className={cn("absolute -left-6 w-16 h-20 blur-2xl rounded-full", isDanger ? "bg-red-600" : "bg-accent")}
    />
  </div>
);

/**
 * 3D Texture Overlays
 */
const PaperTexture = () => <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pulp.png')] pointer-events-none" />;
const JointTexture = () => <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] pointer-events-none" />;

/**
 * RyoRollProgress (Organic Hand-Rolled)
 * Sophisticated "Cone-Cylinder" hybrid with manual fold geometry.
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-48 h-10" : "w-36 h-7")}>
      {/* Ground Shadow */}
      <div className="absolute inset-x-4 bottom-[-6px] h-2 bg-black/60 blur-lg rounded-full opacity-30" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-[80%] relative origin-right will-change-[width]"
          transition={{ type: 'spring', damping: 28, stiffness: 140 }}
          style={{
            clipPath: 'polygon(0% 2%, 100% 12%, 100% 88%, 0% 98%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 35%, #e5e7eb 65%, #cbd5e1 100%)',
          }}
        >
          <PaperTexture />
          <CombustionCore isDanger={isOver} />
        </motion.div>
      </div>

      {/* RYO Integrated Roach */}
      <div
        className="w-10 h-[58%] bg-[#121212] border-l border-black/40 relative shadow-inner"
        style={{ clipPath: 'polygon(0% 12%, 100% 28%, 100% 72%, 0% 88%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
      </div>
    </div>
  );
});

/**
 * JointProgress (King/Queen Conical Elegance)
 * Professional cone silhouette with translucent paper feel.
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  const isOver = count >= limit;
  const progress = Math.min(0.92, count / (limit || 1));
  const remaining = 1 - progress;
  const isLarge = size === 'LARGE';
  const isQueen = variant === 'QUEEN';

  return (
    <div className={cn("relative flex items-center justify-end group", isLarge ? (isQueen ? "w-52 h-11" : "w-64 h-9") : (isQueen ? "w-36 h-8" : "w-44 h-7"))}>
      <div className="absolute inset-x-6 bottom-[-8px] h-2.5 bg-black/70 blur-xl rounded-full opacity-25" />

      <div className="flex-1 h-full flex items-center justify-end relative overflow-visible">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right"
          transition={{ type: 'spring', damping: 28, stiffness: 140 }}
          style={{
            clipPath: 'polygon(0% 0%, 100% 32%, 100% 68%, 0% 100%)',
            background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 40%, #eeeeee 60%, #cccccc 100%)',
          }}
        >
          <JointTexture />
          <CombustionCore isDanger={isOver} />
        </motion.div>
      </div>

      {/* Card Roach (Filter) */}
      <div
        className="w-16 h-[36%] bg-[#0a0a0a] border-l border-black/50 relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
        style={{ clipPath: 'polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
});

/**
 * SmokingProgress (Factory Standard)
 * Ultra-realistic cylinder with Marlboro-inspired matte filter.
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
    <div className={cn("relative flex items-center justify-end", isLarge ? "w-60 h-10" : "w-48 h-8")}>
      <div className="absolute inset-x-6 bottom-[-10px] h-3 bg-black/80 blur-2xl rounded-full opacity-40" />

      {/* Factory Cylinder Body */}
      <div className="flex-1 h-full flex items-center justify-end relative">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${remaining * 100}%` }}
          className="h-full relative origin-right will-change-[width] shadow-2xl"
          transition={{ type: 'spring', damping: 28, stiffness: 140 }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 42%, #f1f1f1 58%, #e0e0e0 100%)',
            borderRadius: '1.5px 0 0 1.5px'
          }}
        >
          <CombustionCore isDanger={isOver} />
        </motion.div>
      </div>

      {/* Refined "Cork-Matte" Filter */}
      <div className="w-18 h-full bg-[#f2a154] rounded-r-[3px] border-l border-black/10 relative overflow-hidden">
        {/* Organic Noise Gradient */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8b4513_0.5px,transparent_0.5px)] bg-[length:2.5px_2.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/30" />

        {/* Luxury Gold/Silver Separator Band */}
        <div className="absolute left-0 inset-y-0 w-[4.5px] bg-gradient-to-r from-[#d4af37] via-[#f5e050] to-[#c5a028] shadow-[1px_0_4px_rgba(0,0,0,0.3)] z-10" />
        {/* Fine Detail Line */}
        <div className="absolute left-[6px] inset-y-0 w-[1px] bg-black/15 z-10" />
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
