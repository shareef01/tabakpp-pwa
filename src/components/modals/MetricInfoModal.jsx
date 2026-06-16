import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Zap, Wallet, Activity } from 'lucide-react';
import { Card, Button } from '../Common';

const METRIC_DETAILS = {
  streak: {
    title: "Streak Protocol",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    desc: "Calculated by verifying consecutive days where your 'Cigarette' consumption remained within or below your defined limit.",
    formula: "Consecutive Days [Today → History] where (Cigarette Count ≤ Limit)"
  },
  saved: {
    title: "Capital Guard",
    icon: Wallet,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    desc: "The total monetary value preserved by avoiding cigarette units. Based on an estimated $0.50 per unit cost.",
    formula: "Σ (Cigarette Limit - Cigarette Count) × Unit Price"
  },
  health: {
    title: "Biological Recovery",
    icon: Activity,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    desc: "Estimated total life expectancy recovered. Medical indices suggest each unit avoided restores approx. 11 minutes of biological time.",
    formula: "Avoided Cigarette Units × 11 Minutes"
  }
};

/**
 * MetricInfoModal
 * High-fidelity technical breakdown of health & financial insights.
 */
export const MetricInfoModal = ({ isOpen, onClose, type }) => {
  const data = METRIC_DETAILS[type] || METRIC_DETAILS.streak;
  const Icon = data.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 isolate">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020202]/95 backdrop-blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-sm"
          >
            <Card className="p-8 lg:p-10 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="p-2 text-neutral-600 hover:text-white transition-colors">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-8">
                <div className={`w-20 h-20 rounded-[32px] ${data.bg} ${data.border} border flex items-center justify-center ${data.color}`}>
                  <Icon size={36} strokeWidth={2.5} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-[1000] uppercase tracking-tighter text-white leading-none">
                    {data.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-accent/20 mx-auto" />
                </div>

                <p className="text-[11px] font-bold text-neutral-400 leading-relaxed uppercase tracking-wider opacity-80 px-2">
                  {data.desc}
                </p>

                <div className="w-full bg-black/40 rounded-2xl p-5 border border-white/5 space-y-2 text-left">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent opacity-60">Logic Engine</span>
                  <p className="text-[10px] font-black text-white leading-relaxed tracking-tight">
                    {data.formula}
                  </p>
                </div>

                <Button variant="secondary" className="w-full h-16 text-[10px]" onClick={onClose}>
                  Acknowledge
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
