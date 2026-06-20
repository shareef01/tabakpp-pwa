import React from 'react';
import { TrendingUp, Wallet, Activity } from 'lucide-react';
import { cn } from '../../../utils/system';
import { ModalFrame } from '../../../components/ui/ModalFrame';

export const MetricInfoModal = ({ isOpen, onClose, type }) => {
  const content = {
    streak: {
      icon: TrendingUp,
      title: 'Control Streak',
      desc: 'Consecutive tracking days within your daily limits. Your open session counts for today until you press End Day.',
      color: 'text-amber-400',
    },
    saved: {
      icon: Wallet,
      title: 'Capital Preserved',
      desc: 'All-time € kept by staying under limits (from archived days). Today\'s open-session headroom is not included until you End Day.',
      color: 'text-emerald-400',
    },
    health: {
      icon: Activity,
      title: 'System Integrity',
      desc: 'Estimated minutes of life recovered from staying under smoking limits.',
      color: 'text-rose-400',
    },
  };

  const active = content[type];
  if (!active) return null;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      {(titleId) => (
        <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] w-full max-w-sm p-10 shadow-2xl text-center mx-auto">
          <div className={cn('w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6', active.color)}>
            <active.icon size={32} />
          </div>
          <h3 id={titleId} className="text-2xl font-[1000] uppercase tracking-tighter text-white mb-2">{active.title}</h3>
          <p className="text-sm font-bold text-neutral-500 leading-relaxed mb-8">{active.desc}</p>
          <button type="button" onClick={onClose} className="w-full h-14 rounded-2xl bg-white/5 text-neutral-400 font-black uppercase tracking-widest hover:text-white transition-all">Close</button>
        </div>
      )}
    </ModalFrame>
  );
};
