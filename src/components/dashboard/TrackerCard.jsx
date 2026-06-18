import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../utils/utils';
import { SmokingProgress, RingProgress, GenericBarProgress, RyoRollProgress, ZigProgress, KngProgress, QnProgress } from '../gauges/Gauges';
import { UI } from '../Common';

/**
 * REFINED INSTRUMENT TRACKER CARD
 * Features dynamic visualization scaling to expand with widget size.
 */
export const TrackerCard = React.memo(({ config, count = 0, onInc, onDec, index, globalSize = 'MEDIUM' }) => {
  const isLimitReached = count >= (config?.limit ?? 1);
  const isLarge = globalSize === 'LARGE';
  const isMedium = globalSize === 'MEDIUM';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className={cn(
        UI.CARD,
        "relative overflow-hidden group/card p-5 md:p-6",
        isLarge ? "min-h-[320px]" : (isMedium ? "min-h-[260px]" : "min-h-[180px]"),
        isLimitReached ? "border-danger/40 ring-1 ring-danger/20" : "hover:border-white/20"
      )}
    >
      {/* Lighting effect */}
      <div className={cn(
        "absolute -top-12 -left-12 w-32 h-32 blur-[60px] transition-all duration-700",
        isLimitReached ? "bg-danger/30" : "bg-accent/10 group-hover/card:bg-accent/20"
      )} />

      {/* Target Legend */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Unit {index + 1}</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10">
           <div className={cn("w-1.5 h-1.5 rounded-full", isLimitReached ? "bg-danger animate-pulse" : "bg-accent shadow-[0_0_8px_var(--accent)]")} />
           <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">{config?.limit} Limit</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full z-10">
        {/* Visualization Expansion: Scaled height and width based on globalSize */}
        <div className={cn(
          "flex items-center justify-center w-full transition-all duration-500 will-change-transform group-hover/card:scale-105",
          isLarge ? "h-24 md:h-32" : (isMedium ? "h-16 md:h-20" : "h-12")
        )}>
          {config?.type === 'CIGARETTE' && <SmokingProgress count={count} limit={config.limit} variant="CIGARETTE" size={globalSize} />}
          {config?.type === 'RYO_ROLL' && <RyoRollProgress count={count} limit={config.limit} size={globalSize} />}
          {config?.type === 'SIMPLE' && <RingProgress count={count} limit={config.limit} size={globalSize} />}
          {config?.type === 'JOINT_KING' && <SmokingProgress count={count} limit={config.limit} variant="KING" size={globalSize} />}
          {config?.type === 'JOINT_QUEEN' && <SmokingProgress count={count} limit={config.limit} variant="QUEEN" size={globalSize} />}
          {(!['CIGARETTE', 'RYO_ROLL', 'SIMPLE', 'JOINT_KING', 'JOINT_QUEEN'].includes(config?.type)) && <GenericBarProgress count={count} limit={config?.limit} size={globalSize} />}
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.span
            key={count}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "font-[1000] tracking-tighter tabular-nums leading-none drop-shadow-2xl",
              isLarge ? "text-7xl md:text-8xl" : (isMedium ? "text-6xl" : "text-4xl"),
              isLimitReached ? "text-danger" : "text-white"
            )}
          >
            {count ?? 0}
          </motion.span>

          <span className={cn(
            "font-bold tracking-[0.4em] uppercase transition-all duration-300 truncate w-full mt-2",
            isLarge ? "text-[12px]" : "text-[10px]",
            isLimitReached ? "text-danger/80" : "text-neutral-400 group-hover:card:text-white/60"
          )}>
            {config?.name || 'Unit'}
          </span>
        </div>
      </div>

      {/* Control Module */}
      <div className="flex items-center justify-between w-full border-t border-white/[0.08] mt-6 pt-6 gap-4 z-10">
        <button
          onClick={onDec}
          className={cn(
            "flex-1 h-10 md:h-11 rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out",
            "bg-neutral-800 border border-white/10 text-white/60 shadow-lg active:scale-95 hover:bg-neutral-700 hover:text-white"
          )}
        >
          <Minus size={18} strokeWidth={3} />
        </button>
        <button
          onClick={onInc}
          className={cn(
            "flex-1 h-10 md:h-11 rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out shadow-xl active:scale-95",
            isLimitReached
              ? "bg-danger text-zinc-950 shadow-danger/20 hover:brightness-110"
              : "bg-accent text-zinc-950 shadow-accent/20 hover:brightness-110"
          )}
        >
          <Plus size={20} strokeWidth={4} />
        </button>
      </div>
    </motion.div>
  );
});
