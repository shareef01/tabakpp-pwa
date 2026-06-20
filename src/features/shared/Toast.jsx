import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({ message, onDismiss, duration = 2600 }) => {
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
          className="fixed left-1/2 z-[6000] -translate-x-1/2 bottom-[calc(var(--nav-dock-height,3.25rem)+env(safe-area-inset-bottom)+1rem)] px-5 py-3 rounded-2xl bg-[#121214]/95 border border-white/10 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
