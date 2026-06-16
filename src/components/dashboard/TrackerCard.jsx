import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../utils/utils';
import { SmokingProgress, RingProgress, GenericBarProgress, RyoRollProgress, ZigProgress, KngProgress, QnProgress } from '../gauges/Gauges';
import { UI } from '../Common';

/**
 * Performance Optimized TrackerCard
 * High-fidelity redesign with multi-layered glass and atmospheric lighting.
 */
export const TrackerCard = React.memo(({ config, count, onInc, onDec, index, globalSize = 'LARGE' }) => {
  const isLimitReached = count >= (config?.limit ?? 1);
  const isSmall = globalSize === 'SMALL';
  const isMedium = globalSize === 'MEDIUM';
  const isLarge = globalSize === 'LARGE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        UI.CARD,
        "flex flex-col relative overflow-hidden group/card",
        isLarge ? "p-10 min-h-[420px]" : (isMedium ? "p-8 min-h-[340px]" : "p-6 min-h-[240px]"),
        isLimitReached ? "border-danger/20 ring-1 ring-danger/10" : "hover:border-white/10"
      )}
    >
      {/* Background Atmosphere (Glow effect behind gauge) */}
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[80px] opacity-0 group-hover/card:opacity-20 transition-opacity duration-1000",
        isLimitReached ? "bg-danger" : "bg-accent"
      )} />

      {/* Limit Legend */}
      {!isSmall && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-4 bg-white/10" />
          <span className={cn(UI.LABEL, "m-0 opacity-40")}>
            Target: {config?.limit ?? '---'}
          </span>
          <div className="h-px w-4 bg-white/10" />
        </div>
      )}

      {/* Visualization Core */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full z-10">
        <div className={cn(
          "flex items-center justify-center w-full transition-all duration-700 will-change-transform group-hover/card:scale-105",
          isLarge ? "h-36" : (isMedium ? "h-28" : "h-20")
        )}>
          {index === 0 ? <ZigProgress count={count} limit={config.limit} size={globalSize} /> :
           index === 1 ? <KngProgress count={count} limit={config.limit} size={globalSize} /> :
           index === 2 ? <QnProgress count={count} limit={config.limit} size={globalSize} /> :
           (
             <>
               {config?.type === 'CIGARETTE' && <SmokingProgress count={count} limit={config.limit} variant="CIGARETTE" size={globalSize} />}
               {config?.type === 'RYO_ROLL' && <RyoRollProgress count={count} limit={config.limit} size={globalSize} />}
               {config?.type === 'SIMPLE' && <RingProgress count={count} limit={config.limit} size={globalSize} />}
               {config?.type === 'JOINT_KING' && <SmokingProgress count={count} limit={config.limit} variant="KING" size={globalSize} />}
               {config?.type === 'JOINT_QUEEN' && <SmokingProgress count={count} limit={config.limit} variant="QUEEN" size={globalSize} />}
               {(!['CIGARETTE', 'RYO_ROLL', 'SIMPLE', 'JOINT_KING', 'JOINT_QUEEN'].includes(config?.type)) && <GenericBarProgress count={count} limit={config?.limit} size={globalSize} />}
             </>
           )
          }
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <motion.span
            key={count}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "font-[1000] tracking-tighter tabular-nums leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]",
              isLarge ? "text-7xl" : (isMedium ? "text-6xl" : "text-5xl"),
              isLimitReached ? "text-danger" : "text-white"
            )}
          >
            {count ?? 0}
          </motion.span>
          <span className={cn(
            "font-black tracking-[0.4em] uppercase transition-colors duration-500 truncate w-full",
            isLarge ? "text-[12px] pt-2" : (isMedium ? "text-[11px]" : "text-[10px]"),
            isLimitReached ? "text-danger/60" : "text-accent/60"
          )}>
            {config?.name ?? 'Registry Unit'}
          </span>
        </div>
      </div>

      {/* Precision Controls */}
      <div className={cn(
        "flex items-center justify-between w-full border-t border-white/[0.03] z-10",
        isLarge ? "mt-10 pt-10" : (isMedium ? "mt-8 pt-8" : "mt-6 pt-6")
      )}>
        <button
          onClick={onDec}
          aria-label="Decrement"
          className={cn(
            "rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-neutral-500 transition-all duration-300 hover:text-white hover:bg-white/[0.05] hover:border-white/10 active:scale-90 focus:ring-2 focus:ring-white/10",
            isSmall ? "h-12 w-12" : "h-16 w-16"
          )}
        >
          <Minus size={isSmall ? 18 : 24} strokeWidth={3} />
        </button>
        <button
          onClick={onInc}
          aria-label="Increment"
          className={cn(
            "rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-2xl focus:ring-4",
            isSmall ? "h-12 w-12" : "h-16 w-16",
            isLimitReached
              ? "bg-danger text-zinc-950 shadow-danger/20 focus:ring-danger/20"
              : "bg-accent text-zinc-950 shadow-accent/20 focus:ring-accent/20"
          )}
        >
          <Plus size={isSmall ? 20 : 28} strokeWidth={4} />
        </button>
      </div>
    </motion.div>
  );
});
