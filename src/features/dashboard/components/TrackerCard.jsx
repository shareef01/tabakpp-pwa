import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../../utils/system';
import { RingProgress, GenericBarProgress, RyoRollProgress, ZigProgress, QnProgress } from '../gauges/Gauges';
import { UI } from '../../../constants/ui';

const ICON = {
  SMALL: { plus: 18, minus: 16 },
  MEDIUM: { plus: 22, minus: 20 },
  LARGE: { plus: 24, minus: 22 },
};

export const TrackerCard = React.memo(({ config, count = 0, onInc, onDec, index, globalSize = 'MEDIUM' }) => {
  const limit = config?.limit ?? 1;
  const isLimitReached = count >= limit;
  const icons = ICON[globalSize] || ICON.MEDIUM;
  const displayName = config?.name || 'Unnamed tracker';

  const gaugeProps = { count, limit, size: globalSize };
  const type = config?.type;

  const gauge = type === 'CIGARETTE' ? <ZigProgress {...gaugeProps} />
    : type === 'RYO_ROLL' ? <RyoRollProgress {...gaugeProps} />
    : type === 'JOINT_KING' ? <QnProgress {...gaugeProps} />
    : type === 'SIMPLE' ? <RingProgress {...gaugeProps} />
    : <GenericBarProgress {...gaugeProps} />;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.05, duration: 0.35 }}
      data-testid={`tracker-card-${index ?? 0}`}
      data-widget-size={globalSize}
      aria-label={`${displayName}, ${count} of ${limit} today`}
      className={cn(
        UI.TRACKER_CARD,
        'flex flex-col',
        'px-[var(--tracker-pad-x)] py-[var(--tracker-pad-y)]',
        isLimitReached ? 'border-rose-500/40' : 'border-white/[0.08]'
      )}
    >
      <div className="flex items-center justify-between gap-3 min-w-0 mb-[clamp(0.875rem,2.5vw,1.5rem)]">
        <span
          data-testid="tracker-name"
          className="tracker-label font-[800] uppercase truncate text-zinc-500 tracking-[0.28em] sm:tracking-[0.3em]"
        >
          {displayName}
        </span>
        <span className={cn(UI.LABEL, 'shrink-0 tabular-nums text-zinc-600 !text-[9px] xs:!text-[10px]')}>
          {limit}/day
        </span>
      </div>

      <div className="flex items-center justify-center w-full mb-[clamp(0.75rem,2vw,1.25rem)] min-h-[var(--gauge-h)]">
        {gauge}
      </div>

      <div className="flex flex-col items-center text-center flex-1 justify-center py-1 mb-[clamp(0.875rem,2.5vw,1.5rem)]">
        <motion.span
          key={count}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          data-testid="counter-value"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            'counter-display font-[900] tabular-nums tracking-tighter leading-none',
            isLimitReached ? 'text-rose-400' : 'text-[#FAFAFA]'
          )}
        >
          {count ?? 0}
        </motion.span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 w-full border-t border-white/[0.08] pt-[clamp(0.875rem,2.5vw,1.5rem)] mt-auto">
        <button
          type="button"
          onClick={onDec}
          aria-label={`Decrease ${displayName}`}
          className={cn(
            'tracker-btn flex-1 rounded-xl flex items-center justify-center transition-all duration-150',
            'bg-white/[0.04] border border-white/[0.08] text-zinc-400',
            'hover:bg-white/[0.08] hover:text-white active:scale-[0.97]'
          )}
        >
          <Minus size={icons.minus} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={onInc}
          aria-label={`Increase ${displayName}`}
          className={cn(
            'tracker-btn flex-1 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-[0.97]',
            isLimitReached
              ? 'bg-rose-500 text-white shadow-[0_8px_24px_rgba(244,63,94,0.35)] hover:brightness-110'
              : 'bg-accent text-zinc-950 shadow-[0_8px_24px_rgba(var(--accent-rgb),0.25)] hover:brightness-110'
          )}
        >
          <Plus size={icons.plus} strokeWidth={2.5} />
        </button>
      </div>
    </motion.article>
  );
});
