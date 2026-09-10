'use client';

import { useEffect, useId, useRef } from 'react';
import { Close } from '@/components/icons';
import { monoUi } from '@/lib/brand-type';
import {
  createFocusTrap,
  lockBodyScroll,
  measureScrollbarWidth,
  restoreBodyScroll,
} from '@/lib/overlay';

/**
 * Full-screen overlay. Children are whatever the caller passed — including
 * server-rendered trees. JS only locks scroll, traps focus, and handles Escape.
 */
export function OverlayDrawer({
  open,
  onClose,
  title,
  footer,
  children,
  className = '',
  closeAt,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Close when the viewport grows past this media query (e.g. desktop). */
  closeAt?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const body = document.body;
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (closeAt && window.matchMedia(closeAt).matches) {
      onCloseRef.current();
      return;
    }

    const snapshot = lockBodyScroll(body, measureScrollbarWidth(document));
    const trap = createFocusTrap(panel);
    trap.activate();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);

    panel.querySelector<HTMLElement>('[data-overlay-close]')?.focus();

    let mq: MediaQueryList | undefined;
    const onMq = () => {
      if (mq?.matches) onCloseRef.current();
    };
    if (closeAt) {
      mq = window.matchMedia(closeAt);
      if (mq.matches) onCloseRef.current();
      mq.addEventListener('change', onMq);
    }

    return () => {
      trap.deactivate();
      document.removeEventListener('keydown', onKey);
      restoreBodyScroll(body, snapshot);
      openerRef.current?.focus?.();
      mq?.removeEventListener('change', onMq);
    };
  }, [open, closeAt]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'} ${className}`}
      {...(!open ? { inert: true } : {})}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-[220ms] ease-[var(--ease-standard)] ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex h-dvh w-full max-w-full flex-col border-l border-ink bg-surface transition-transform duration-[220ms] ease-[var(--ease-standard)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-ink px-4 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]">
          <h2 id={titleId} className={monoUi}>
            {title}
          </h2>
          <button
            type="button"
            data-overlay-close
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-[var(--tap-min)] w-[var(--tap-min)] items-center justify-center"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          {children}
        </div>

        {footer && (
          <div className="sticky bottom-0 flex gap-3 border-t border-ink bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
