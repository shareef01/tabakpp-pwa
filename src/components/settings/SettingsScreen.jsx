import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Layers, Plus, Trash2, Edit3, ChevronUp, ChevronDown, Check, X, Camera, Palette, Square, Grid2X2, LayoutGrid, Shield, Calculator, DollarSign, Target } from 'lucide-react';
import { UI, Input, Button } from '../Common';
import { cn, compressImage } from '../../utils/utils';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-10 h-10 bg-white/[0.05] rounded-2xl text-white border border-white/10 flex items-center justify-center shadow-inner"><Icon size={20} strokeWidth={2.5} /></div>
    <span className="text-xl font-[1000] tracking-tighter uppercase text-white leading-none">{title}</span>
  </div>
);

const SettingsGroup = ({ children, className }) => (
  <div className={cn("bg-neutral-900/40 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col h-full", className)}>
    {children}
  </div>
);

export const SettingsScreen = React.memo(({ configs, user, settings, onAdd, onReo, onEditP, onUpd, onDel }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isUploading, setIsUpdating] = useState(false);

  const [purchaseType, setPurchaseType] = useState('PACK');
  const [pouchPrice, setPouchPrice] = useState(settings.pouchPrice || 0);
  const [estimatedYield, setEstimatedYield] = useState(settings.estimatedYield || 20);

  const calculatedUnitPrice = useMemo(() => {
    if (estimatedYield > 0) return (pouchPrice / estimatedYield).toFixed(3);
    return "0.000";
  }, [pouchPrice, estimatedYield]);

  const hasChanges = useMemo(() => {
    const currentPrice = parseFloat(calculatedUnitPrice);
    return currentPrice !== (settings.unitPrice || 0);
  }, [calculatedUnitPrice, settings.unitPrice]);

  const handleSavePrice = () => {
    onUpd({
      pouchPrice,
      estimatedYield,
      unitPrice: parseFloat(calculatedUnitPrice),
      lastPriceUpdate: Date.now()
    });
  };

  const SIZE_ICONS = { SMALL: Square, MEDIUM: Grid2X2, LARGE: LayoutGrid };

  // SAFETY: Copy configs before sorting to avoid mutating frozen Firestore data
  const sortedConfigs = useMemo(() => [...configs].sort((a,b) => a.order - b.order), [configs]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-32">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <SettingsGroup>
          <SectionHeader icon={User} title="Account" />
          <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl relative bg-neutral-800">
                {settings.avatar || user?.photoURL ? <img src={settings.avatar || user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><User size={48} /></div>}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera size={24} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => { const f = e.target.files[0]; if (f) { setIsUpdating(true); try { const c = await compressImage(f, 200, 200); await onUpd({ avatar: c }); } finally { setIsUpdating(false); } } }} />
                </label>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start space-y-6">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full"><Input value={newName} onChange={setNewName} isDark className="flex-1" /><button onClick={() => { onUpd({ name: newName }); setIsEditingName(false); }} className="w-12 h-12 rounded-2xl bg-accent text-zinc-950 flex items-center justify-center"><Check size={20} strokeWidth={3} /></button></div>
              ) : (
                <div className="space-y-2 w-full truncate text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3"><span className="text-3xl font-[1000] tracking-tighter text-white uppercase truncate">{user?.displayName || 'User'}</span><button onClick={() => setIsEditingName(true)} className="text-white/40 hover:text-accent transition-all"><Edit3 size={16} /></button></div>
                  <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest block break-all leading-tight">{user?.email}</span>
                </div>
              )}
              <div className="flex gap-3"><div className="px-4 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">Active</div><div className="px-4 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">Level 4</div></div>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup>
          <SectionHeader icon={Palette} title="Appearance" />
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-4">
              <span className={UI.LABEL}>Accent Color</span>
              <div className="grid grid-cols-8 gap-2">
                {['#00D1FF', '#D4FF32', '#F87171', '#C084FC', '#FB923C', '#F472B6', '#2DD4BF', '#94A3B8'].map(c => (
                  <button key={c} onClick={() => onUpd({ accent: c })} className={cn("w-8 h-8 rounded-full border-4 transition-all", settings.accent === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100")} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className={UI.LABEL}>Widget Size</span>
              <div className="flex bg-black/40 border border-white/5 rounded-full p-1 gap-1">
                {['SMALL', 'MEDIUM', 'LARGE'].map((size) => {
                  const Icon = SIZE_ICONS[size];
                  return <button key={size} onClick={() => onUpd({ widgetSize: size })} className={cn("flex-1 h-12 rounded-full flex items-center justify-center transition-all", settings.widgetSize === size ? "bg-white text-zinc-950 shadow-lg" : "text-white/40 hover:text-white")}><Icon size={16} strokeWidth={2.5} /></button>;
                })}
              </div>
            </div>
          </div>
        </SettingsGroup>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <SettingsGroup>
          <div className="flex justify-between items-start mb-8"><SectionHeader icon={Layers} title="Registry" /><button onClick={onAdd} className="w-10 h-10 rounded-2xl bg-accent text-zinc-950 flex items-center justify-center shadow-lg active:scale-90 transition-all"><Plus size={24} strokeWidth={3} /></button></div>
          <div className="space-y-3 overflow-y-auto max-h-[320px] flex-1 pr-2 custom-scrollbar">
            {sortedConfigs.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
                <div className="flex flex-col gap-0.5"><button onClick={() => onReo(c.id, 'up')} className="text-white/20 hover:text-white"><ChevronUp size={14} /></button><button onClick={() => onReo(c.id, 'down')} className="text-white/20 hover:text-white"><ChevronDown size={14} /></button></div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-black text-white uppercase tracking-tight block truncate">{c.name}</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Limit: {c.limit}</span>
                    {c.isFinanciallyTracked && <span className="text-[9px] font-black text-accent/60 uppercase tracking-widest">${c.pricePerUnit || settings.unitPrice}/u</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onEditP(c)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all"><Edit3 size={16} strokeWidth={2.5} /></button>
                  <button onClick={() => onDel(c.id)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-rose-500 transition-all"><Trash2 size={16} strokeWidth={2.5} /></button>
                </div>
              </div>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup>
          <SectionHeader icon={CreditCard} title="Economics" />
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1 gap-1 h-12">
               <button onClick={() => setPurchaseType('PACK')} className={cn("flex-1 rounded-xl text-[9px] font-[1000] uppercase tracking-widest transition-all", purchaseType === 'PACK' ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50")}>Standard Pack</button>
               <button onClick={() => setPurchaseType('RYO')} className={cn("flex-1 rounded-xl text-[9px] font-[1000] uppercase tracking-widest transition-all", purchaseType === 'RYO' ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50")}>RYO Pouch</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className={UI.LABEL}>{purchaseType === 'PACK' ? 'Pack Price' : 'Pouch Price'}</span>
                <div className="relative">
                  <input type="number" step="0.01" value={pouchPrice} onChange={(e) => setPouchPrice(parseFloat(e.target.value) || 0)} className={cn(UI.INPUT, "w-full pl-10")} />
                  <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className={UI.LABEL}>{purchaseType === 'PACK' ? 'Cigarettes / Pack' : 'Estimated Yield'}</span>
                <div className="relative">
                  <input type="number" value={estimatedYield} onChange={(e) => setEstimatedYield(parseInt(e.target.value) || 1)} className={cn(UI.INPUT, "w-full pl-10")} />
                  <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3"><Calculator size={16} className="text-accent" /><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Derived Unit Price</span></div>
                  <span className="text-2xl font-[1000] text-white tabular-nums">${calculatedUnitPrice}</span>
               </div>
               <Button variant={hasChanges ? 'primary' : 'secondary'} disabled={!hasChanges} onClick={handleSavePrice} className="w-full">Commit Economic Update</Button>
            </div>
          </div>
        </SettingsGroup>
      </div>

    </motion.div>
  );
});
