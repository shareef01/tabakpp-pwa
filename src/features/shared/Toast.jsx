import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/system';

export const Toast = ({ toast, onDismiss, duration = 3200 }) => {
  const message = typeof toast === 'string' ? toast : toast?.message;
  const variant = typeof toast === 'object' && toast?.variant ? toast.variant : 'success';
  const onUndo = typeof toast === 'object' ? toast?.onUndo : undefined;

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={cn(
            'fixed left-1/2 z-[6000] -translate-x-1/2 bottom-[calc(var(--nav-dock-height,3.25rem)+env(safe-area-inset-bottom)+1rem)]',
            'flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-semibold shadow-2xl backdrop-blur-xl',
            variant === 'error'
              ? 'bg-rose-950/95 border-rose-500/30 text-rose-100'
              : 'bg-[#121214]/95 border-white/10 text-white pointer-events-none'
          )}
        >
          <span>{message}</span>
          {onUndo && (
            <button
              type="button"
              onClick={() => { onUndo(); onDismiss?.(); }}
              className="pointer-events-auto shrink-0 px-3 py-1 rounded-lg bg-white/10 text-xs font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
            >
              Undo
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
