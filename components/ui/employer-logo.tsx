'use client';

import { useState } from 'react';
import { mono } from '@/lib/brand-type';
import { employerInitials } from '@/lib/employer-logo';

const SIZE_CLASS = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
} as const;

const SIZE_PX = { sm: 48, md: 56, lg: 80 } as const;

type EmployerLogoProps = {
  name: string;
  src?: string | null;
  size: keyof typeof SIZE_CLASS;
  className?: string;
};

/**
 * Spec: docs/brand-guidelines.md § Listing row / Company card.
 * Missing or broken logos fall back to two-letter initials in the same box.
 */
export function EmployerLogo({ name, src, size, className }: EmployerLogoProps) {
  const [failed, setFailed] = useState(false);
  const box = `${mono.badge} ${SIZE_CLASS[size]} flex shrink-0 items-center justify-center overflow-hidden border border-ink bg-surface ${className ?? ''}`;

  if (!src || failed) {
    return (
      <div aria-hidden className={box}>
        {employerInitials(name)}
      </div>
    );
  }

  const px = SIZE_PX[size];
  return (
    <div aria-hidden className={box}>
      <img
        src={src}
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-contain p-1.5"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
