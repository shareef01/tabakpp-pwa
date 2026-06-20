import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI } from '../../constants/ui';
import { useModalEscape } from '../../hooks/useModalA11y';

/**
 * Accessible modal shell — dialog role, Escape-to-close, safe-area overlay.
 */
export const ModalFrame = ({ isOpen, onClose, titleId, children, className = '' }) => {
  const autoId = useId();
  const labelId = titleId || autoId;
  useModalEscape(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={UI.MODAL_OVERLAY}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020202]/90 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative z-10 w-full ${className}`}
          >
            {typeof children === 'function' ? children(labelId) : children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
