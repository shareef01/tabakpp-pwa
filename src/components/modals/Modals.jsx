import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Card } from '../Common';

/**
 * Standardized Logout Modal
 */
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 isolate">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm z-[5001]"
        >
          <Card className="p-10 border-white/10 text-center" danger>
            <div className="flex flex-col items-center space-y-8">
              <div className="w-20 h-20 rounded-[28px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <LogOut size={32} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-[1000] uppercase tracking-tighter text-white">Terminate?</h3>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-relaxed px-4">
                  You will be signed out of this registry session.
                </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <Button variant="danger" className="h-16" onClick={onConfirm}>
                  Logout
                </Button>
                <Button variant="secondary" className="h-16" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

/**
 * Standardized Alert Overlay (Notification)
 */
export const AlertOverlay = ({ isOpen, onClose, title, message, type = 'error' }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm px-6">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#0a0a0c] border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 backdrop-blur-xl"
        >
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'error' ? 'bg-rose-500/10 text-rose-500' : 'bg-accent/10 text-accent'}`}>
            {type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{title}</h4>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest truncate">{message}</p>
          </div>
          <button onClick={onClose} className="text-neutral-600 hover:text-white transition-colors">
            <LogOut size={16} className="rotate-180" />
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
