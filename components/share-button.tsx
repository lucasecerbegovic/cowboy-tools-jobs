'use client';

import { useEffect, useRef, useState } from 'react';
import { Share } from '@/components/icons';
import { mono } from '@/lib/brand-type';

const COPIED_MS = 2000;

/** Copies the job URL. Confirmation is 140ms invert + a 2s tooltip. */
export function ShareButton({ title, href }: { title: string; href: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  async function copyLink() {
    const url = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <button
      type="button"
      aria-label={`Share ${title}`}
      onClick={copyLink}
      className={`${mono.badge} group/share relative z-10 -m-2 inline-flex h-[var(--tap-min)] items-center gap-2 border-0 bg-transparent p-2`}
    >
      <span
        className={`inline-flex h-8 items-center gap-2 border border-ink px-3 transition-colors duration-[140ms] ease-[var(--ease-standard)] ${
          copied
            ? 'bg-ink text-surface'
            : 'bg-surface text-ink group-hover/share:bg-ink group-hover/share:text-surface'
        }`}
      >
        <Share size={13} />
        Share
      </span>
      {copied && (
        <span
          role="status"
          className={`${mono.badge} pointer-events-none absolute top-full right-0 z-20 mt-1 whitespace-nowrap border border-ink bg-ink px-3 py-1.5 text-surface max-sm:right-auto max-sm:left-0`}
        >
          Link copied
        </span>
      )}
    </button>
  );
}
