import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button, Card } from '../Common';

/**
 * Obsidian Confirm Modal
 * Highest priority Z-index and backdrop blur to override native behaviors.
 */
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", danger = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 isolate">
          {/* Obsidian Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl"
          />

          {/* Modal Architecture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-sm z-[10000]"
          >
            <Card className="p-8 border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]" danger={danger}>
              <div className="flex flex-col items-center text-center space-y-6">
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
