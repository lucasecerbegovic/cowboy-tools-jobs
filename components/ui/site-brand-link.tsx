import Link from 'next/link';
import { monoUi } from '@/lib/brand-type';
import { SITE_LOGO_PATH, SITE_NAME } from '@/lib/site';

const SIZE_PX = {
  light: 32,
  ink: 40,
} as const;

type SiteBrandLinkProps = {
  /** Header (black on white) vs footer (white on ink). */
  tone: 'light' | 'ink';
  className?: string;
};

/**
 * Home link with square Cowboy Tools mark + SITE_NAME.
 * Spec: docs/brand-guidelines.md § Layout / Footer.
 */
export function SiteBrandLink({ tone, className }: SiteBrandLinkProps) {
  const px = SIZE_PX[tone];
  const textClass = tone === 'ink' ? 'text-surface' : 'text-ink';

  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} home`}
      className={`inline-flex min-w-0 items-center gap-2.5 hover:opacity-70 ${className ?? ''}`}
    >
      <img
        src={SITE_LOGO_PATH}
        alt=""
        width={px}
        height={px}
        className="shrink-0"
        decoding="async"
      />
      <span className={`${monoUi} ${textClass} min-w-0 truncate`}>{SITE_NAME}</span>
    </Link>
  );
}
