import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button, UI } from '../Common';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", type = "danger" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={UI.MODAL_OVERLAY}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#0a0a0c] border border-white/10 rounded-[48px] w-full max-w-[440px] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative overflow-hidden z-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center text-danger border border-danger/20">
                <AlertCircle size={28} strokeWidth={2.5} />
              </div>
              <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-colors">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <h3 className="text-2xl font-[1000] tracking-tighter uppercase text-white mb-4 leading-none">{title}</h3>
            <p className="text-sm text-neutral-400 font-bold leading-relaxed mb-10">{message}</p>

            <div className="flex flex-col gap-3">
              <Button variant="danger" onClick={onConfirm} className="w-full h-16 md:h-14">
                {confirmText}
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full h-16 md:h-14">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
