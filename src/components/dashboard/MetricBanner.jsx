import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Target, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/utils';

/**
 * REFINED FINANCIAL METRIC BANNER
 * Task 3: Filtered split display for Wasted vs Saved capital.
 */
export const MetricBanner = React.memo(({ m, widgetSize = 'MEDIUM' }) => {
  const isOverLimit = (m.progress || 0) >= 1;
  const isLarge = widgetSize === 'LARGE';

  return (
    <section className={cn(
      "bg-neutral-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 relative overflow-hidden group shadow-2xl font-inter text-white",
      isLarge ? "p-8 md:p-10" : "p-6"
    )}>
      <div className={cn(
        "absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 opacity-20",
        isOverLimit ? "bg-rose-500" : "bg-emerald-500/30"
      )} />

      <div className="flex flex-col gap-10 md:gap-16 relative z-10">

        {/* FINANCIAL SPLIT VIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2.5 text-rose-400/60">
              <TrendingDown size={14} strokeWidth={2.5} />
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase">Capital Wasted</h3>
            </div>
            <div className="flex items-baseline gap-3">
              <span className={cn(
                "font-[1000] tracking-tighter tabular-nums leading-none text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]",
                isLarge ? "text-6xl md:text-7xl" : "text-5xl"
              )}>
                ${(m.wasted || 0).toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-rose-500/40 uppercase tracking-widest">Today</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 md:border-l border-white/5 md:pl-12">
            <div className="flex items-center gap-2.5 text-emerald-400/60">
              <TrendingUp size={14} strokeWidth={2.5} />
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase">Capital Saved</h3>
            </div>
            <div className="flex items-baseline gap-3">
              <span className={cn(
                "font-[1000] tracking-tighter tabular-nums leading-none text-white",
                isLarge ? "text-6xl md:text-7xl" : "text-5xl"
              )}>
                ${(m.saved || 0).toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">Potential</span>
            </div>
          </div>

        </div>

        <div className="flex-1 w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-10 md:gap-12 min-w-max border-t border-white/10 pt-8">

            <div className="flex flex-col gap-2 min-w-[100px]">
               <div className="flex items-center gap-2.5 text-neutral-500">
                  <Target size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Quota</span>
               </div>
               <span className="text-2xl font-[1000] text-white tracking-tighter leading-none">
                 {Math.max(0, (m.limit || 0) - (m.count || 0))}
                 <span className="text-[10px] font-black text-white/20 ml-2 uppercase">Left</span>
               </span>
            </div>

            <div className="flex flex-col gap-2 min-w-[100px]">
               <div className="flex items-center gap-2.5 text-neutral-500">
                  <Zap size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Rank</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-[1000] text-white uppercase tracking-tighter leading-none">{m.rank || '...'}</span>
                  <span className="text-[10px] font-bold text-neutral-500 tabular-nums uppercase tracking-widest">{m.xp || 0} XP</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[100px]">
               <div className="flex items-center gap-2.5 text-neutral-500">
                  <TrendingUp size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Persistence</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-[1000] text-white tracking-tighter tabular-nums leading-none">{m.streak || 0}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Day Streak</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[100px]">
               <div className="flex items-center gap-2.5 text-neutral-500">
                  <Shield size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">System Health</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-[1000] text-white tracking-tighter tabular-nums leading-none">
                    {Math.floor((m.lost || 0) / 60)}H
                  </span>
                  <span className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest">Recovered</span>
               </div>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-12 space-y-3">
        <div className="flex justify-between items-center px-1">
           <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">Quota Synchronization Matrix</span>
           <span className={cn("text-[10px] font-bold uppercase tracking-widest", isOverLimit ? "text-rose-500" : "text-accent")}>{Math.round((m.progress || 0) * 100)}% Consumed</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(1, m.progress || 0) * 100}%` }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "h-full rounded-full transition-all",
              isOverLimit ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-accent shadow-[0_0_15px_var(--accent-glow)]"
            )}
          />
        </div>
      </div>
    </section>
  );
});
