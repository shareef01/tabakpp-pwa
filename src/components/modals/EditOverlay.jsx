import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Plus, Minus, Database } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UI, Button } from '../Common';
import { cn } from '../../utils/utils';

export const EditOverlay = ({ log, configs, onClose, user }) => {
  const [counts, setCounts] = useState(log.counts || {});

  const handleApply = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid, 'logs', log.logDate), { counts });
      onClose();
    } catch (e) {
      alert("Override failed.");
    }
  };

  const adjust = (id, delta) => {
    setCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">History Override</h3>
            <span className="text-2xl font-[1000] tracking-tighter uppercase text-white block leading-none">
              {new Date(log.logDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}).toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {configs.map(c => (
            <div key={c.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black text-white uppercase tracking-wider">{c.name}</span>
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Protocol {c.id.slice(0,4)}</span>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-xl border border-white/5">
                <button
                  onClick={() => adjust(c.id, -1)}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all active:scale-90"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="text-xl font-[1000] tabular-nums text-white w-10 text-center">
                  {counts[c.id] || 0}
                </span>
                <button
                  onClick={() => adjust(c.id, 1)}
                  className="w-10 h-10 rounded-lg bg-accent text-zinc-950 flex items-center justify-center transition-all active:scale-90"
                >
                  <Plus size={16} strokeWidth={4} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            onClick={handleApply}
            className="w-full h-18 text-[11px]"
          >
            <Database size={16} className="mr-3" strokeWidth={3} />
            Commit Overrides
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
