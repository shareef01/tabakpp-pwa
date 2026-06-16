import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Layout, Grid, Maximize } from 'lucide-react';
import { auth } from '../../firebase';
import { cn } from '../../utils/utils';

/**
 * TopBanner Header
 * Refined with professional pill-geometry and high-fidelity glass.
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

  return (
    <header className="sticky top-0 z-[200] w-full px-6 py-4 md:px-10 lg:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-neutral-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-[32px] px-6 h-20 shadow-2xl">

        {/* BRAND IDENTITY */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]" />
            <span className="text-xl font-[1000] tracking-tighter text-white uppercase italic">
              TABAK<span className="text-accent opacity-80">++</span>
            </span>
          </div>
          <span className="text-[9px] font-black tracking-[0.5em] text-neutral-500 uppercase ml-4 -mt-1 opacity-60">
            Premium Beta
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* LAYOUT ENGINE TOGGLE (Desktop Only Pill) */}
          <div className="hidden md:flex bg-black/40 border border-white/5 rounded-full p-1 gap-1">
            {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
              <button
                key={size}
                onClick={() => onUpdateSettings({ widgetSize: size })}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                  widgetSize === size
                    ? "bg-white text-zinc-950 shadow-xl scale-105"
                    : "text-neutral-500 hover:text-white"
                )}
              >
                {size}
              </button>
            ))}
          </div>

          {/* IDENTITY TRIGGER */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group relative w-12 h-12 rounded-[22px] bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-accent transition-all duration-300 hover:scale-105 hover:border-white/20 active:scale-95 overflow-hidden shadow-xl"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <User size={22} strokeWidth={2.5} />
              )}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* IDENTITY DROPDOWN */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 bg-[#0a0a0c] border border-white/10 rounded-[32px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden isolate"
                >
                  <div className="flex items-center gap-4 p-3 mb-4 bg-white/[0.02] rounded-2xl border border-white/[0.03]">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover rounded-xl" /> : <User size={20} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-[1000] text-white truncate uppercase tracking-tight leading-none">
                        {user?.displayName || 'Authorized User'}
                      </span>
                      <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest truncate mt-1">
                        Level 4 Security
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <DropdownItem icon={Layout} label="Dashboard" onClick={() => { onNavigate('track'); setIsOpen(false); }} />
                    <DropdownItem icon={LogOut} label="Sign Out" onClick={() => { onRequestLogout(); setIsOpen(false); }} danger />
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

import { motion, AnimatePresence } from 'framer-motion';
