import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Wallet, Activity, Edit2, Trash2, Info, CalendarPlus, Clock, Hash } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UI } from '../../constants/ui';
import { cn } from '../../utils/system';
import { formatDateDisplay, formatCurrency, aggregateDailyChartTotals } from '../../utils/logic';
import { ConfirmModal } from '../shared/ConfirmModal';
import { MetricInfoModal } from './components/MetricInfoModal';
import { ManualEntryOverlay } from './components/ManualEntryOverlay';
import { HistorySkeleton } from './components/HistorySkeleton';

const InsightCard = React.memo(({ icon: Icon, label, val, sub, color, onInfo }) => (
  <div className={cn(UI.CARD, 'p-5 md:p-6 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group transition-all')}>
     <button type="button" onClick={onInfo} aria-label={`More info: ${label}`} className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 text-neutral-600 hover:text-[#FAFAFA] transition-all z-20"><Info size={14} /></button>
     <div className={cn('p-3 rounded-2xl bg-white/[0.02] mb-3 border border-white/5', color)}><Icon size={20} /></div>
     <span className="text-2xl md:text-3xl font-[900] tracking-tighter tabular-nums mb-1 text-[#FAFAFA]">{val ?? 0}</span>
     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{sub}</span>
     <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{label}</span>
  </div>
));

export const HistoryScreen = React.memo(({ loading = false, logs = [], configs = [], m = {}, onEdit, onDeleteLog, today, onManualEntry, onError, onAddProtocol }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoType, setInfoType] = useState(null);
  const [newEntryDate, setNewEntryDate] = useState(today || new Date().toISOString().split('T')[0]);
  const [showManualInit, setShowManualInit] = useState(false);

  const handlePurge = async () => {
    if (!deleteTarget || !onDeleteLog) return;
    try {
      await onDeleteLog(deleteTarget);
      setDeleteTarget(null);
    } catch (e) {
      onError?.(e.message || 'Failed to delete log');
      setDeleteTarget(null);
    }
  };

  const parseCommitTime = (log) => {
    if (log.finalizedAt?.toDate) {
      const d = log.finalizedAt.toDate();
      if (!isNaN(d.getTime())) return d;
    }
    const id = log.id || '';
    const dMatch = id.match(/_D(\d+)_/);
    if (dMatch) return new Date(Number(dMatch[1]));
    const tMatch = id.match(/_T(\d+)_/);
    if (tMatch) return new Date(Number(tMatch[1]));
    const mMatch = id.match(/_M(\d+)_/);
    if (mMatch) return new Date(Number(mMatch[1]));
    return null;
  };

  const chartData = useMemo(() => {
    try {
      return aggregateDailyChartTotals(logs)
        .slice(-10)
        .map(({ date, total }) => ({
          name: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
          val: total || 0,
        }));
    } catch {
      return [{ name: 'EMPTY', val: 0 }];
    }
  }, [logs]);

  const chartSummary = useMemo(() => {
    if (!chartData.length) return 'No usage data yet.';
    const total = chartData.reduce((sum, d) => sum + (d.val || 0), 0);
    const peak = chartData.reduce((best, d) => (d.val > best.val ? d : best), chartData[0]);
    return `Daily usage over the last ${chartData.length} days. Total ${total} units. Peak ${peak.val} on ${peak.name}.`;
  }, [chartData]);

  if (loading) return <HistorySkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8 w-full max-w-6xl mx-auto pb-10">

       <section
        className={cn(UI.CARD, "p-6 md:p-10 overflow-hidden")}
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)" }}
       >
         <div className="flex justify-between items-center mb-8 relative z-10 px-1">
           <div className="space-y-1">
             <h3 className={UI.LABEL}>History</h3>
             <span className="text-2xl font-black tracking-tighter uppercase text-[#FAFAFA] leading-none">Daily usage</span>
           </div>
           <div className="w-12 h-12 bg-white/[0.02] rounded-[18px] border border-white/10 flex items-center justify-center shadow-inner"><BarChart3 size={24} className="text-accent" /></div>
         </div>

         <p className="sr-only" data-selectable>{chartSummary}</p>
         <div className="w-full relative z-10 h-[220px] md:h-[280px]" aria-hidden="true">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="12 12" stroke="#ffffff03" vertical={false} />
               <XAxis dataKey="name" stroke="#71717A" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight:900}} dy={15} />
               <Tooltip contentStyle={{ background: '#121214', border: '1px solid #3f3f46', borderRadius: '16px', fontSize: '11px', fontWeight: 700 }} />
               <Line type="monotone" dataKey="val" stroke="var(--accent)" strokeWidth={6} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 3, stroke: '#0a0a0c' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }} />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </section>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
         <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
           <div className="grid grid-cols-1 xs:grid-cols-3 lg:grid-cols-1 gap-4 md:gap-6 flex-1">
             <InsightCard icon={TrendingUp} label="Days within limit" val={m?.streak || 0} sub="Day streak" color="text-amber-400" onInfo={() => setInfoType('streak')} />
             <InsightCard icon={Wallet} label="Lifetime savings" val={formatCurrency(m?.savedLifetime ?? m?.saved ?? 0)} sub="Total preserved" color="text-emerald-400" onInfo={() => setInfoType('saved')} />
             <InsightCard icon={Activity} label="Time recovered" val={`${Math.floor((m?.recovered || 0)/60)}H`} sub="Estimated" color="text-rose-400" onInfo={() => setInfoType('health')} />
           </div>

           <div
            className={cn(UI.CARD, "p-6 md:p-8 relative overflow-hidden group/init")}
            style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)" }}
           >
              <div className="flex items-center justify-between mb-6">
                <span className={UI.LABEL}>Add past entry</span>
                <CalendarPlus size={20} className="text-white/20 group-hover/init:text-accent transition-colors" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-3">
                <input type="date" value={newEntryDate} max={today} onChange={(e) => setNewEntryDate(e.target.value)} className={cn(UI.INPUT, 'h-12 flex-1 text-xs md:text-sm')} aria-label="Entry date" />
                <button type="button" onClick={() => setShowManualInit(true)} aria-label="Add manual entry" className="min-w-[44px] min-h-[44px] rounded-2xl bg-accent text-zinc-950 flex items-center justify-center shadow-lg active:scale-95 transition-all"><Hash size={22} strokeWidth={3} /></button>
              </div>
           </div>
         </div>

         <div
          className={cn(UI.CARD, "lg:col-span-8 p-6 md:p-10 flex flex-col h-full overflow-hidden")}
          style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)" }}
         >
           <div className="flex items-center gap-6 mb-8">
             <div className="h-px flex-1 bg-white/[0.05]" />
             <h4 className={UI.LABEL}>Log entries</h4>
             <div className="h-px flex-1 bg-white/[0.05]" />
           </div>

           <div className="space-y-3 flex-1 pb-10 selectable" data-selectable>
             {Array.isArray(logs) && logs.length > 0 ? logs.map((log) => {
               if (!log?.id) return null;
               const total = Object.values(log.counts || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
               const commitTime = parseCommitTime(log);

               return (
                 <div key={log.id} className="flex items-center justify-between p-4 md:p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                   <div className="flex flex-col gap-1.5 min-w-0">
                     <div className="flex items-center gap-3">
                        <span className="text-sm md:text-base font-[900] text-[#FAFAFA] uppercase tracking-tight truncate">{formatDateDisplay(log.logDate)}</span>
                        {commitTime instanceof Date && !isNaN(commitTime.getTime()) && (
                           <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                              <Clock size={10} className="text-neutral-500" />
                              <span className="text-[10px] text-neutral-400 font-black uppercase tabular-nums">{commitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        )}
                     </div>
                     <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] group-hover:text-accent transition-all tabular-nums">{total} units logged</span>
                   </div>
                   <div className="flex items-center gap-2.5 shrink-0">
                     <button type="button" onClick={() => onEdit && onEdit(log)} aria-label={`Edit entry for ${formatDateDisplay(log.logDate)}`} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 text-neutral-500 hover:text-[#FAFAFA] transition-all"><Edit2 size={16} /></button>
                     <button type="button" onClick={() => setDeleteTarget(log.id)} aria-label={`Delete entry for ${formatDateDisplay(log.logDate)}`} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 text-neutral-500 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                   </div>
                 </div>
               );
             }) : (
               <div className="py-16 px-6 text-center border-2 border-dashed border-white/10 rounded-[32px] space-y-4">
                 <p className="text-sm text-zinc-500">No history yet — log from Track or add a past entry above.</p>
                 {onAddProtocol && (
                   <button type="button" onClick={onAddProtocol} className="text-xs font-bold uppercase tracking-widest text-accent hover:brightness-110">Add your first tracker</button>
                 )}
               </div>
             )}
           </div>
         </div>
       </div>

       <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handlePurge} title="Delete entry?" message="This permanently removes the log for that day." confirmText="Delete" />
       <MetricInfoModal isOpen={!!infoType} onClose={() => setInfoType(null)} type={infoType} />

       <AnimatePresence>
         {showManualInit && (
           <ManualEntryOverlay isOpen={showManualInit} date={newEntryDate} configs={configs || []} onClose={() => setShowManualInit(false)} onApply={onManualEntry} onAddTracker={onAddProtocol} />
         )}
       </AnimatePresence>
    </motion.div>
  );
});
