import Link from 'next/link';
import { Badge } from '@/components/badge';
import { SaveButton } from '@/components/save-button';
import { mono, muted } from '@/lib/brand-type';
import { formatPay, formatPosted, TYPE_LABELS, type Job } from '@/lib/jobs';

/**
 * The core unit of the product. Pay is always leftmost in the metadata row and
 * never collapses — column alignment is the scanning affordance.
 * Spec: docs/brand-guidelines.md § Listing row
 */
export function ListingRow({ job }: { job: Job }) {
  const hasPay = job.payMin !== undefined;
  const closingSoon = job.closesInDays !== undefined && job.closesInDays <= 3;

  return (
    <article className="group relative flex min-h-[var(--row-min-h)] items-start gap-4 border border-ink px-6 py-5 transition-colors duration-150 hover:bg-row-hover">
      <div
        aria-hidden
        className={`${mono.badge} hidden h-12 w-12 shrink-0 items-center justify-center border border-ink sm:flex`}
      >
        {job.employer.slice(0, 2).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-row-title">
          {/* Stretched link: one accessible target, save button stays separate. */}
          <Link
            href={`/jobs/${job.id}`}
            className="after:absolute after:inset-0 hover:underline underline-offset-4"
          >
            {job.title}
          </Link>
        </h3>

        <p className={`${mono.employer} mt-1.5 ${muted}`}>
          {/* Sits above the stretched link so it stays independently clickable. */}
          <Link
            href={`/employers/${job.employerSlug}`}
            className="relative z-10 underline-offset-4 hover:underline"
          >
            {job.employer}
          </Link>{' '}
          · {job.city}, {job.province}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className={`${mono.pay} ${hasPay ? 'text-ink' : muted}`}>
            {formatPay(job)}
          </span>
          <Badge>{TYPE_LABELS[job.type]}</Badge>
          {job.union && <Badge>Union</Badge>}
          {closingSoon && <Badge tone="urgent">Closes in {job.closesInDays}d</Badge>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        <SaveButton title={job.title} />
        <span className={`${mono.meta} ${muted} hidden sm:block`}>
          {formatPosted(job.postedDaysAgo)}
        </span>
      </div>
    </article>
  );
}
