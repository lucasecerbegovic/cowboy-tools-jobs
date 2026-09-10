import Link from 'next/link';
import { Badge } from '@/components/badge';
import { JobByline } from '@/components/job-byline';
import { ShareButton } from '@/components/share-button';
import { EmployerLogo } from '@/components/ui/employer-logo';
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
    <article className="group relative flex min-h-[var(--row-min-h)] items-start gap-4 border border-ink px-4 py-5 md:px-6 transition-colors duration-150 hover:bg-row-hover">
      <EmployerLogo
        name={job.employer}
        src={job.employerLogo}
        trade={job.trade}
        size="sm"
        className="max-sm:hidden"
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-row-title">
          {/* Stretched link: one accessible target, share button stays separate. */}
          <Link
            href={`/jobs/${job.id}`}
            className="after:absolute after:inset-0 hover:underline underline-offset-4"
          >
            {job.title}
          </Link>
        </h3>

        <p className={`${mono.employer} mt-1.5 ${muted}`}>
          <JobByline
            employer={job.employer}
            city={job.city}
            province={job.province}
          />
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className={`${mono.pay} ${hasPay ? 'text-ink' : muted}`}>
            {formatPay(job)}
          </span>
          <Badge tone={job.type}>{TYPE_LABELS[job.type]}</Badge>
          {job.source === 'job_bank' && <Badge>Job Bank</Badge>}
          {job.source === 'adzuna' && <Badge>Jobs by Adzuna</Badge>}
          {job.union && <Badge tone="union">Union</Badge>}
          {closingSoon && <Badge tone="urgent">Closes in {job.closesInDays}d</Badge>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        <ShareButton title={job.title} href={`/jobs/${job.id}`} />
        <span className={`${mono.meta} ${muted} hidden sm:block`}>
          {formatPosted(job.postedDaysAgo)}
        </span>
      </div>
    </article>
  );
}
