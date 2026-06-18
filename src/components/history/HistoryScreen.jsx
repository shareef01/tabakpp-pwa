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
 * ARCHITECTURAL HISTORY SCREEN
 * Constrained Chart Height, Tightened List, and Fluid Scaling.
 */
const InsightCard = React.memo(({ icon: Icon, label, val, sub, color, onInfo }) => (
  <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/[0.05] p-6 rounded-[32px] flex flex-col items-center justify-center text-center shadow-lg shadow-black/40 h-full relative overflow-hidden group">
     <button onClick={onInfo} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all z-20"><Info size={14} /></button>
     <div className={cn("p-4 rounded-2xl bg-white/[0.03] mb-4 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-700", color)}><Icon size={24} /></div>
     <span className="text-3xl font-[1000] tracking-tighter tabular-nums mb-1 text-white">{val ?? 0}</span>
     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{sub}</span>
     <div className="mt-4 pt-4 border-t border-white/[0.03] w-full text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">{label}</div>
  </div>
));

export const HistoryScreen = React.memo(({ logs, m, onEdit, userId, today }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoType, setInfoType] = useState(null);

  const chartData = useMemo(() => {
    return (logs ?? []).slice(0, 10).reverse().map(l => ({
      name: new Date(l.logDate).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
      val: Object.values(l.counts ?? {}).reduce((a, b) => a + b, 0)
    }));
  }, [logs]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-24">

       {/* ANALYTICS: Constrained Height */}
       <section className="bg-neutral-900/40 backdrop-blur-2xl border border-white/[0.05] p-6 md:p-8 rounded-[48px] shadow-2xl overflow-hidden">
         <div className="flex justify-between items-center mb-8 relative z-10">
           <div className="space-y-1">
             <h3 className="text-[10px] font-black text-neutral-500 tracking-[0.4em] uppercase leading-none">Usage Stream</h3>
             <span className="text-2xl font-[1000] tracking-tighter uppercase text-white leading-none">Analytics</span>
           </div>
           <div className="w-12 h-12 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center shadow-inner"><BarChart3 size={24} className="text-accent" /></div>
         </div>

         {/* Chart Constraint: aspect-video + max-height */}
         <div className="w-full relative z-10 max-h-[340px] aspect-[21/9] md:aspect-auto md:h-80 lg:h-96">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="12 12" stroke="#ffffff05" vertical={false} />
               <XAxis dataKey="name" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight:900}} dy={15} />
               <Tooltip contentStyle={{ background: 'rgba(10,10,12,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', fontSize: '12px', fontWeight: 900, backdropFilter: 'blur(20px)' }} />
               <Line type="monotone" dataKey="val" stroke="var(--accent)" strokeWidth={6} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 4, stroke: '#0a0a0c' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }} />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </section>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
         {/* STATS MATRIX: Consistent Column Height */}
         <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
           <InsightCard icon={TrendingUp} label="Persistence" val={m.streak} sub="Day Streak" color="text-amber-400" onInfo={() => setInfoType('streak')} />
           <InsightCard icon={Wallet} label="Economy" val={`$${(m.savings ?? 0).toFixed(2)}`} sub="Preserved" color="text-emerald-400" onInfo={() => setInfoType('saved')} />
           <InsightCard icon={Activity} label="System" val={`${Math.floor((m.lost ?? 0)/60)}H`} sub="Recovered" color="text-rose-400" onInfo={() => setInfoType('health')} />
         </div>

         {/* LEDGER: Tightened list padding */}
         <div className="lg:col-span-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/[0.05] p-6 md:p-10 rounded-[48px] shadow-2xl flex flex-col h-full">
           <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-white/[0.03]" />
             <h4 className="text-[10px] font-black text-neutral-500 tracking-[0.5em] uppercase leading-none">Ledger</h4>
             <div className="h-px flex-1 bg-white/[0.03]" />
           </div>

           <div className="space-y-3 overflow-y-auto max-h-[600px] flex-1 pr-2 custom-scrollbar">
             {(logs ?? []).length > 0 ? logs.map((log) => (
               <div key={log.logDate} className="flex items-center justify-between p-4 bg-white/[0.01] rounded-2xl border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.03] transition-all group">
                 <div className="flex flex-col gap-1">
                   <span className="text-sm font-black text-white uppercase tracking-tight truncate">{log.logDate === today ? 'Active' : formatDateDisplay(log.logDate)}</span>
                   <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] group-hover:opacity-100 group-hover:text-accent transition-all">{Object.values(log.counts ?? {}).reduce((a, b) => a + b, 0)} Units</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <button onClick={() => onEdit(log)} className="p-3 rounded-xl bg-white/5 border border-white/5 text-neutral-500 hover:text-white transition-all"><Edit2 size={16} strokeWidth={2.5} /></button>
                   <button onClick={() => setDeleteTarget(log.logDate)} className="p-3 rounded-xl bg-white/5 border border-white/5 text-neutral-500 hover:text-rose-500 transition-all"><Trash2 size={16} strokeWidth={2.5} /></button>
                 </div>
               </div>
             )) : (
               <div className="py-24 text-center text-neutral-800 uppercase text-[10px] font-black tracking-widest border-2 border-dashed border-white/5 rounded-[32px]">Empty Registry</div>
             )}
           </div>
         </div>
       </div>

       <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { await deleteDoc(doc(db, 'users', userId, 'logs', deleteTarget)); setDeleteTarget(null); }} title="Purge Record?" message="Action irreversible." confirmText="Purge" />
       <MetricInfoModal isOpen={!!infoType} onClose={() => setInfoType(null)} type={infoType} />
    </motion.div>
  );
});
