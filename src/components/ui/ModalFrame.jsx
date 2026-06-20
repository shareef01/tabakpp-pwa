import React, { useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI } from '../../constants/ui';
import { useModalFocusTrap } from '../../hooks/useModalA11y';

/**
 * Accessible modal shell — dialog role, focus trap, Escape-to-close.
 * Backdrop tap does not close (avoids accidental dismiss on mobile).
 */
export const ModalFrame = ({ isOpen, onClose, titleId, children, className = '', closeOnBackdrop = false }) => {
  const autoId = useId();
  const labelId = titleId || autoId;
  const dialogRef = useRef(null);

  useModalFocusTrap(isOpen, onClose, dialogRef);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={UI.MODAL_OVERLAY}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-[#020202]/90 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative z-10 w-full outline-none ${className}`}
          >
            {typeof children === 'function' ? children(labelId) : children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
