import { mono } from '@/lib/brand-type';

type BadgeTone = 'default' | 'urgent' | 'caution' | 'success';

const TONES: Record<BadgeTone, string> = {
  // Employment type and trade are categories, not states — outlined ink.
  default: 'border-ink text-ink',
  urgent: 'border-urgent text-urgent',
  caution: 'border-caution text-caution',
  success: 'border-success text-success',
};

export function Badge({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`${mono.badge} inline-flex shrink-0 items-center border px-2 py-[3px] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
