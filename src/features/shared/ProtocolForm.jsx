import React, { useState, useEffect } from 'react';
import { X, Target, Hash } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalFrame } from '../../components/ui/ModalFrame';
import { UI } from '../../constants/ui';
import { cn } from '../../utils/system';
import { sanitizeNumericInput, sanitizeStringInput } from '../../utils/logic';

const MiniGauge = ({ type, active }) => {
  const base = 'h-4 rounded-full overflow-hidden flex items-center border border-white/10 transition-all duration-500 shadow-inner relative';
  if (type === 'CIGARETTE') return (
    <div className={cn(base, 'w-16 bg-neutral-800', active ? 'ring-2 ring-orange-500/50' : 'opacity-40')}>
      <div className="h-full w-2/3 bg-white" />
      <div className="h-full flex-1 bg-gradient-to-b from-[#fb923c] to-[#ea580c]" />
    </div>
  );
  if (type === 'RYO_ROLL') return (
    <div className={cn(base, 'w-16 bg-neutral-800', active ? 'ring-2 ring-white/40' : 'opacity-40')}>
      <div className="h-full w-3/4 bg-[#FAFAFA]" />
      <div className="h-full flex-1 bg-[#262626]" />
    </div>
  );
  if (type === 'JOINT_KING') return (
    <div className={cn(base, 'w-16 bg-neutral-800', active ? 'ring-2 ring-emerald-500/50' : 'opacity-40')}>
      <div className="h-full w-3/4 bg-[#FAFAFA]" />
      <div className="h-full flex-1 bg-gradient-to-b from-[#10b981] to-[#047857]" />
    </div>
  );
  return (
    <div className={cn('w-6 h-6 rounded-full border-[3px] flex items-center justify-center', active ? 'border-accent scale-110' : 'border-white/10 opacity-40')}>
      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
    </div>
  );
};

export const ProtocolForm = ({ isOpen, onClose, onApply, title, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [limit, setLimit] = useState(initialData?.limit || 20);
  const [type, setType] = useState(initialData?.type || 'CIGARETTE');
  const [pricePerUnit, setPricePerUnit] = useState(initialData?.pricePerUnit || 0);
  const [isFinanciallyTracked, setIsFinanciallyTracked] = useState(initialData?.isFinanciallyTracked ?? true);
  const [isPrimaryTracked, setIsPrimaryTracked] = useState(initialData?.isPrimaryTracked ?? true);
  const [calcMode, setCalcMode] = useState(null);
  const [packPrice, setPackPrice] = useState('');
  const [packSize, setPackSize] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialData?.name || '');
    setLimit(initialData?.limit ?? 20);
    setType(initialData?.type || 'CIGARETTE');
    setPricePerUnit(initialData?.pricePerUnit ?? 0);
    setIsFinanciallyTracked(initialData?.isFinanciallyTracked ?? true);
    setIsPrimaryTracked(initialData?.isPrimaryTracked ?? true);
    setCalcMode(null);
    setPackPrice('');
    setPackSize('');
  }, [isOpen, initialData]);

  const TYPES = [
    { id: 'CIGARETTE', label: 'Cigarette' },
    { id: 'RYO_ROLL', label: 'Ryo Roll' },
    { id: 'JOINT_KING', label: 'Joint' },
    { id: 'SIMPLE', label: 'Simple' },
  ];

  useEffect(() => {
    if (calcMode && packPrice && packSize && packSize > 0) {
      setPricePerUnit((parseFloat(packPrice) / parseInt(packSize)).toFixed(3));
    }
  }, [packPrice, packSize, calcMode]);

  const handleSubmit = async () => {
    const cleanName = sanitizeStringInput(name);
    if (!cleanName || saving) return;
    setSaving(true);
    try {
      await onApply({
        name: cleanName,
        limit: Math.round(sanitizeNumericInput(limit, 1, 1000)),
        type: sanitizeStringInput(type, 20),
        isFinanciallyTracked: !!isFinanciallyTracked,
        isPrimaryTracked: !!isPrimaryTracked,
        pricePerUnit: sanitizeNumericInput(pricePerUnit, 0, 100),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose}>
      {(titleId) => (
        <div
          className="bg-[#0a0a0c]/95 border border-white/[0.1] rounded-[40px] w-full max-w-[480px] p-6 md:p-10 shadow-2xl flex flex-col gap-6 mx-auto"
          style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 20px 100px rgba(0,0,0,0.95)' }}
        >
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Protocol</h3>
              <span id={titleId} className="text-2xl font-[900] tracking-tighter uppercase text-[#FAFAFA] leading-none">{title}</span>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-500 hover:text-[#FAFAFA]"><X size={20} strokeWidth={3} /></button>
          </div>

          <div className="grid grid-cols-[1fr,110px] gap-4">
            <div className="space-y-2">
              <span className={UI.LABEL}>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marlboro Red" className={cn(UI.INPUT, 'h-12 w-full bg-black/40')} />
            </div>
            <div className="space-y-2 text-center">
              <span className={UI.LABEL}>Daily limit</span>
              <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className={cn(UI.INPUT, 'h-12 text-center w-full bg-black/40 tabular-nums')} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={UI.LABEL}>Tracker type</span>
              <button type="button" onClick={() => setIsPrimaryTracked(!isPrimaryTracked)} className={cn('flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase', isPrimaryTracked ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-white/5 border-white/10 text-white/30')}>
                {isPrimaryTracked ? 'Primary tracker' : 'Secondary only'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map((t) => (
                <button type="button" key={t.id} onClick={() => setType(t.id)} className={cn('flex flex-col items-center gap-3 p-3.5 rounded-2xl border', type === t.id ? 'bg-white/[0.04] border-accent/50' : 'border-white/5 opacity-50')}>
                  <MiniGauge type={t.id} active={type === t.id} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Economy</span>
              <div className="flex bg-black/60 p-1 rounded-xl border border-white/5">
                <button type="button" onClick={() => setCalcMode(calcMode === 'PACK' ? null : 'PACK')} className={cn('px-4 py-1.5 rounded-lg text-[9px] font-black uppercase', calcMode === 'PACK' ? 'bg-accent text-zinc-950' : 'text-neutral-500')}>Pack</button>
                <button type="button" onClick={() => setCalcMode(calcMode === 'ROLL' ? null : 'ROLL')} className={cn('px-4 py-1.5 rounded-lg text-[9px] font-black uppercase', calcMode === 'ROLL' ? 'bg-accent text-zinc-950' : 'text-neutral-500')}>Ryo</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {calcMode ? (
                <>
                  <input type="number" value={packPrice} onChange={(e) => setPackPrice(e.target.value)} className={cn(UI.INPUT, 'h-11 text-xs flex-1 bg-black/40')} placeholder="Price €" />
                  <input type="number" value={packSize} onChange={(e) => setPackSize(e.target.value)} className={cn(UI.INPUT, 'h-11 text-xs w-28 bg-black/40')} placeholder="Qty" />
                </>
              ) : (
                <input type="number" step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className={cn(UI.INPUT, 'h-11 text-xs flex-1 bg-black/40')} placeholder="Unit Price (€)" />
              )}
              <button type="button" onClick={() => setIsFinanciallyTracked(!isFinanciallyTracked)} className={cn('w-11 h-11 rounded-xl border flex items-center justify-center', isFinanciallyTracked ? 'bg-accent border-accent text-zinc-950' : 'bg-white/5 border-white/10 text-white/20')} aria-label="Toggle financial tracking">
                <Hash size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={saving} className="w-full h-16 text-[11px] font-black uppercase tracking-[0.4em]">{saving ? 'Saving…' : 'Save protocol'}</Button>
        </div>
      )}
    </ModalFrame>
  );
};
