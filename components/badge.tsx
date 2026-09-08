import { mono } from '@/lib/brand-type';

export type BadgeTone =
  | 'default'
  | 'urgent'
  | 'caution'
  | 'success'
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'apprenticeship'
  | 'union';

export const BADGE_TONES: Record<BadgeTone, string> = {
  default: 'border-ink bg-surface text-ink',
  urgent: 'border-urgent bg-urgent-fill text-urgent',
  caution: 'border-caution bg-caution-fill text-caution',
  /* Verified employer: solid success fill, white text. */
  success: 'border-success bg-success text-surface',
  'full-time':
    'border-badge-full-time bg-badge-full-time-fill text-badge-full-time',
  'part-time':
    'border-badge-part-time bg-badge-part-time-fill text-badge-part-time',
  contract: 'border-badge-contract bg-badge-contract-fill text-badge-contract',
  apprenticeship:
    'border-badge-apprenticeship bg-badge-apprenticeship-fill text-badge-apprenticeship',
  union: 'border-badge-union bg-badge-union-fill text-badge-union',
};

export function isBadgeTone(value: string): value is BadgeTone {
  return value in BADGE_TONES;
}

export function Badge({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`${mono.badge} inline-flex shrink-0 items-center border px-2 py-[3px] ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}
