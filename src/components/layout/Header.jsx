import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Layout, Settings, BarChart3, Sunrise } from 'lucide-react';
import { cn } from '../../utils/system';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = ({ user, onNavigate, onRequestLogout, onRequestEndDay, endDayPending = false, trackingDayLabel }) => {
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

        <button
          type="button"
          aria-label="Go to track"
          className="flex items-center gap-2 group animate-brand active:scale-95 transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 rounded-lg"
          onClick={() => onNavigate('track')}
        >
          <span className="text-accent font-black text-3xl md:text-4xl select-none">t</span>
          <span className="text-xl md:text-2xl font-black text-white/20 uppercase italic select-none -ml-1 mt-1">++</span>
        </button>

        <div className="flex items-center gap-4 md:gap-8">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onRequestEndDay}
            disabled={endDayPending}
            aria-label={endDayPending ? 'Ending day…' : 'End day and reset counters'}
            title={trackingDayLabel ? `Archive session · tracking day ${trackingDayLabel}` : 'End day and reset counters'}
            className={cn(
              'group relative flex items-center gap-2.5 px-4 sm:px-6 h-12 rounded-2xl transition-all duration-200',
              'bg-white/[0.02] border border-white/[0.1] hover:border-accent/40 hover:bg-accent/[0.02]',
              'text-[10px] font-black text-white/40 hover:text-accent uppercase tracking-[0.25em] active:scale-[0.94]',
              'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50',
              'disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed'
            )}
          >
            <Sunrise size={16} strokeWidth={2.5} className={cn('opacity-60 group-hover:opacity-100', endDayPending && 'animate-pulse')} />
            <span className="hidden sm:inline">{endDayPending ? 'Archiving…' : 'End Day'}</span>
          </motion.button>

          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Profile menu"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className="group relative flex items-center gap-3 transition-all active:scale-[0.94] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 rounded-xl"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl transition-all group-hover:border-white/20 relative">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                )}
                <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none" />
              </div>
              {user?.displayName && (
                <span className="hidden md:block max-w-[8rem] truncate text-xs font-bold text-zinc-400 group-hover:text-zinc-200">
                  {user.displayName}
                </span>
              )}
              <ChevronDown size={14} className={cn('text-white/20 transition-transform duration-500', isOpen && 'rotate-180 text-white/40')} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-64 bg-[#121214]/95 border border-white/10 rounded-[32px] p-4 shadow-[0_20px_100px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 overflow-hidden"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 100px rgba(0,0,0,0.95)' }}
                >
                  <div className="space-y-1">
                    <DropdownItem icon={Layout} label="Track" onClick={() => { onNavigate('track'); setIsOpen(false); }} />
                    <DropdownItem icon={BarChart3} label="History" onClick={() => { onNavigate('history'); setIsOpen(false); }} />
                    <DropdownItem icon={Settings} label="Settings" onClick={() => { onNavigate('control'); setIsOpen(false); }} />
                    <div className="h-px bg-white/5 my-2.5 mx-2" role="separator" />
                    <DropdownItem icon={LogOut} label="Sign out" onClick={() => { onRequestLogout(); setIsOpen(false); }} danger />
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
    type="button"
    role="menuitem"
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-4 px-4 h-11 min-h-[44px] rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 active:scale-[0.96]',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/40',
      danger ? 'text-rose-500 hover:bg-rose-500/10' : 'text-neutral-400 hover:text-[#FAFAFA] hover:bg-white/5'
    )}
  >
    <Icon size={18} strokeWidth={2.5} aria-hidden="true" />{label}
  </button>
);
