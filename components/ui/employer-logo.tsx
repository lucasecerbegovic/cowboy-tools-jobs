'use client';

import { useState } from 'react';
import { TradeIcon } from '@/components/ui/trade-icon';
import { isGenericEmployerName } from '@/lib/employer-logo';
import { mono } from '@/lib/brand-type';
import type { Trade } from '@/lib/jobs';

const SIZE_CLASS = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
} as const;

const SIZE_PX = { sm: 48, md: 56, lg: 80 } as const;
const ICON_PX = { sm: 22, md: 26, lg: 36 } as const;

type EmployerLogoProps = {
  name: string;
  src?: string | null;
  trade?: Trade;
  size: keyof typeof SIZE_CLASS;
  className?: string;
};

/**
 * Spec: docs/brand-guidelines.md § Listing row / Company card.
 * Missing or broken logos fall back to a trade mark in the same box.
 */
export function EmployerLogo({
  name,
  src,
  trade = 'other',
  size,
  className,
}: EmployerLogoProps) {
  const [failed, setFailed] = useState(false);
  const box = `${mono.badge} ${SIZE_CLASS[size]} flex shrink-0 items-center justify-center overflow-hidden border border-ink bg-surface ${className ?? ''}`;
  const title = isGenericEmployerName(name) ? undefined : name;

  if (!src || failed) {
    return (
      <div aria-hidden className={box} title={title}>
        <TradeIcon trade={trade} size={ICON_PX[size]} />
      </div>
    );
  }

  const px = SIZE_PX[size];
  return (
    <div aria-hidden className={box} title={title}>
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
