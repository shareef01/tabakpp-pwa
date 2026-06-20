import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Layers, Plus, Trash2, Edit3, ChevronUp, ChevronDown, Check, Camera, Palette, Square, Grid2X2, LayoutGrid, Calculator, Target, Sunrise } from 'lucide-react';
import { DEFAULT_DAY_START_HOUR, hasOpenSession, sanitizeStringInput } from '../../utils/logic';
import { UI } from '../../constants/ui';
import { Input } from '../../components/ui/Input';
import { ConfirmModal } from '../shared/ConfirmModal';
import { cn } from '../../utils/system';
import { prepareAvatarDataUrl } from '../../api/avatarService';

const SETTINGS_COLUMNS =
  'settings-columns flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4 lg:gap-5 w-full max-w-6xl mx-auto';

const SettingsColumn = ({ children }) => (
  <div className="settings-column flex flex-col gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0 w-full">
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/[0.06] rounded-xl text-white border border-white/10 flex items-center justify-center shadow-inner shrink-0">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <span className="text-lg sm:text-xl font-[900] tracking-tight uppercase text-white leading-tight">{title}</span>
  </div>
);

const FieldLabel = ({ children }) => (
  <span className="settings-field-label">{children}</span>
);

const FieldHint = ({ children }) => (
  <p className="settings-field-hint">{children}</p>
);

const SettingsGroup = ({ children, className }) => (
  <section className={cn('settings-card backdrop-blur-3xl border rounded-[20px] sm:rounded-[24px] md:rounded-[28px] p-4 sm:p-5 md:p-6 w-full', className)}>
    {children}
  </section>
);

export const SettingsScreen = React.memo(({ configs = [], user, settings = {}, activeCounts = {}, onAdd, onReo, onEditP, onUpd, onDel, onError, onPreviewDayStart }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const sessionOpen = hasOpenSession(activeCounts);

  const [purchaseType, setPurchaseType] = useState(settings?.purchaseType || 'PACK');
  const [pouchPrice, setPouchPrice] = useState(settings?.pouchPrice || 0);
  const [estimatedYield, setEstimatedYield] = useState(settings?.estimatedYield || 20);
  const [dayStartHour, setDayStartHour] = useState(settings?.dayStartHour ?? DEFAULT_DAY_START_HOUR);
  const [savingDayStart, setSavingDayStart] = useState(false);

  const saveSettings = async (patch) => {
    if (typeof onUpd !== 'function') return;
    try {
      await onUpd(patch);
    } catch (err) {
      onError?.(err?.message || 'Settings update failed');
      throw err;
    }
  };

  useEffect(() => {
    if (settings?.pouchPrice !== undefined) setPouchPrice(settings.pouchPrice);
    if (settings?.estimatedYield !== undefined) setEstimatedYield(settings.estimatedYield);
    if (settings?.dayStartHour !== undefined) setDayStartHour(settings.dayStartHour);
    if (settings?.purchaseType) setPurchaseType(settings.purchaseType);
  }, [settings?.pouchPrice, settings?.estimatedYield, settings?.dayStartHour, settings?.purchaseType]);

  useEffect(() => {
    if (user?.displayName) setNewName(user.displayName);
  }, [user?.displayName]);

  const calculatedUnitPrice = useMemo(() => {
    const price = parseFloat(pouchPrice) || 0;
    const yieldCount = parseInt(estimatedYield) || 1;
    if (yieldCount > 0) return (price / yieldCount).toFixed(3);
    return '0.000';
  }, [pouchPrice, estimatedYield]);

  const hasChanges = useMemo(() => {
    const currentPrice = parseFloat(calculatedUnitPrice);
    const saved = settings?.unitPrice || 0;
    return Math.abs(currentPrice - saved) > 0.0005;
  }, [calculatedUnitPrice, settings?.unitPrice]);

  const handleSavePrice = async () => {
    await saveSettings({
      pouchPrice,
      estimatedYield,
      unitPrice: parseFloat(calculatedUnitPrice),
      purchaseType,
      lastPriceUpdate: Date.now(),
    });
  };

  const persistDayStartHour = async (hour) => {
    const value = Math.max(0, Math.min(23, Number(hour) || 0));
    setSavingDayStart(true);
    try {
      await saveSettings({ dayStartHour: value });
      onPreviewDayStart?.(null);
    } finally {
      setSavingDayStart(false);
    }
  };

  const SIZE_ICONS = { SMALL: Square, MEDIUM: Grid2X2, LARGE: LayoutGrid };

  const sortedConfigs = useMemo(() => {
    if (!Array.isArray(configs)) return [];
    return [...configs].sort((a, b) => (a?.order || 0) - (b?.order || 0));
  }, [configs]);

  const ACCENT_OPTIONS = [
    { name: 'Salmon Core', hex: '#FF5F5F' },
    { name: 'Neon Cyber', hex: '#00D1FF' },
    { name: 'Volt Lime', hex: '#D4FF32' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Rose Metal', hex: '#FF4B4B' },
    { name: 'Royal Resin', hex: '#8B5CF6' },
    { name: 'Deep Sage', hex: '#10B981' },
    { name: 'Amber Glow', hex: '#F59E0B' },
    { name: 'Steel Blue', hex: '#6366F1' },
    { name: 'Raw Slate', hex: '#94A3B8' },
  ];

  const formatHourLabel = (hour) => {
    const h = Number(hour) || 0;
    const period = h >= 12 ? 'PM' : 'AM';
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${period}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="settings-page w-full"
    >
      <div className={SETTINGS_COLUMNS}>
        <SettingsColumn>
        <SettingsGroup>
          <SectionHeader icon={User} title="Identity" />
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[28px] overflow-hidden border-2 border-white/5 shadow-2xl relative bg-neutral-900">
                {isUpdating && (
                  <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center text-[9px] font-black uppercase text-white/60">
                    Uploading…
                  </div>
                )}
                {settings?.avatar || user?.photoURL ? (
                  <img src={settings?.avatar || user?.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <User size={40} className="sm:w-12 sm:h-12" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera size={22} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f || !user?.uid) return;
                      setIsUpdating(true);
                      try {
                        const avatar = await prepareAvatarDataUrl(f);
                        await onUpd?.({ avatar });
                      } catch (err) {
                        onError?.(err?.message || 'Avatar upload failed');
                      } finally {
                        setIsUpdating(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start gap-3 sm:gap-4 w-full">
              {isEditingName ? (
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <Input value={newName} onChange={setNewName} isDark className="flex-1" />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await saveSettings({ name: sanitizeStringInput(newName, 80) });
                        setIsEditingName(false);
                      } catch {
                        /* error surfaced via banner */
                      }
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent text-zinc-950 flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0"
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl md:text-3xl font-[900] tracking-tighter text-white uppercase truncate">
                      {settings?.name || user?.displayName || 'User'}
                    </span>
                    <button type="button" onClick={() => setIsEditingName(true)} className="text-white/10 hover:text-accent transition-all shrink-0">
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 lowercase block truncate">
                    {user?.email}
                  </span>
                </div>
              )}
              <div className={cn(
                'px-3 sm:px-4 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-bold uppercase tracking-wide',
                sessionOpen ? 'bg-accent/5 border-accent/10 text-accent' : 'bg-white/[0.03] border-white/10 text-zinc-400'
              )}>
                {sessionOpen ? 'Open Session' : 'Session Clear'}
              </div>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup>
          <SectionHeader icon={CreditCard} title="Economics" />
          <div className="space-y-3 sm:space-y-4">
            <div className="flex bg-black/60 border border-white/5 rounded-xl p-1 gap-1 h-10 sm:h-11">
              <button
                type="button"
                onClick={async () => {
                  setPurchaseType('PACK');
                  try {
                    await saveSettings({ purchaseType: 'PACK' });
                  } catch {
                    setPurchaseType(settings?.purchaseType || 'PACK');
                  }
                }}
                className={cn(
                  'flex-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all',
                  purchaseType === 'PACK' ? 'bg-white/5 text-white' : 'text-white/10 hover:text-white/20'
                )}
              >
                Standard Pack
              </button>
              <button
                type="button"
                onClick={async () => {
                  setPurchaseType('RYO');
                  try {
                    await saveSettings({ purchaseType: 'RYO' });
                  } catch {
                    setPurchaseType(settings?.purchaseType || 'PACK');
                  }
                }}
                className={cn(
                  'flex-1 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all',
                  purchaseType === 'RYO' ? 'bg-white/5 text-white' : 'text-white/10 hover:text-white/20'
                )}
              >
                RYO Pouch
              </button>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel>{purchaseType === 'PACK' ? 'Pack Price' : 'Pouch Price'}</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={pouchPrice}
                    onChange={(e) => setPouchPrice(e.target.value)}
                    className={cn(UI.INPUT, 'h-11 sm:h-12 w-full pl-10 text-sm')}
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-xs">€</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel>{purchaseType === 'PACK' ? 'Unit Count' : 'Est. Yield'}</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    value={estimatedYield}
                    onChange={(e) => setEstimatedYield(e.target.value)}
                    className={cn(UI.INPUT, 'h-11 sm:h-12 w-full pl-10 text-sm')}
                  />
                  <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <Calculator size={15} className="text-accent shrink-0" />
                  <span className="settings-field-label truncate">Derived Unit Price</span>
                </div>
                <span className="text-base sm:text-lg font-[900] text-white tabular-nums tracking-tighter shrink-0">
                  {calculatedUnitPrice} €
                </span>
              </div>
              <button
                type="button"
                disabled={!hasChanges}
                onClick={handleSavePrice}
                className={cn(
                  'w-full h-10 sm:h-11 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all active:scale-[0.98] leading-none',
                  hasChanges
                    ? 'bg-accent text-zinc-950 hover:brightness-105 shadow-[0_0_20px_-4px_rgba(var(--accent-rgb),0.3)]'
                    : 'bg-white/[0.04] text-zinc-500 border border-white/[0.08] opacity-70 cursor-not-allowed'
                )}
              >
                Apply Global Calibration
              </button>
            </div>
          </div>
        </SettingsGroup>
        </SettingsColumn>

        <SettingsColumn>
        <SettingsGroup>
          <SectionHeader icon={Palette} title="Interface" />
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-2.5">
              <FieldLabel>Accent Matrix</FieldLabel>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.hex}
                    type="button"
                    onClick={() => saveSettings({ accent: opt.hex }).catch(() => {})}
                    className={cn(
                      'w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-300',
                      settings?.accent === opt.hex ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent opacity-40 hover:opacity-100'
                    )}
                    style={{ backgroundColor: opt.hex }}
                    aria-label={opt.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-2.5">
              <FieldLabel>Day Starts At</FieldLabel>
              <FieldHint>
                Before this hour, activity counts toward the previous tracking day. Use End Day to archive and reset counters.
              </FieldHint>
              <div className="flex items-center gap-3 sm:gap-4 py-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/[0.04] rounded-xl text-accent border border-white/5 flex items-center justify-center shrink-0">
                  <Sunrise size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="range"
                  min={0}
                  max={23}
                  step={1}
                  value={dayStartHour}
                  onChange={(e) => {
                    const hour = Number(e.target.value);
                    setDayStartHour(hour);
                    onPreviewDayStart?.(hour);
                  }}
                  onMouseUp={(e) => persistDayStartHour(Number(e.currentTarget.value))}
                  onTouchEnd={(e) => persistDayStartHour(Number(e.currentTarget.value))}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') persistDayStartHour(Number(e.currentTarget.value));
                  }}
                  disabled={savingDayStart}
                  className="flex-1 accent-accent h-2.5 min-w-0 cursor-pointer"
                />
                <span className="text-sm sm:text-base font-[900] text-white tabular-nums min-w-[4.5rem] sm:min-w-[5.5rem] text-right shrink-0">
                  {formatHourLabel(dayStartHour)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <FieldLabel>Geometry Matrix</FieldLabel>
              <div className="flex bg-black/60 border border-white/5 rounded-2xl p-1 gap-1 h-10 sm:h-11">
                {['SMALL', 'MEDIUM', 'LARGE'].map((size) => {
                  const Icon = SIZE_ICONS[size];
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => saveSettings({ widgetSize: size }).catch(() => {})}
                      className={cn(
                        'flex-1 rounded-xl flex items-center justify-center transition-all',
                        settings?.widgetSize === size ? 'bg-white text-zinc-950' : 'text-white/20 hover:text-white/40'
                      )}
                      aria-label={`Widget size ${size}`}
                    >
                      <Icon size={16} strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/[0.04] rounded-xl text-white border border-white/5 flex items-center justify-center shadow-inner shrink-0">
                <Layers size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-lg sm:text-xl font-[900] tracking-tight uppercase text-white leading-tight truncate">Protocols</span>
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-accent text-zinc-950 flex items-center justify-center shadow-lg active:scale-90 transition-all hover:brightness-110 shrink-0"
              aria-label="Add protocol"
            >
              <Plus size={20} strokeWidth={3.5} />
            </button>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            {sortedConfigs.length > 0 ? sortedConfigs.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => onReo?.(c.id, 'up')} className="text-white/10 hover:text-white transition-colors" aria-label="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => onReo?.(c.id, 'down')} className="text-white/10 hover:text-white transition-colors" aria-label="Move down">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base font-[900] text-white uppercase tracking-tight block truncate">{c.name}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Limit: {c.limit}</span>
                    {(c.pricePerUnit || 0) > 0 && (
                      <span className="text-[11px] font-semibold text-accent/80 uppercase tracking-wide">{c.pricePerUnit}€ / unit</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button type="button" onClick={() => onEditP?.(c)} className="p-2 sm:p-2.5 rounded-xl bg-white/5 text-neutral-500 hover:text-white transition-all" aria-label="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(c.id)} className="p-2 sm:p-2.5 rounded-xl bg-white/5 text-neutral-500 hover:text-rose-500 transition-all" aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-zinc-600 text-xs font-medium border-2 border-dashed border-white/10 rounded-xl sm:rounded-2xl">
                No protocols yet — tap + to add one
              </div>
            )}
          </div>
        </SettingsGroup>
        </SettingsColumn>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await onDel?.(deleteTarget);
            setDeleteTarget(null);
          } catch { /* error surfaced by hook */ }
        }}
        title="Delete Protocol?"
        message="This removes the tracker and its configuration permanently."
        confirmText="Delete"
      />
    </motion.div>
  );
});
