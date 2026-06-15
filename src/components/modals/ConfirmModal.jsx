import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button, Card } from '../Common';

/**
 * High-Fidelity Confirmation Modal
 * Custom Obsidian Glass design for critical user actions.
 */
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", danger = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            <Card className="p-8 md:p-10 border-white/10" danger={danger}>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`p-4 rounded-[24px] ${danger ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                  <AlertCircle size={32} strokeWidth={2.5} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-[1000] uppercase tracking-tighter text-white">
                    {title}
                  </h3>
                  <p className="text-sm font-bold text-neutral-400 leading-relaxed uppercase tracking-wider opacity-80">
                    {message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                  <Button variant="secondary" onClick={onClose} className="h-16">
                    Cancel
                  </Button>
                  <Button
                    variant={danger ? 'danger' : 'primary'}
                    onClick={() => { onConfirm(); onClose(); }}
                    className="h-16"
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
