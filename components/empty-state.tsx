import { ButtonLink } from '@/components/button';
import { monoUi, muted } from '@/lib/brand-type';

/** Spec: docs/brand-guidelines.md § Empty states */
export function EmptyState({
  label,
  body,
  actionLabel,
  actionHref,
  secondary,
}: {
  label: string;
  body: string;
  actionLabel: string;
  actionHref: string;
  /** Zero-results must offer the nearest broader query as a bare-text action. */
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center border border-ink px-8 py-12 text-center">
      <p className={monoUi}>{label}</p>
      <p className={`mt-4 text-body ${muted}`}>{body}</p>
      <ButtonLink href={actionHref} className="mt-8">
        {actionLabel}
      </ButtonLink>
      {secondary && (
        <ButtonLink href={secondary.href} variant="bare" className="mt-3">
          {secondary.label}
        </ButtonLink>
      )}
    </div>
  );
}
