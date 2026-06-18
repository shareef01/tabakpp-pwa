import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Layout, Square, Grid2X2, LayoutGrid } from 'lucide-react';
import { auth } from '../../firebase';
import { cn } from '../../utils/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TopBanner Header
 * Refined branding and profile button aesthetics.
 */
export const TopBanner = ({ user, onNavigate, widgetSize, onUpdateSettings, onRequestLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const SIZE_ICONS = {
    SMALL: Square,
    MEDIUM: Grid2X2,
    LARGE: LayoutGrid
  };

  return (
    <header className="sticky top-0 z-[200] w-full px-6 py-4 md:px-10 lg:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-neutral-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-[32px] px-8 h-20 shadow-2xl">

        {/* LOGO: Corrected centering and refined typography */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_var(--accent-glow)] relative shrink-0">
            <span className="text-zinc-950 font-[1000] text-xl leading-none select-none flex items-center justify-center mt-[-1px]">
              +
            </span>
          </div>
          <span className="text-2xl font-[1000] tracking-tighter text-white uppercase italic select-none">
            TABAK
          </span>
        </div>

        {/* CONTROLS: Refined View Toggle and Profile */}
        <div className="flex items-center gap-4 md:gap-8 h-full">

          {/* VIEW TOGGLE: Sleeker Segmented Control */}
          <div className="hidden md:flex bg-black/60 border border-white/5 rounded-full p-1.5 gap-1 h-12 items-center">
            {['SMALL', 'MEDIUM', 'LARGE'].map((size) => {
              const Icon = SIZE_ICONS[size];
              return (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ widgetSize: size })}
                  className={cn(
                    "w-10 h-full rounded-full flex items-center justify-center transition-all duration-500",
                    widgetSize === size
                      ? "bg-white text-zinc-950 shadow-lg scale-105"
                      : "text-neutral-500 hover:text-white/80"
                  )}
                  title={size}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </button>
              );
            })}
          </div>

          <div className="h-8 w-px bg-white/5 hidden md:block" />

          {/* PROFILE BUTTON: Integrated Pill Design */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "group relative h-12 flex items-center gap-2 pl-2 pr-4 rounded-full transition-all duration-500",
                "bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 active:scale-95",
                isOpen && "bg-white/[0.08] border-white/20 shadow-xl"
              )}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 bg-neutral-800">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <User size={16} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest truncate max-w-[80px]">
                  {user?.displayName?.split(' ')[0] || 'Me'}
                </span>
              </div>

              <ChevronDown size={12} className={cn("text-white/30 transition-transform duration-500", isOpen && "rotate-180 text-white/60")} />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-64 bg-[#0a0a0c] border border-white/10 rounded-[32px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden isolate"
                >
                  <div className="flex items-center gap-4 p-3 mb-4 bg-white/[0.02] rounded-2xl border border-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 overflow-hidden">
                      {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <User size={20} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-[1000] text-white truncate uppercase tracking-tight leading-none">
                        {user?.displayName || 'User'}
                      </span>
                      <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest truncate mt-1">
                        Manage Account
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <DropdownItem icon={Layout} label="Track" onClick={() => { onNavigate('track'); setIsOpen(false); }} />
                    <DropdownItem icon={LogOut} label="Log Out" onClick={() => { onRequestLogout(); setIsOpen(false); }} danger />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownItem = ({ icon: Icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
      danger
        ? "text-rose-500 hover:bg-rose-500/10"
        : "text-neutral-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon size={16} strokeWidth={2.5} />
    {label}
  </button>
);
