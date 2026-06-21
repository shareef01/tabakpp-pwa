import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalFrame } from '../../components/ui/ModalFrame';
import { UI } from '../../constants/ui';
import { cn } from '../../utils/system';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmDisabled = false }) => {
  const safeClose = confirmDisabled ? undefined : onClose;

  return (
    <ModalFrame isOpen={isOpen} onClose={safeClose}>
      {(titleId) => (
        <div className={cn(UI.MODAL_SHELL, 'max-w-[440px] p-8 md:p-10')}>
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center text-danger border border-danger/20">
              <AlertCircle size={28} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={safeClose}
              disabled={confirmDisabled}
              aria-label="Close"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
          <h3 id={titleId} className="text-2xl font-black tracking-tighter uppercase text-white mb-4 leading-none">{title}</h3>
          <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-10">{message}</p>
          <div className="flex flex-col gap-3">
            <Button variant="danger" onClick={onConfirm} disabled={confirmDisabled} className="w-full h-14">{confirmText}</Button>
            <Button variant="ghost" onClick={safeClose} disabled={confirmDisabled} className="w-full h-14">Cancel</Button>
          </div>
        </div>
      )}
    </ModalFrame>
  );
};
