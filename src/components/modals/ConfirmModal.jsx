import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button, Card } from '../Common';

/**
 * High-Fidelity Confirmation Modal
 * Custom Obsidian Glass design for critical user actions.
 * Optimized for Z-index priority and Backdrop-Blur.
 */
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", danger = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          {/* Backdrop with extreme blur to focus the user */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-sm z-[1000]"
          >
            <Card className="p-8 border-white/10 overflow-hidden" danger={danger}>
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Visual Icon Header */}
                <div className={`p-4 rounded-[24px] ${danger ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                  <AlertCircle size={32} strokeWidth={2.5} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-[1000] uppercase tracking-tighter text-white leading-none">
                    {title}
                  </h3>
                  <p className="text-[10px] font-black text-neutral-400 leading-relaxed uppercase tracking-[0.2em] opacity-60 px-2">
                    {message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                  <Button variant="secondary" onClick={onClose} className="h-14 text-[9px] border-white/5">
                    Cancel
                  </Button>
                  <Button
                    variant={danger ? 'danger' : 'primary'}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="h-14 text-[9px]"
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
