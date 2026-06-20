import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/system';
import { UI } from '../../../constants/ui';

export const MetricBanner = React.memo(({ m }) => {
  const progress = m?.progress || 0;
  const isOverLimit = progress >= 1;
  const streakText = m?.streak === 1 ? 'DAY' : 'DAYS';

  const formatEuroParts = (val) => {
    const raw = (val || 0).toFixed(2);
    const [int, dec] = raw.split('.');
    return { int, dec: `,${dec}` };
  };

  const { int, dec } = formatEuroParts(m?.spentToday ?? 0);
  const spentColor = (m?.spentToday || 0) > 0 ? 'text-amber-400' : 'text-emerald-400';

  const Item = ({ label, children, colorClass }) => (
    <div className="flex flex-col items-center justify-center min-w-0 flex-1 gap-1 xs:gap-1.5 md:gap-2 px-1.5 xs:px-2 sm:px-3 md:px-4">
      <span className={cn(UI.LABEL, 'text-[8px] xs:text-[9px] sm:text-[10px]')}>{label}</span>
      <div className={cn('flex items-baseline leading-none tabular-nums', colorClass)}>
        {children}
      </div>
    </div>
  );

  const metricSize = 'text-[clamp(1.5rem,5.5vw,3rem)] lg:text-[clamp(1.75rem,4vw,3.25rem)] font-[900] tracking-tighter';

  return (
    <section className="w-full shrink-0 flex items-center justify-center">
      <div
        className={cn(
          UI.CARD,
          'w-full max-w-[min(100%,64rem)]',
          'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_auto] items-center',
          'p-3.5 xs:p-4 sm:p-5 md:p-6 lg:p-8 gap-3 xs:gap-4 sm:gap-5 relative overflow-hidden'
        )}
        style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)' }}
      >
        <Item label="Remaining" colorClass={isOverLimit ? 'text-rose-500' : 'text-[#FAFAFA]'}>
          <span className={metricSize}>{Math.max(0, (m?.limit || 0) - (m?.count || 0))}</span>
        </Item>

        <Item label="Spent Today" colorClass={spentColor}>
          <span className="text-sm xs:text-base md:text-lg font-black mr-0.5 opacity-40 self-baseline">€</span>
          <span className={metricSize}>{int}</span>
          <span className="text-base xs:text-lg md:text-2xl font-bold opacity-60 self-baseline">{dec}</span>
        </Item>

        <Item label="Control Streak" colorClass="text-[#FAFAFA]">
          <span className={metricSize}>{m?.streak || 0}</span>
          <span className="text-[8px] xs:text-[9px] md:text-[10px] font-[800] text-zinc-500 tracking-widest uppercase ml-1 mb-0.5">
            {streakText}
          </span>
        </Item>

        <div className="col-span-2 sm:col-span-1 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 sm:gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:pl-2 lg:pl-4 min-w-0">
          <span className={cn(UI.LABEL, 'text-[8px] xs:text-[9px] sm:text-[10px] shrink-0')}>Daily quota</span>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 sm:flex-initial justify-end sm:justify-center min-w-0">
            <span className={cn('text-[10px] xs:text-xs md:text-sm font-black tabular-nums leading-none shrink-0', isOverLimit ? 'text-rose-500' : 'text-accent')}>
              {Math.round(progress * 100)}%
            </span>
            <div className="flex-1 sm:flex-initial w-full sm:w-14 md:w-20 lg:w-24 max-w-[7rem] sm:max-w-none h-1.5 xs:h-2 bg-black/60 rounded-full overflow-hidden p-px border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(1, progress) * 100}%` }}
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  isOverLimit ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-accent shadow-[0_0_12px_var(--accent-glow)]'
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
