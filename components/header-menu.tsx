'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OverlayDrawer } from '@/components/ui/overlay-drawer';
import { Menu } from '@/components/icons';
import { monoUi } from '@/lib/brand-type';

const LINKS = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/post', label: 'Post a job' },
] as const;

export function HeaderMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-[var(--tap-min)] w-[var(--tap-min)] items-center justify-center md:hidden"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </button>
      <OverlayDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Menu"
        className="md:hidden"
        closeAt="(min-width: 768px)"
      >
        <nav aria-label="Mobile">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${monoUi} flex min-h-[var(--tap-min)] items-center border-b border-ink`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </OverlayDrawer>
    </>
  );
}
