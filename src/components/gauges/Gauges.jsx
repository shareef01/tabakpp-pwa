import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/utils';

/**
 * RESPONSIVE GAUGE ARCHITECTURE
 * Implements a dynamic dimension matrix to ensure visual expansion across widget sizes.
 */

const GaugeTrack = ({ children, size, isLimitReached }) => {
  const isLarge = size === 'LARGE';
  const isMedium = size === 'MEDIUM';

  return (
    <div className={cn(
      "relative bg-neutral-900 rounded-full overflow-hidden transition-all duration-700 flex items-center border-2",
      // Task: Aggressive expansion for larger widgets
      isLarge ? "w-64 h-12" : (isMedium ? "w-48 h-8" : "w-32 h-5"),
      isLimitReached
        ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] border-red-400"
        : "border-white/10 shadow-inner bg-black/40"
    )}>
      {children}
    </div>
  );
};

const GaugeTrackGirthy = ({ children, size, isLimitReached }) => {
  const isLarge = size === 'LARGE';
  const isMedium = size === 'MEDIUM';

  return (
    <div className={cn(
      "relative bg-neutral-900 rounded-full overflow-hidden transition-all duration-700 flex items-center border-2",
      // Task: Joints are girthier and longer
      isLarge ? "w-72 h-16" : (isMedium ? "w-56 h-12" : "w-40 h-8"),
      isLimitReached
        ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] border-red-400"
        : "border-white/10 shadow-inner bg-black/40"
    )}>
      {children}
    </div>
  );
};

export const ZigProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const burnedPercent = progress * 100;
  const isLarge = size === 'LARGE';

  return (
    <GaugeTrack size={size} isLimitReached={isLimitReached}>
      {!isLimitReached ? (
        <>
          <div
            className="h-full bg-neutral-800 transition-all duration-500 ease-out relative flex items-center justify-end border-r border-black/40"
            style={{ width: `${burnedPercent}%` }}
          >
            {count > 0 && (
              <div className="absolute -right-1 h-full w-3 bg-gradient-to-r from-rose-500 to-orange-500 shadow-[0_0_20px_#f43f5e] z-10" />
            )}
          </div>
          <div className="h-full bg-white flex-1 transition-all duration-500 ease-out shadow-[inset_-4px_0_10px_rgba(0,0,0,0.1)]" />
          <div className={cn("h-full bg-[#f4a261] border-l-2 border-black/20 z-20 shadow-[inset_4px_0_8px_rgba(0,0,0,0.2)]", isLarge ? "w-16" : "w-12")} />
        </>
      ) : (
        <div className="w-full h-full bg-red-400 animate-pulse" />
      )}
    </GaugeTrack>
  );
});

export const RyoRollProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const burnedPercent = progress * 100;
  const isLarge = size === 'LARGE';

  return (
    <GaugeTrack size={size} isLimitReached={isLimitReached}>
      {!isLimitReached ? (
        <>
          <div
            className="h-full bg-neutral-800 transition-all duration-500 ease-out relative flex items-center justify-end border-r border-black/40"
            style={{ width: `${burnedPercent}%` }}
          >
            {count > 0 && (
              <div className="absolute -right-1 h-full w-3 bg-gradient-to-r from-rose-500 to-orange-500 shadow-[0_0_20px_#f43f5e] z-10" />
            )}
          </div>
          <div className="h-full bg-white flex-1 transition-all duration-500 ease-out shadow-[inset_-4px_0_10px_rgba(0,0,0,0.1)]" />
          <div className={cn(
            "h-full bg-white border-l-2 border-black/10 z-20 transition-all duration-500",
            "shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_4px_-4px_8px_rgba(0,0,0,0.15)]",
            isLarge ? "w-16" : "w-12"
          )} />
        </>
      ) : (
        <div className="w-full h-full bg-red-400 animate-pulse" />
      )}
    </GaugeTrack>
  );
});

export const KngProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const burnedPercent = progress * 100;
  const isLarge = size === 'LARGE';

  return (
    <GaugeTrackGirthy size={size} isLimitReached={isLimitReached}>
      {!isLimitReached ? (
        <>
          <div
            className="h-full bg-neutral-800 transition-all duration-500 ease-out relative flex items-center justify-end border-r border-black/40"
            style={{ width: `${burnedPercent}%` }}
          >
            {count > 0 && (
              <div className="absolute -right-1 h-full w-2 bg-rose-600 shadow-[0_0_20px_#e11d48] z-10" />
            )}
          </div>
          <div className="h-full bg-[#e8f5e9] flex-1 transition-all duration-500 ease-out shadow-[inset_-4px_0_10px_rgba(0,0,0,0.05)]" />
          <div className={cn("h-full bg-[#262626] border-l-2 border-white/5 shadow-[inset_4px_0_8px_rgba(0,0,0,0.3)]", isLarge ? "w-16" : "w-14")} />
        </>
      ) : (
        <div className="w-full h-full bg-red-500 animate-pulse" />
      )}
    </GaugeTrackGirthy>
  );
});

export const QnProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const burnedPercent = progress * 100;
  const isLarge = size === 'LARGE';

  return (
    <GaugeTrackGirthy size={size} isLimitReached={isLimitReached}>
      {!isLimitReached ? (
        <>
          <div
            className="h-full bg-neutral-800 transition-all duration-500 ease-out relative flex items-center justify-end border-r border-black/40"
            style={{ width: `${burnedPercent}%` }}
          >
            {count > 0 && (
              <div className="absolute -right-1 h-full w-2 bg-rose-600 shadow-[0_0_20px_#e11d48] z-10" />
            )}
          </div>
          <div className="h-full bg-[#e8f5e9] flex-1 transition-all duration-500 ease-out shadow-[inset_-4px_0_10px_rgba(0,0,0,0.1)]" />
          <div className={cn("h-full bg-[#d7ccc8] border-l-2 border-black/10 z-20 shadow-[inset_4px_0_8px_rgba(0,0,0,0.2)]", isLarge ? "w-20" : "w-16")} />
        </>
      ) : (
        <div className="w-full h-full bg-red-500 animate-pulse rounded-full" />
      )}
    </GaugeTrackGirthy>
  );
});

/**
 * SmokingProgress Router
 * Corrected to handle variants (KNG/QN) while scaling.
 */
export const SmokingProgress = React.memo(({ count = 0, limit = 1, variant, size }) => {
  if (variant === 'KING') return <KngProgress count={count} limit={limit} size={size} />;
  if (variant === 'QUEEN') return <QnProgress count={count} limit={limit} size={size} />;
  return <ZigProgress count={count} limit={limit} size={size} />;
});

export const RingProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const radius = size === 'LARGE' ? 40 : (size === 'MEDIUM' ? 30 : 20);
  const circum = 2 * Math.PI * radius;
  const isLarge = size === 'LARGE';
  const isMedium = size === 'MEDIUM';

  return (
    <div className={cn(
      "relative flex items-center justify-center transition-all duration-500 ease-out",
      isLarge ? "w-32 h-32" : (isMedium ? "w-24 h-24" : "w-16 h-16")
    )}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-white/5" strokeWidth={isLarge ? "10" : "8"} />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          className={cn("fill-none transition-colors duration-500", isLimitReached ? "stroke-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "stroke-accent drop-shadow-[0_0_15px_var(--accent)]")}
          strokeWidth={isLarge ? "10" : "8"}
          strokeLinecap="round"
          initial={{ strokeDasharray: circum, strokeDashoffset: circum }}
          animate={{ strokeDashoffset: circum - (progress * circum) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "rounded-full animate-pulse transition-colors duration-500",
          isLarge ? "w-4 h-4" : "w-3 h-3",
          isLimitReached ? "bg-red-500 shadow-[0_0_15px_#ef4444]" : "bg-accent shadow-[0_0_15px_var(--accent)]"
        )} />
      </div>
    </div>
  );
});

export const GenericBarProgress = React.memo(({ count = 0, limit = 1, size }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const isLarge = size === 'LARGE';
  const isMedium = size === 'MEDIUM';

  return (
    <div className={cn(
      "bg-neutral-900/40 rounded-full border-2 transition-all duration-500 overflow-hidden p-1 shadow-inner",
      isLarge ? "w-64 h-8" : (isMedium ? "w-48 h-6" : "w-32 h-4"),
      isLimitReached ? "bg-red-900/40 border-red-500/50" : "border-white/10"
    )}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        className={cn("h-full origin-left rounded-full transition-colors duration-500", isLimitReached ? "bg-red-500 shadow-[0_0_12px_#ef4444]" : "bg-accent shadow-[0_0_12px_var(--accent)]")}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
});
