import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cigarette, Wind, Activity, Crown, BarChart2, CheckCircle2, Circle } from 'lucide-react';
import { Input, UI, Button } from '../Common';
import { cn } from '../../utils/utils';

/**
 * ProtocolFormOverlay
 * Task 3: Added 'Financial Tracking' toggle to isolate counters.
 */
export const ProtocolFormOverlay = ({ isOpen, onClose, onApply, title, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [limit, setLimit] = useState(initialData?.limit || 20);
  const [type, setType] = useState(initialData?.type || 'CIGARETTE');

  // Task 3: Financial Isolation Flag
  const [isFinanciallyTracked, setIsFinanciallyTracked] = useState(initialData?.isFinanciallyTracked ?? true);

  const TYPES = [
    { id: 'CIGARETTE', label: 'Schachtel', icon: Cigarette },
    { id: 'RYO_ROLL', label: 'Tabak Beutel', icon: Wind },
    { id: 'SIMPLE', label: 'Simple Ring', icon: Activity },
    { id: 'JOINT_KING', label: 'King Joint', icon: Crown },
    { id: 'JOINT_QUEEN', label: 'Queen Joint', icon: Crown },
    { id: 'GENERIC', label: 'Generic Bar', icon: BarChart2 }
  ];

  const handleSubmit = () => {
    if (!name) return;
    onApply({
      name,
      limit: parseInt(limit),
      type,
      isFinanciallyTracked
    });
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-6 isolate">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0c] border border-white/10 rounded-[40px] w-full max-w-[460px] p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-0.5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 leading-none">Protocol</h3>
            <span className="text-xl font-[1000] tracking-tighter uppercase text-white block leading-none">{title}</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><X size={18} strokeWidth={3} /></button>
        </div>

        <div className="space-y-8">
          <Input label="Protocol Identity" value={name} onChange={setName} isDark placeholder="e.g. Unit A" className="mb-0" />

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <span className={UI.LABEL}>Daily Quota</span>
              <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className={cn(UI.INPUT, "h-12 px-5 text-sm")} />
            </div>

            {/* Task 3: Tracking Isolation Toggle */}
            <button
              onClick={() => setIsFinanciallyTracked(!isFinanciallyTracked)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                isFinanciallyTracked ? "bg-accent/5 border-accent/20" : "bg-white/[0.02] border-white/5 opacity-40"
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Financial Tracking</span>
                <span className="text-[8px] font-medium text-white/40 uppercase tracking-widest">Include in economics metrics</span>
              </div>
              {isFinanciallyTracked ? <CheckCircle2 size={20} className="text-accent" /> : <Circle size={20} className="text-white/20" />}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <span className={UI.LABEL}>Visual Engine</span>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)} className={cn("flex items-center gap-3 p-3.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all", type === t.id ? "bg-accent border-accent text-zinc-950 scale-[1.02]" : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/10")}>
                  {React.createElement(t.icon, { size: 14, strokeWidth: type === t.id ? 3 : 2 })}
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full h-14 md:h-14 text-[10px] shadow-accent/10 mt-4">Commit to Registry</Button>
        </div>
      </motion.div>
    </div>
  );
};
