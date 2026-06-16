import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Wallet, Activity, Edit2, Trash2, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Card, Button, UI } from '../Common';
import { cn } from '../../utils/utils';
import { formatDateDisplay } from '../../utils/formatters';
import { safeAsync } from '../../utils/errorHandlers';
import { ConfirmModal } from '../modals/ConfirmModal';
import { MetricInfoModal } from '../modals/MetricInfoModal';

/**
 * Premium Metric Block
 * High-fidelity stat cards with advanced glassmorphism.
 */
const InsightCard = React.memo(({ icon: Icon, label, val, sub, color, onInfo }) => (
  <div className="bg-neutral-900/50 backdrop-blur-2xl border border-white/[0.05] p-8 rounded-[32px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 hover:border-white/10 group h-full relative overflow-hidden">
     {/* Ambient Glow */}
     <div className={cn("absolute -top-10 -left-10 w-24 h-24 blur-[40px] opacity-10 transition-opacity duration-700 group-hover:opacity-20", color)} />

     <button
       onClick={onInfo}
       className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all duration-300 z-20"
     >
       <Info size={14} strokeWidth={2.5} />
     </button>

     <div className={cn("p-4 rounded-2xl bg-white/[0.03] mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-700", color)}>
       <Icon size={24} strokeWidth={2.5} />
     </div>

     <span className="text-4xl font-[1000] tracking-tighter tabular-nums mb-1 text-white leading-none drop-shadow-xl">
       {val ?? 0}
     </span>
     <span className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">
       {sub}
     </span>

     <div className="mt-6 pt-6 border-t border-white/[0.03] w-full text-[9px] font-black uppercase tracking-[0.5em] text-accent/40 group-hover:text-accent/80 transition-colors duration-700">
       {label}
     </div>
  </div>
));

export const HistoryScreen = React.memo(({ logs, m, onEdit, userId, today }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoType, setInfoType] = useState(null);

  const handlePurge = async () => {
    if (!deleteTarget) return;
    await safeAsync(async () => {
      await deleteDoc(doc(db, 'users', userId, 'logs', deleteTarget));
    }, 'PURGE_LOG');
    setDeleteTarget(null);
  };

  const chartData = useMemo(() => {
    return (logs ?? []).slice(0, 10).reverse().map(l => ({
      name: new Date(l.logDate).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
      val: Object.values(l.counts ?? {}).reduce((a, b) => a + b, 0)
    }));
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10 font-inter pb-24"
    >
       {/* ANALYTICS HEADER */}
       <section className="bg-neutral-900/50 backdrop-blur-2xl border border-white/[0.05] p-10 lg:p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
         <div className="flex justify-between items-center mb-12 relative z-10">
           <div className="space-y-2">
             <h3 className="text-[10px] font-black text-neutral-500 tracking-[0.5em] uppercase">Architecture Trends</h3>
             <span className="text-3xl font-[1000] tracking-tighter uppercase text-white leading-none">Daily Velocity</span>
           </div>
           <div className="w-14 h-14 bg-accent/10 rounded-2xl text-accent border border-accent/20 flex items-center justify-center shadow-inner">
             <BarChart3 size={28} strokeWidth={2.5} />
           </div>
         </div>

         <div className="h-72 lg:h-96 w-full relative z-10">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="12 12" stroke="#ffffff05" vertical={false} />
               <XAxis dataKey="name" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight:900}} dy={15} />
               <Tooltip
                 contentStyle={{
                   background: 'rgba(10,10,12,0.9)',
                   border: '1px solid rgba(255,255,255,0.08)',
                   borderRadius: '24px',
                   fontSize: '12px',
                   fontWeight: 900,
                   backdropFilter: 'blur(20px)',
                   boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                 }}
               />
               <Line
                 type="monotone"
                 dataKey="val"
                 stroke="var(--accent)"
                 strokeWidth={8}
                 dot={{ r: 8, fill: 'var(--accent)', strokeWidth: 5, stroke: '#0a0a0c' }}
                 activeDot={{ r: 10, strokeWidth: 0, fill: '#fff' }}
                 animationDuration={2000}
               />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </section>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* STATS MATRIX */}
         <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
           <InsightCard icon={TrendingUp} label="Streak" val={m.streak} sub="Days Active" color="text-amber-400" onInfo={() => setInfoType('streak')} />
           <InsightCard icon={Wallet} label="Saved" val={`$${(m.savings ?? 0).toFixed(2)}`} sub="Preserved Capital" color="text-emerald-400" onInfo={() => setInfoType('saved')} />
           <InsightCard icon={Activity} label="Health" val={`${Math.floor((m.lost ?? 0)/60)}H`} sub="Life Recovered" color="text-rose-400" onInfo={() => setInfoType('health')} />
         </div>

         {/* FEED MODULE */}
         <div className="lg:col-span-8 bg-neutral-900/50 backdrop-blur-2xl border border-white/[0.05] p-10 lg:p-12 rounded-[48px] shadow-2xl">
           <div className="flex items-center gap-4 mb-12">
             <div className="h-px flex-1 bg-white/[0.03]" />
             <h4 className="text-[10px] font-black text-neutral-500 tracking-[0.6em] uppercase">Registry Ledger</h4>
             <div className="h-px flex-1 bg-white/[0.03]" />
           </div>

           <div className="space-y-5">
             {(logs ?? []).length > 0 ? logs.map((log) => (
               <div key={log.logDate} className="flex items-center justify-between p-6 bg-white/[0.01] rounded-3xl border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 group">
                 <div className="flex flex-col gap-1.5">
                   <span className="text-sm font-black text-white uppercase tracking-tight">
                     {log.logDate === today ? 'Today (Active)' : formatDateDisplay(log.logDate)}
                   </span>
                   <span className="text-[10px] font-black text-accent/60 uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                     {Object.values(log.counts ?? {}).reduce((a, b) => a + b, 0)} Registry Units Synchronized
                   </span>
                 </div>
                 <div className="flex items-center gap-3">
                   <button onClick={() => onEdit(log)} className={UI.GLASS_ACTION}>
                     <Edit2 size={18} strokeWidth={2.5} />
                   </button>
                   <button onClick={() => setDeleteTarget(log.logDate)} className={cn(UI.GLASS_ACTION, "hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20")}>
                     <Trash2 size={18} strokeWidth={2.5} />
                   </button>
                 </div>
               </div>
             )) : (
               <div className="py-32 text-center text-neutral-700 uppercase text-[10px] font-black tracking-[0.8em] border-2 border-dashed border-white/5 rounded-[40px]">
                 No Encrypted Records
               </div>
             )}
           </div>
         </div>
       </div>

       <ConfirmModal
         isOpen={!!deleteTarget}
         onClose={() => setDeleteTarget(null)}
         onConfirm={handlePurge}
         title="Purge Record?"
         message="This data will be permanently removed from the cloud ledger and cannot be recovered."
         confirmText="Purge"
       />

       <MetricInfoModal
         isOpen={!!infoType}
         onClose={() => setInfoType(null)}
         type={infoType}
       />
    </motion.div>
  );
});
