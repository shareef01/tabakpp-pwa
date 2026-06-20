import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Layout, Settings, BarChart3, Sunrise } from 'lucide-react';
import { cn } from '../../utils/system';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HIGH-FIDELITY COMMAND HEADER
 * Task 1: Baseline lock, Softened whites.
 * Task 2: Inset light-catch borders.
 * Task 3: Spring physics (active:scale-0.94).
 */
export const Header = ({ user, onNavigate, onRequestLogout, onEndDay, trackingDayLabel, endDayPending = false }) => {
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
    <header className="sticky top-0 z-[200] w-full shrink-0 border-b border-white/[0.03] bg-[#09090B]/80 backdrop-blur-2xl pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center py-3 xs:py-4 md:py-5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-6 sm:pr-6 md:pl-8 md:pr-8">

        {/* 1. LEFT SIDE: BRAND LOGO (Kinetic Physics) */}
        <div
          className="flex items-center gap-2 group cursor-pointer animate-brand active:scale-95 transition-transform duration-150"
          onClick={() => onNavigate('track')}
        >
          <span className="text-accent font-[1000] text-3xl md:text-4xl select-none">t</span>
          <span className="text-xl md:text-2xl font-[900] text-white/20 uppercase italic select-none -ml-1 mt-1">++</span>
        </div>

        {/* 2. RIGHT SIDE: COMMAND CLUSTER */}
        <div className="flex items-center gap-4 md:gap-8">

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onEndDay}
            disabled={endDayPending}
            aria-label={endDayPending ? 'Ending day…' : 'End day and reset counters'}
            title={trackingDayLabel ? `Archive session · tracking day ${trackingDayLabel}` : 'End day and reset counters'}
            className={cn(
              "group relative flex items-center gap-2.5 px-4 sm:px-6 h-12 rounded-2xl transition-all duration-200",
              "bg-white/[0.02] border border-white/[0.1] hover:border-accent/40 hover:bg-accent/[0.02]",
              "text-[10px] font-[900] text-white/40 hover:text-accent uppercase tracking-[0.25em] active:scale-[0.94]",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
              "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
            )}
          >
            <Sunrise size={16} strokeWidth={2.5} className={cn("opacity-60 group-hover:opacity-100", endDayPending && "animate-pulse")} />
            <span className="hidden sm:inline">{endDayPending ? 'Archiving…' : 'End Day'}</span>
          </motion.button>

          {/* MINIMALIST PROFILE TRIGGER (Baseline Lock) */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Profile menu"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className="group relative flex items-center gap-3 transition-all active:scale-[0.94] duration-150"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl transition-all group-hover:border-white/20 relative">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                )}
                <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none" />
              </div>
              <ChevronDown size={14} className={cn("text-white/20 transition-transform duration-500", isOpen && "rotate-180 text-white/40")} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-64 bg-[#0a0a0c]/90 border border-white/10 rounded-[32px] p-4 shadow-[0_20px_100px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 overflow-hidden"
                  style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 100px rgba(0,0,0,0.95)" }}
                >
                  <div className="space-y-1">
                    <DropdownItem icon={Layout} label="Trackers" onClick={() => { onNavigate('track'); setIsOpen(false); }} />
                    <DropdownItem icon={BarChart3} label="Analytics" onClick={() => { onNavigate('history'); setIsOpen(false); }} />
                    <DropdownItem icon={Settings} label="Calibration" onClick={() => { onNavigate('control'); setIsOpen(false); }} />
                    <div className="h-px bg-white/5 my-2.5 mx-2" />
                    <DropdownItem icon={LogOut} label="Disconnect" onClick={() => { onRequestLogout(); setIsOpen(false); }} danger />
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
      "w-full flex items-center gap-4 px-4 h-11 rounded-xl text-[10px] font-[900] uppercase tracking-[0.15em] transition-all duration-200 active:scale-[0.96]",
      danger ? "text-rose-500 hover:bg-rose-500/10" : "text-neutral-400 hover:text-[#FAFAFA] hover:bg-white/5"
    )}
  >
    <Icon size={18} strokeWidth={2.5} />{label}
  </button>
);
