import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../utils/utils';
import { SmokingProgress, RingProgress, GenericBarProgress } from '../gauges/Gauges';
import { UI } from '../Common';

/**
 * Performance Optimized TrackerCard
 * Redesigned for clean lines, perfect grid alignment, and accessibility.
 */
export const TrackerCard = React.memo(({ config, count, onInc, onDec, index, globalSize = 'LARGE' }) => {
  const isLimitReached = count >= (config?.limit ?? 1);
  const isSmall = globalSize === 'SMALL';
  const isMedium = globalSize === 'MEDIUM';
  const isLarge = globalSize === 'LARGE';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
      className={cn(
        UI.CARD,
        "flex flex-col",
        isLarge ? "p-8 min-h-[380px]" : (isMedium ? "p-6 min-h-[320px]" : "p-4 min-h-[220px]"),
        isLimitReached ? "border-danger/30 ring-1 ring-danger/20 shadow-danger/5" : "hover:border-white/10"
      )}
    >
      {/* Limit Label - Strategic Positioning */}
      {!isSmall && (
        <span className={cn(
          UI.LABEL,
          "mb-4 text-center w-full block opacity-60",
          isLarge ? "text-[10px]" : "text-[9px]"
        )}>
          Limit: {config?.limit ?? '---'}
        </span>
      )}

      {/* Visual Gauge - Primary Focal Point */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
        <div className={cn(
          "flex items-center justify-center w-full transition-transform duration-700",
          isLarge ? "h-32" : (isMedium ? "h-24" : "h-16")
        )}>
          {config?.type === 'CIGARETTE' && <SmokingProgress count={count} limit={config.limit} variant="CIGARETTE" size={globalSize} />}
          {config?.type === 'SIMPLE' && <RingProgress count={count} limit={config.limit} size={globalSize} />}
          {config?.type === 'JOINT_KING' && <SmokingProgress count={count} limit={config.limit} variant="KING" size={globalSize} />}
          {config?.type === 'JOINT_QUEEN' && <SmokingProgress count={count} limit={config.limit} variant="QUEEN" size={globalSize} />}
          {(!['CIGARETTE', 'SIMPLE', 'JOINT_KING', 'JOINT_QUEEN'].includes(config?.type)) && <GenericBarProgress count={count} limit={config?.limit} size={globalSize} />}
        </div>

        <div className="flex flex-col items-center text-center space-y-1">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "font-[1000] tracking-tighter tabular-nums leading-none",
              isLarge ? "text-6xl" : (isMedium ? "text-5xl" : "text-4xl"),
              isLimitReached ? "text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "text-white"
            )}
          >
            {count ?? 0}
          </motion.span>
          <span className={cn(
            "font-black tracking-[0.25em] uppercase transition-colors duration-500 truncate w-full",
            isLarge ? "text-[12px] pt-2" : (isMedium ? "text-[10px] pt-1" : "text-[9px] pt-1"),
            isLimitReached ? "text-danger/80" : "text-accent opacity-70"
          )}>
            {config?.name ?? 'Protocol'}
          </span>
        </div>
      </div>

      {/* Action Controls - High Contrast & Touch-Friendly */}
      <div className={cn(
        "flex items-center justify-between w-full border-t border-white/5",
        isLarge ? "mt-8 pt-8" : (isMedium ? "mt-6 pt-6" : "mt-4 pt-4")
      )}>
        <button
          onClick={onDec}
          aria-label="Decrement"
          className={cn(
            "rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 transition-all hover:text-white hover:bg-white/10 active:scale-90 focus:ring-2 focus:ring-white/20",
            isSmall ? "h-11 w-11" : "h-14 w-14"
          )}
        >
          <Minus size={isSmall ? 18 : 22} strokeWidth={3} />
        </button>
        <button
          onClick={onInc}
          aria-label="Increment"
          className={cn(
            "rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-2xl focus:ring-4",
            isSmall ? "h-11 w-11" : "h-14 w-14",
            isLimitReached
              ? "bg-danger text-zinc-950 shadow-danger/20 focus:ring-danger/20"
              : "bg-accent text-zinc-950 shadow-accent/20 focus:ring-accent/20"
          )}
        >
          <Plus size={isSmall ? 20 : 24} strokeWidth={4} />
        </button>
      </div>
    </motion.div>
  );
});
