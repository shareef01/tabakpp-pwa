import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * ZigProgress (Card 1: ZIG) - RESTORED
 * Multi-colored segmented bar mimicking a burning cigarette/joint.
 */
export const ZigProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative bg-neutral-950/80 rounded-full border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out", isLarge ? "w-48 h-5" : "w-36 h-4")}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        className="h-full flex items-center relative"
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="h-full bg-white flex-1" />
        {progress > 0 && (
          <div className="flex h-full">
            <div className="h-full w-2 bg-red-600 shadow-[0_0_15px_#dc2626] z-10" />
            <div className="h-full w-4 bg-[#f59e0b] shadow-[0_0_20px_#f59e0b] z-10" />
          </div>
        )}
      </motion.div>
    </div>
  );
});

/**
 * KngProgress (Card 2: KNG) - RESTORED
 * Grey capsule shell with a stark white inner bar and a glowing red warning ember block.
 */
export const KngProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative bg-[#262626] rounded-full border border-white/5 overflow-hidden shadow-inner transition-all duration-500 ease-out", isLarge ? "w-48 h-5" : "w-36 h-4")}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        className="h-full bg-white relative flex items-center justify-end"
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {progress > 0 && <div className="h-full w-2 bg-red-600 shadow-[0_0_15px_#dc2626] absolute -right-0" />}
      </motion.div>
    </div>
  );
});

/**
 * QnProgress (Card 3: QN) - RESTORED
 * Pure minimalist white capsule fill indicator inside the dark housing.
 */
export const QnProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative bg-neutral-950/60 rounded-full border border-white/5 overflow-hidden shadow-inner transition-all duration-500 ease-out", isLarge ? "w-48 h-5" : "w-36 h-4")}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
});

/**
 * RyoRollProgress (Card 1: ZIG Style Alias)
 */
export const RyoRollProgress = React.memo(({ count, limit, size }) => (
  <ZigProgress count={count} limit={limit} size={size} />
));

/**
 * JointProgress (Master Conical / KNG & QN Style Switch)
 */
const JointProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'QUEEN') return <QnProgress count={count} limit={limit} size={size} />;
  return <KngProgress count={count} limit={limit} size={size} />;
});

/**
 * SmokingProgress (Master Schachtel / ZIG Style Alias)
 */
export const SmokingProgress = React.memo(({ count, limit, variant, size }) => {
  if (variant === 'KING' || variant === 'QUEEN') {
    return <JointProgress count={count} limit={limit} variant={variant} size={size} />;
  }
  return <ZigProgress count={count} limit={limit} size={size} />;
});

/**
 * RingProgress - Performance Updated
 */
export const RingProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const radius = 30;
  const circum = 2 * Math.PI * radius;
  const isLarge = size === 'LARGE';

  return (
    <div className={cn("relative flex items-center justify-center transition-all duration-500 ease-out", isLarge ? "w-28 h-28" : "w-20 h-20")}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-white/5" strokeWidth="8" />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          className="fill-none stroke-accent drop-shadow-[0_0_10px_var(--accent)]"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circum, strokeDashoffset: circum }}
          animate={{ strokeDashoffset: circum - (progress * circum) }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_12px_var(--accent)]" />
      </div>
    </div>
  );
});

/**
 * GenericBarProgress - Performance Updated
 */
export const GenericBarProgress = React.memo(({ count, limit, size }) => {
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  return (
    <div className={cn("w-full bg-neutral-800/40 rounded-full border border-white/5 overflow-hidden p-0.5 shadow-inner transition-all duration-500 ease-out", isLarge ? "max-w-[200px] h-5" : "max-w-[160px] h-3.5")}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className="h-full bg-accent origin-left rounded-full shadow-[0_0_8px_var(--accent)]"
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
});
