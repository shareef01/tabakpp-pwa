import React from 'react';
import { TrendingUp, Wallet, Activity } from 'lucide-react';
import { cn } from '../../../utils/system';
import { ModalFrame } from '../../../components/ui/ModalFrame';
import { UI } from '../../../constants/ui';

export const MetricInfoModal = ({ isOpen, onClose, type }) => {
  const content = {
    streak: {
      icon: TrendingUp,
      title: 'Days within limit',
      desc: 'Consecutive tracking days where you stayed within your daily limits. Today counts until you press End Day.',
      color: 'text-amber-400',
    },
    saved: {
      icon: Wallet,
      title: 'Lifetime savings',
      desc: 'Total € kept by staying under limits on archived days. Today\'s open session is included after you End Day.',
      color: 'text-emerald-400',
    },
    health: {
      icon: Activity,
      title: 'Time recovered',
      desc: 'Estimated minutes recovered from staying under your daily limits.',
      color: 'text-rose-400',
    },
  };

  const active = content[type];
  if (!active) return null;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      {(titleId) => (
        <div className={cn(UI.MODAL_SHELL, 'max-w-sm p-10 text-center')}>
          <div className={cn('w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6', active.color)}>
            <active.icon size={32} aria-hidden="true" />
          </div>
          <h3 id={titleId} className="text-2xl font-[1000] uppercase tracking-tighter text-white mb-2">{active.title}</h3>
          <p className="text-sm font-medium text-neutral-400 leading-relaxed mb-8">{active.desc}</p>
          <button type="button" onClick={onClose} className="w-full min-h-[44px] h-14 rounded-2xl bg-white/5 text-neutral-400 font-black uppercase tracking-widest hover:text-white transition-all">Close</button>
        </div>
      )}
    </ModalFrame>
  );
};
