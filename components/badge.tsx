import { mono } from '@/lib/brand-type';
import type { EmploymentType, Trade } from '@/lib/jobs';

export type BadgeTone =
  | 'default'
  | 'urgent'
  | 'caution'
  | 'success'
  | EmploymentType
  | 'union'
  | Trade;

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
  electrical:
    'border-badge-electrical bg-badge-electrical-fill text-badge-electrical',
  plumbing: 'border-badge-plumbing bg-badge-plumbing-fill text-badge-plumbing',
  hvac: 'border-badge-hvac bg-badge-hvac-fill text-badge-hvac',
  carpentry:
    'border-badge-carpentry bg-badge-carpentry-fill text-badge-carpentry',
  welding: 'border-badge-welding bg-badge-welding-fill text-badge-welding',
  'heavy-equipment':
    'border-badge-heavy-equipment bg-badge-heavy-equipment-fill text-badge-heavy-equipment',
  millwright:
    'border-badge-millwright bg-badge-millwright-fill text-badge-millwright',
  other: 'border-badge-other bg-badge-other-fill text-badge-other',
};

/** Selected filter chips invert to the trade’s ink color on white text. */
export const BADGE_TONES_SOLID: Record<Trade, string> = {
  electrical: 'border-badge-electrical bg-badge-electrical text-surface',
  plumbing: 'border-badge-plumbing bg-badge-plumbing text-surface',
  hvac: 'border-badge-hvac bg-badge-hvac text-surface',
  carpentry: 'border-badge-carpentry bg-badge-carpentry text-surface',
  welding: 'border-badge-welding bg-badge-welding text-surface',
  'heavy-equipment':
    'border-badge-heavy-equipment bg-badge-heavy-equipment text-surface',
  millwright: 'border-badge-millwright bg-badge-millwright text-surface',
  other: 'border-badge-other bg-badge-other text-surface',
};

export function isBadgeTone(value: string): value is BadgeTone {
  return value in BADGE_TONES;
}

export function tradeFilterClass(trade: Trade, selected: boolean): string {
  return selected ? BADGE_TONES_SOLID[trade] : BADGE_TONES[trade];
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
