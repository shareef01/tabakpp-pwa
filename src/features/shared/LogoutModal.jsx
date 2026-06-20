import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalFrame } from '../../components/ui/ModalFrame';
import { UI } from '../../constants/ui';
import { cn } from '../../utils/system';

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
  <ModalFrame isOpen={isOpen} onClose={onClose}>
    {(titleId) => (
      <div className={cn(UI.MODAL_SHELL, 'max-w-[400px] p-8 md:p-10')}>
        <div className="flex flex-col items-center space-y-10">
          <div className="w-24 h-24 rounded-[36px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <LogOut size={40} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div className="space-y-3 text-center">
            <h3 id={titleId} className="text-3xl font-black uppercase tracking-tighter text-[#FAFAFA]">Sign out?</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">You can sign back in anytime. Your data stays synced in the cloud.</p>
          </div>
          <div className="flex flex-col w-full gap-4">
            <Button variant="danger" className="h-16 text-[11px] font-black uppercase tracking-[0.3em]" onClick={onConfirm}>Sign out</Button>
            <Button variant="ghost" onClick={onClose} className="h-14">Cancel</Button>
          </div>
        </div>
      </div>
    )}
  </ModalFrame>
);
