import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/system';

/** Filter tip share — burn stops here, filter always visible */
const FILTER_RATIO = 0.22;

const EmberTip = ({ wide = false }) => (
  <div
    className={cn(
      'absolute -right-0.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none',
      wide ? 'h-[110%] w-[10%] min-w-[0.4rem]' : 'h-full w-[8%] min-w-[0.5rem]'
    )}
    style={{
      background: 'linear-gradient(90deg, #e11d48 0%, #f97316 45%, #fbbf24 100%)',
      boxShadow: '0 0 18px 4px rgba(244,63,94,0.75), 0 0 32px rgba(249,115,22,0.45)',
    }}
  />
);

const FilterTip = ({ widthPct, variant = 'cigarette', className, style }) => {
  const variants = {
    cigarette: {
      background: 'linear-gradient(180deg, #dcb888 0%, #c89e6c 40%, #ac8551 72%, #8a6236 100%)',
      boxShadow: 'inset 4px 0 12px rgba(0,0,0,0.2), inset -1px 0 6px rgba(255,234,205,0.18)',
    },
    ryo: {
      background: 'linear-gradient(180deg, #fafafa 0%, #e8e8e8 50%, #d4d4d4 100%)',
      boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.12), inset 4px -4px 10px rgba(0,0,0,0.1)',
    },
    joint: {
      background: 'linear-gradient(180deg, #a1887f 0%, #795548 55%, #5d4037 100%)',
      boxShadow: 'inset 4px 0 12px rgba(0,0,0,0.28)',
    },
  };

  const v = variants[variant] || variants.cigarette;

  return (
    <div
      className={cn('h-full shrink-0 relative overflow-hidden border-l-2 border-black/30 z-10', className)}
      style={{ width: `${widthPct}%`, ...v, ...style }}
    >
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 35%, rgba(90,30,0,0.5) 0.5px, transparent 0.6px), radial-gradient(circle at 65% 70%, rgba(90,30,0,0.4) 0.5px, transparent 0.6px)',
          backgroundSize: '4px 5px, 5px 4px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <div className="absolute left-0 inset-y-0 w-px bg-black/20 pointer-events-none" />
    </div>
  );
};

const GaugeShell = ({ girthy, isLimitReached, children }) => (
  <div
    className={cn(
      'gauge-track relative mx-auto rounded-full overflow-hidden flex items-center border-2 transition-all duration-500',
      girthy && 'scale-y-110',
      isLimitReached
        ? 'bg-red-500 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.7)]'
        : 'border-white/10 bg-black/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.45)]'
    )}
  >
    {children}
  </div>
);

const BurnGauge = ({
  count = 0,
  limit = 1,
  filterClass,
  filterStyle,
  paperClass,
  girthy = false,
  emberWide = false,
  filterRatio = FILTER_RATIO,
  filterVariant = 'cigarette',
}) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const paperShare = 1 - filterRatio;
  const ashPct = progress * paperShare * 100;
  const paperPct = (1 - progress) * paperShare * 100;
  const filterPct = filterRatio * 100;

  return (
    <GaugeShell girthy={girthy} isLimitReached={isLimitReached}>
      {!isLimitReached ? (
        <>
          <div
            className="h-full bg-neutral-800 transition-all duration-500 ease-out relative shrink-0 border-r border-black/40"
            style={{ width: `${ashPct}%` }}
          >
            {count > 0 && <EmberTip wide={emberWide} />}
          </div>
          <div
            className={cn(
              'h-full shrink-0 transition-all duration-500 ease-out shadow-[inset_-4px_0_10px_rgba(0,0,0,0.1)]',
              paperClass || 'bg-white'
            )}
            style={{ width: `${paperPct}%` }}
          />
          <FilterTip
            widthPct={filterPct}
            variant={filterVariant}
            className={filterClass}
            style={filterStyle}
          />
        </>
      ) : (
        <div className="w-full h-full bg-red-400 animate-pulse" />
      )}
    </GaugeShell>
  );
};

export const ZigProgress = React.memo((p) => (
  <BurnGauge {...p} filterVariant="cigarette" />
));

export const RyoRollProgress = React.memo((p) => (
  <BurnGauge {...p} filterVariant="ryo" />
));

export const QnProgress = React.memo((p) => (
  <BurnGauge
    {...p}
    girthy
    emberWide
    filterRatio={0.24}
    filterVariant="joint"
    paperClass="bg-[#e8f5e9]"
  />
));

export const RingProgress = React.memo(({ count = 0, limit = 1 }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));
  const r = 38;
  const circum = 2 * Math.PI * r;

  return (
    <div
      className="relative mx-auto aspect-square"
      style={{ width: 'var(--ring-size, 7rem)', height: 'var(--ring-size, 7rem)' }}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="fill-none stroke-white/[0.06]" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={r}
          className="fill-none"
          style={{ stroke: isLimitReached ? '#f43f5e' : 'var(--accent)' }}
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ strokeDashoffset: circum - progress * circum }}
          initial={false}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          strokeDasharray={circum}
        />
      </svg>
    </div>
  );
});

export const GenericBarProgress = ({ count, limit }) => {
  const isLimitReached = count >= limit;
  const progress = Math.min(1, count / (limit || 1));

  return (
    <div className={cn(
      'gauge-track mx-auto rounded-full overflow-hidden border bg-black/50',
      isLimitReached ? 'border-rose-500/40' : 'border-white/[0.06]'
    )}>
      <motion.div
        className={cn('h-full rounded-full', isLimitReached ? 'bg-rose-500' : 'bg-accent')}
        animate={{ width: `${progress * 100}%` }}
        initial={false}
        transition={{ type: 'spring', stiffness: 100, damping: 22 }}
      />
    </div>
  );
};
