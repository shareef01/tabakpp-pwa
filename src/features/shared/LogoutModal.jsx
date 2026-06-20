import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalFrame } from '../../components/ui/ModalFrame';

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
  <ModalFrame isOpen={isOpen} onClose={onClose}>
    {(titleId) => (
      <div className="w-full max-w-[400px] bg-[#0a0a0c] border border-white/[0.1] rounded-[40px] p-8 md:p-10 shadow-2xl overflow-hidden mx-auto">
        <div className="flex flex-col items-center space-y-10">
          <div className="w-24 h-24 rounded-[36px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <LogOut size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-3 text-center">
            <h3 id={titleId} className="text-3xl font-[900] uppercase tracking-tighter text-[#FAFAFA]">Disconnect?</h3>
            <p className="text-[11px] font-[800] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">Registry session and live telemetry will be terminated.</p>
          </div>
          <div className="flex flex-col w-full gap-4">
            <Button variant="danger" className="h-16 text-[11px] font-[900] uppercase tracking-[0.3em]" onClick={onConfirm}>Terminate Session</Button>
            <button type="button" onClick={onClose} className="h-14 w-full rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-[#FAFAFA]">Abort Action</button>
          </div>
        </div>
      </div>
    )}
  </ModalFrame>
);
