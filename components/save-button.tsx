'use client';

import { useState } from 'react';
import { Bookmark } from '@/components/icons';
import { mono } from '@/lib/brand-type';

/** Save is the highest-frequency action on a results page — 140ms, no delay. */
export function SaveButton({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
      onClick={() => setSaved((s) => !s)}
      className={`${mono.badge} relative z-10 -m-2 inline-flex h-[var(--tap-min)] items-center gap-2 border-0 bg-transparent p-2 transition-opacity duration-[140ms] hover:opacity-70`}
    >
      <span
        className={`inline-flex h-8 items-center gap-2 border px-3 ${
          saved ? 'border-ink bg-ink text-surface' : 'border-ink bg-surface text-ink'
        }`}
      >
        <Bookmark size={13} filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
}
