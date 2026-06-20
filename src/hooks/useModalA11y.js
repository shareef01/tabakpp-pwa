import { useEffect } from 'react';

/** Close modal on Escape */
export const useModalEscape = (onClose, enabled = true) => {
  useEffect(() => {
    if (!enabled || !onClose) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, enabled]);
};
