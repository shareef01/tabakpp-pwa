import React, { useState } from 'react';
import { X, Plus, Minus, Database, Calendar, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ModalFrame } from '../../../components/ui/ModalFrame';
import { UI } from '../../../constants/ui';
import { cn } from '../../../utils/system';
import { sanitizeNumericInput } from '../../../utils/logic';

export const ManualEntryOverlay = ({ isOpen, date, configs = [], onClose, onApply, onAddTracker }) => {
  const [counts, setCounts] = useState({});
  const [saving, setSaving] = useState(false);
  const hasTrackers = configs.length > 0;

  const handleApply = async () => {
    const cleanCounts = {};
    Object.entries(counts).forEach(([id, val]) => {
      const n = Math.round(sanitizeNumericInput(val, 0, 1000));
      if (n > 0) cleanCounts[id] = n;
    });
    if (Object.keys(cleanCounts).length === 0 || saving) return;
    setSaving(true);
    try {
      await onApply(date, cleanCounts);
      onClose();
    } catch {
      /* parent surfaces error */
    } finally {
      setSaving(false);
    }
  };

  const adjust = (id, delta) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      {(titleId) => (
        <div className={cn(UI.MODAL_SHELL, 'max-w-[480px] p-6 md:p-10 flex flex-col max-h-[90vh]')}>
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Manual entry</h3>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-accent" aria-hidden="true" />
                <span id={titleId} className="text-2xl font-[1000] tracking-tighter uppercase text-white block leading-none">
                  {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </span>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="min-w-[44px] min-h-[44px] rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white"><X size={20} strokeWidth={3} /></button>
          </div>

          {!hasTrackers ? (
            <div className="flex flex-col items-center text-center py-10 px-4 space-y-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20">
                <PlusCircle size={32} strokeWidth={1.5} />
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">Add a tracker first, then you can log counts for past days.</p>
              {onAddTracker && (
                <Button onClick={() => { onClose(); onAddTracker(); }} className="w-full max-w-xs">Add tracker</Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 mb-8">
                {configs.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[12px] font-black text-white uppercase truncate">{c.name}</span>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase">Limit: {c.limit}/day</span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                      <button type="button" onClick={() => adjust(c.id, -1)} aria-label={`Decrease ${c.name}`} className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 flex items-center justify-center text-neutral-500"><Minus size={16} strokeWidth={3} /></button>
                      <span className="text-lg font-[1000] tabular-nums text-white w-10 text-center">{counts[c.id] || 0}</span>
                      <button type="button" onClick={() => adjust(c.id, 1)} aria-label={`Increase ${c.name}`} className="min-w-[44px] min-h-[44px] rounded-xl bg-accent text-zinc-950 flex items-center justify-center"><Plus size={16} strokeWidth={4} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleApply} disabled={saving} className="w-full h-16 text-[11px] font-black tracking-[0.3em]">
                <Database size={18} className="mr-3" strokeWidth={3} />{saving ? 'Saving…' : 'Save entry'}
              </Button>
            </>
          )}
        </div>
      )}
    </ModalFrame>
  );
};
