/**
 * Overlay helpers with no React. OverlayDrawer and tests both use these.
 * Scroll-lock compensates the scrollbar gutter so the page does not jump.
 */

export type StyleTarget = {
  style: { overflow: string; paddingRight: string };
};

export type ScrollLockSnapshot = { overflow: string; paddingRight: string };

export type DocumentLike = {
  documentElement: { clientWidth: number };
  defaultView: { innerWidth: number } | null;
};

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function measureScrollbarWidth(doc: DocumentLike): number {
  const inner = doc.defaultView?.innerWidth ?? 0;
  return Math.max(0, inner - doc.documentElement.clientWidth);
}

export function lockBodyScroll(
  el: StyleTarget,
  scrollbarWidth = 0,
): ScrollLockSnapshot {
  const snapshot: ScrollLockSnapshot = {
    overflow: el.style.overflow,
    paddingRight: el.style.paddingRight,
  };
  el.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    el.style.paddingRight = `${scrollbarWidth}px`;
  }
  return snapshot;
}

export function restoreBodyScroll(el: StyleTarget, snapshot: ScrollLockSnapshot) {
  el.style.overflow = snapshot.overflow;
  el.style.paddingRight = snapshot.paddingRight;
}

export function getFocusable<T extends { focus: () => void }>(container: {
  querySelectorAll: (sel: string) => ArrayLike<T>;
}): T[] {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as T[];
}

export function cycleFocus(
  event: {
    key: string;
    shiftKey: boolean;
    preventDefault: () => void;
    target: unknown;
  },
  focusable: { focus: () => void }[],
): boolean {
  if (event.key !== 'Tab' || focusable.length === 0) return false;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && event.target === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && event.target === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

export function createFocusTrap(container: {
  addEventListener: (type: 'keydown', listener: (e: KeyboardEvent) => void) => void;
  removeEventListener: (type: 'keydown', listener: (e: KeyboardEvent) => void) => void;
  querySelectorAll: (sel: string) => ArrayLike<{ focus: () => void }>;
}) {
  const onKeyDown = (event: KeyboardEvent) => {
    cycleFocus(event, getFocusable(container));
  };
  return {
    activate() {
      container.addEventListener('keydown', onKeyDown);
    },
    deactivate() {
      container.removeEventListener('keydown', onKeyDown);
    },
  };
}
