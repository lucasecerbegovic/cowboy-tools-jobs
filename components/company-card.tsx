import Link from 'next/link';
import { Badge } from '@/components/badge';
import { EmployerLogo } from '@/components/ui/employer-logo';
import { mono, muted } from '@/lib/brand-type';
import { type EmployerCard } from '@/lib/employers';
import { TRADE_LABELS } from '@/lib/jobs';

/** Spec: docs/brand-guidelines.md § Company card */
export function CompanyCard({ employer }: { employer: EmployerCard }) {
  const trades = employer.trades;
  const roles = employer.openRoles;

  return (
    <article className="group relative flex flex-col border border-ink p-6 transition-colors duration-150 hover:bg-row-hover">
      <div className="flex items-start gap-4">
        <EmployerLogo
          name={employer.name}
          src={employer.logoUrl}
          trade={employer.trades[0] ?? 'other'}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-row-title">
            <Link
              href={`/employers/${employer.slug}`}
              className="underline-offset-4 after:absolute after:inset-0 hover:underline"
            >
              {employer.name}
            </Link>
          </h3>
          {/* Unverified carries nothing — absence is not a warning. */}
          {employer.verified && (
            <div className="mt-2">
              <Badge tone="success">Verified</Badge>
            </div>
          )}
        </div>
      </div>

      {trades.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {trades.map((t) => (
            <Badge key={t} tone={t}>
              {TRADE_LABELS[t]}
            </Badge>
          ))}
        </div>
      )}

      <p className={`${mono.meta} mt-auto pt-6 ${muted}`}>
        {roles} {roles === 1 ? 'open role' : 'open roles'} · {employer.city},{' '}
        {employer.province}
      </p>
    </article>
  );
}
