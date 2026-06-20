import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Database } from 'lucide-react';
import { RegistryService } from '../../../api/registryService';
import { Button } from '../../../components/ui/Button';
import { ModalFrame } from '../../../components/ui/ModalFrame';
import { cn } from '../../../utils/system';

export const EditLogOverlay = ({ isOpen, log, configs, onClose, user, unitPrice = 0.5, onError }) => {
  const [counts, setCounts] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && log) setCounts(log.counts || {});
  }, [isOpen, log]);

  const handleApply = async () => {
    if (!log?.id || !user?.uid || saving) return;
    setSaving(true);
    try {
      await RegistryService.updateHistoricalLog(user.uid, log.id, counts, {
        configs,
        unitPrice,
      });
      onClose();
    } catch (e) {
      onError?.(e.message || 'Override failed');
    } finally {
      setSaving(false);
    }
  };

  const adjust = (id, delta) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  if (!log) return null;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      {(titleId) => (
        <div className="bg-[#0a0a0c] border border-white/10 rounded-[32px] w-full max-w-[440px] p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-0.5">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-500">Edit history</h3>
              <span id={titleId} className="text-xl font-[1000] tracking-tighter uppercase text-white block leading-none">
                {new Date(`${log.logDate}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
              </span>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white"><X size={18} strokeWidth={3} /></button>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {configs.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                <span className="text-[10px] font-black text-white uppercase truncate">{c.name}</span>
                <div className="flex items-center gap-3 bg-black/40 p-1 rounded-xl border border-white/5">
                  <button type="button" onClick={() => adjust(c.id, -1)} aria-label={`Decrease ${c.name}`} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-500"><Minus size={14} strokeWidth={3} /></button>
                  <span className="text-base font-[1000] tabular-nums text-white w-8 text-center">{counts[c.id] || 0}</span>
                  <button type="button" onClick={() => adjust(c.id, 1)} aria-label={`Increase ${c.name}`} className="w-8 h-8 rounded-lg bg-accent text-zinc-950 flex items-center justify-center"><Plus size={14} strokeWidth={4} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button onClick={handleApply} disabled={saving} className="w-full h-14 text-[10px] font-black tracking-[0.2em]">
              <Database size={14} className="mr-2" strokeWidth={3} />{saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      )}
    </ModalFrame>
  );
};
