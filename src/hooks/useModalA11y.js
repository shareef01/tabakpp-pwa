import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

/** Trap focus inside dialog and restore focus on close */
export const useModalFocusTrap = (isOpen, onClose, dialogRef) => {
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !dialogRef?.current) return;

    previousFocusRef.current = document.activeElement;
    const dialog = dialogRef.current;

    const getFocusables = () => [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);

    const focusFirst = () => {
      const nodes = getFocusables();
      (nodes[0] || dialog).focus?.();
    };

    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = getFocusables();
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      if (previousFocusRef.current?.focus) {
        try {
          previousFocusRef.current.focus();
        } catch {
          /* element removed */
        }
      }
    };
  }, [isOpen, onClose, dialogRef]);
};
