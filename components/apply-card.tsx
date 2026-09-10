import { ButtonAnchor, ButtonLink } from '@/components/button';
import { ShareButton } from '@/components/share-button';
import { mono, muted } from '@/lib/brand-type';
import { formatPay, formatPosted, type Job } from '@/lib/jobs';

export function ApplyCard({
  job,
  apply,
}: {
  job: Job;
  apply: { href: string; external: boolean };
}) {
  const hasPay = job.payMin !== undefined;

  return (
    <div
      className={[
        'border border-ink bg-surface p-4 lg:p-6',
        'max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40',
        'max-lg:border-x-0 max-lg:border-b-0',
        'max-lg:pb-[max(1rem,env(safe-area-inset-bottom))]',
        'lg:sticky lg:top-[var(--sticky-top)]',
      ].join(' ')}
    >
      <p className={`${mono.pay} ${hasPay ? 'text-ink' : muted}`}>
        {formatPay(job)}
      </p>
      <p className={`${mono.meta} mt-1 ${muted}`}>
        {formatPosted(job.postedDaysAgo)}
      </p>

      {apply.external ? (
        <ButtonAnchor
          href={apply.href}
          size="lg"
          className="mt-6 w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply on listing
        </ButtonAnchor>
      ) : (
        <ButtonLink href={apply.href} size="lg" className="mt-6 w-full">
          Apply now
        </ButtonLink>
      )}

      <div className="mt-4">
        <ShareButton title={job.title} href={`/jobs/${job.id}`} />
      </div>
    </div>
  );
}
