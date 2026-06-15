import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Check, Plus, ArrowUp, ArrowDown, Crown, Activity, Zap, Edit2, Trash2, Camera, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Card, Input, Button } from '../Common';
import { cn } from '../../utils/utils';
import { sanitizeString } from '../../utils/security';
import { ConfirmModal } from '../modals/ConfirmModal';

const ACCENTS = [
  { n: 'Crimson', v: '#FB7185' }, { n: 'Lime', v: '#D4FF32' }, { n: 'Cobalt', v: '#00D2FF' },
  { n: 'Amber', v: '#FBBF24' }, { n: 'Emerald', v: '#4ADE80' }, { n: 'Violet', v: '#A78BFA' }
];

/**
 * Optimized Protocol Item
 */
const ProtocolListItem = React.memo(({ config, idx, total, onReo, onEdit, onDel }) => (
  <div className="flex flex-row items-center w-full p-4 bg-black/30 rounded-2xl border border-white/5 group hover:border-white/10 transition-all duration-300 gap-4">
    <div className="flex flex-col gap-1 shrink-0">
      <button onClick={() => onReo(config.id, 'up')} disabled={idx === 0} className="text-neutral-600 hover:text-accent disabled:opacity-0 transition-colors"><ArrowUp size={16} strokeWidth={3} /></button>
      <button onClick={() => onReo(config.id, 'down')} disabled={idx === total - 1} className="text-neutral-600 hover:text-accent disabled:opacity-0 transition-colors"><ArrowDown size={16} strokeWidth={3} /></button>
    </div>
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-accent/80 shrink-0 shadow-inner">
      {config.type.startsWith('JOINT') ? <Crown size={20} /> : (config.type === 'SIMPLE' ? <Activity size={20} /> : <Zap size={20} />)}
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-sm font-bold text-white uppercase tracking-tight truncate leading-tight">{config.name}</span>
      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Limit: {config.limit}</span>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={() => onEdit(config)} className="p-2.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-all"><Edit2 size={16} /></button>
      <button onClick={onDel} className="p-2.5 rounded-lg text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"><Trash2 size={16} /></button>
    </div>
  </div>
));

export const SettingsScreen = ({ configs, user, settings, onAdd, onReo, onEditP, onUpd, onDel }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [localAccent, setLocalAccent] = useState(settings.accent);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(settings.avatar || user?.photoURL || null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // Sync internal previewUrl state when external cloud settings change
  useEffect(() => {
    setPreviewUrl(settings.avatar || user?.photoURL || null);
  }, [settings.avatar, user?.photoURL]);

  const handlePfpUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    if (file.size > 500 * 1024) {
      alert("Image too large. Max 500KB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setPreviewUrl(base64);
      try {
        await updateDoc(doc(db, 'users', user.uid), { avatar: base64 });
        await updateProfile(auth.currentUser, { photoURL: base64 });
      } catch (err) {
        alert("Upload Sync Failed.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePfp = async () => {
    setIsUploading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { avatar: null });
      await updateProfile(auth.currentUser, { photoURL: null });
      setPreviewUrl(null);
      setShowRemoveConfirm(false);
    } catch (err) {
      alert("Removal Failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const cleanName = sanitizeString(displayName);
    if (!cleanName) return;
    try {
      await updateProfile(auth.currentUser, { displayName: cleanName });
      await updateDoc(doc(db, 'users', user.uid), { name: cleanName });
      alert("Profile Saved.");
    } catch (e) {
      alert("Update Failed.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 lg:px-8 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24">

        {/* LEFT COLUMN: Identity & Appearance */}
        <div className="lg:col-span-5 space-y-8">

          {/* IDENTITY CARD */}
          <section className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 lg:p-10 shadow-xl relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-10">Display Identity</h3>

            <div className="flex flex-col items-center gap-10">
              <input type="file" ref={fileInputRef} onChange={handlePfpUpload} className="hidden" accept="image/*" />

              {/* Avatar Zone */}
              <div className="relative group">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-36 h-32 rounded-[40px] bg-accent/5 border border-accent/20 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all hover:border-accent/40"
                >
                  {isUploading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                  )}
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={50} className="text-accent" strokeWidth={2.5} />
                  )}
                </button>
                {!isUploading && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-zinc-950 border-4 border-[#0a0a0c] pointer-events-none">
                    <Camera size={18} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full">
                <Button variant="secondary" className="flex-1 h-16 text-[10px]" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  Update
                </Button>
                <Button variant="danger" className="flex-1 h-16 text-[10px]" onClick={() => setShowRemoveConfirm(true)} disabled={isUploading || !previewUrl}>
                  Remove
                </Button>
              </div>

              <div className="w-full space-y-8 pt-8 border-t border-white/5">
                <Input label="User Handle" value={displayName} onChange={setDisplayName} isDark />
                <Button className="w-full h-16" onClick={handleUpdateProfile}>
                  Apply Changes
                </Button>
              </div>
            </div>
          </section>

          {/* APPEARANCE CARD */}
          <section className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 lg:p-10 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-8">Appearance</h3>
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                {ACCENTS.map(x => (
                  <button key={x.v} onClick={() => setLocalAccent(x.v)} className={cn("h-14 rounded-2xl border-2 transition-all relative flex items-center justify-center", localAccent === x.v ? "border-white scale-105 shadow-xl" : "border-white/5 opacity-40 hover:opacity-100")} style={{ backgroundColor: x.v }}>
                    {localAccent === x.v && <Check size={20} className="text-white" strokeWidth={4} />}
                  </button>
                ))}
              </div>
              <Button variant="secondary" className="w-full" onClick={() => onUpd({ accent: localAccent })}>
                Save Global Theme
              </Button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Registry Management */}
        <div className="lg:col-span-7 h-full">
          <section className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 lg:p-10 shadow-xl min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div className="space-y-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Registry Management</h3>
                 <span className="text-2xl font-[1000] tracking-tighter uppercase text-white block">Active Counters</span>
               </div>
               <button onClick={onAdd} className="w-14 h-14 bg-accent text-zinc-950 rounded-2xl shadow-xl active:scale-90 transition-all flex items-center justify-center hover:rotate-90">
                 <Plus size={28} strokeWidth={3} />
               </button>
            </div>

            <div className="space-y-4 flex-1">
              {configs.length > 0 ? configs.sort((a,b)=>a.order-b.order).map((c, idx) => (
                <ProtocolListItem key={c.id} config={c} idx={idx} total={configs.length} onReo={onReo} onEdit={onEditP} onDel={() => onDel(c.id)} />
              )) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-neutral-600 space-y-4 border-2 border-dashed border-white/5 rounded-[32px]">
                  <Zap size={48} className="opacity-20" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">No active counters</span>
                </div>
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-white/5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600 text-center leading-relaxed">
                Changes to counters are synchronized in real-time across all active sessions.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* CONFIRMATION OVERLAY */}
      <ConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemovePfp}
        title="Purge Identity?"
        message="This will permanently delete your profile photo from the secure vault."
        confirmText="Confirm Purge"
      />

    </motion.div>
  );
};
