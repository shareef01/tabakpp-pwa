import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalFrame } from '../../components/ui/ModalFrame';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => (
  <ModalFrame isOpen={isOpen} onClose={onClose}>
    {(titleId) => (
      <div className="bg-[#0a0a0c] border border-white/10 rounded-[48px] w-full max-w-[440px] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center text-danger border border-danger/20">
            <AlertCircle size={28} strokeWidth={2.5} />
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 text-neutral-500 hover:text-white transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>
        <h3 id={titleId} className="text-2xl font-[1000] tracking-tighter uppercase text-white mb-4 leading-none">{title}</h3>
        <p className="text-sm text-neutral-400 font-bold leading-relaxed mb-10">{message}</p>
        <div className="flex flex-col gap-3">
          <Button variant="danger" onClick={onConfirm} className="w-full h-14">{confirmText}</Button>
          <Button variant="ghost" onClick={onClose} className="w-full h-14">Cancel</Button>
        </div>
      </div>
    )}
  </ModalFrame>
);
