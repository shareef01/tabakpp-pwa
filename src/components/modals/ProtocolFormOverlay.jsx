import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Activity, Zap, Crown, BarChart2, Cigarette } from 'lucide-react';
import { Input, UI, Button } from '../Common';
import { cn } from '../../utils/utils';

export const ProtocolFormOverlay = ({ isOpen, onClose, onApply, title, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [limit, setLimit] = useState(initialData?.limit || 20);
  const [type, setType] = useState(initialData?.type || 'CIGARETTE');

  const TYPES = [
    { id: 'CIGARETTE', label: 'Cigarette', icon: Cigarette },
    { id: 'SIMPLE', label: 'Simple Ring', icon: Activity },
    { id: 'JOINT_KING', label: 'King Joint', icon: Crown },
    { id: 'JOINT_QUEEN', label: 'Queen Joint', icon: Crown },
    { id: 'GENERIC', label: 'Generic Bar', icon: BarChart2 }
  ];

  const handleSubmit = () => {
    if (!name) return;
    onApply({ name, limit: parseInt(limit), type });
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 isolate">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0c] border border-white/5 rounded-[48px] w-full max-w-[500px] p-8 lg:p-12 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Registry</h3>
            <span className="text-2xl font-[1000] tracking-tighter uppercase text-white block leading-none">{title}</span>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-10">
          <Input label="Counter Label" value={name} onChange={setName} isDark placeholder="e.g. Zigarettes" />

          <div className="flex flex-col gap-2">
            <span className={UI.LABEL}>Daily Quota</span>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className={UI.INPUT}
            />
          </div>

          <div className="flex flex-col gap-5">
            <span className={UI.LABEL}>Visualization Engine</span>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                      type === t.id ? "bg-accent border-accent text-zinc-950 shadow-xl scale-[1.02]" : "bg-white/5 border-white/5 text-neutral-500 hover:border-white/10"
                    )}
                  >
                    <Icon size={16} strokeWidth={type === t.id ? 3 : 2} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-18 text-[11px] mt-4"
          >
            Commit to Registry
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
