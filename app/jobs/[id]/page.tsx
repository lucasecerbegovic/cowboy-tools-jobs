import { notFound } from 'next/navigation';
import { Badge } from '@/components/badge';
import { Button, ButtonLink } from '@/components/button';
import { SaveButton } from '@/components/save-button';
import { ChevronLeft } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import {
  JOBS,
  TRADE_LABELS,
  TYPE_LABELS,
  formatPay,
  formatPosted,
  getJob,
} from '@/lib/jobs';

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = getJob((await params).id);
  if (!job) return { title: 'Job not found — Tradesboard' };
  return {
    title: `${job.title} — ${job.employer} — Tradesboard`,
    description: job.summary,
  };
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = getJob((await params).id);
  if (!job) notFound();

  const hasPay = job.payMin !== undefined;

  /* Spec table — labels mono, values Geist, hairline rules between rows. */
  const spec: [string, string][] = [
    ['Pay', formatPay(job)],
    ['Type', TYPE_LABELS[job.type]],
    ['Trade', TRADE_LABELS[job.trade]],
    ['Experience', job.experience],
    ['Location', `${job.city}, ${job.province}`],
    ['Posted', formatPosted(job.postedDaysAgo)],
    ...(job.closesInDays !== undefined
      ? ([['Closes', `In ${job.closesInDays} days`]] as [string, string][])
      : []),
  ];

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 md:px-8">
      <ButtonLink href="/jobs" variant="bare" size="sm" className="-ml-3">
        <ChevronLeft size={14} />
        All jobs
      </ButtonLink>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_var(--apply-w)]">
        <article>
          <h1 className="text-job">{job.title}</h1>
          <p className={`${mono.employer} mt-2 ${muted}`}>
            {job.employer} · {job.city}, {job.province}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{TYPE_LABELS[job.type]}</Badge>
            {job.union && <Badge>Union</Badge>}
            {/* Absence of verification is not a warning — unverified gets nothing. */}
            {job.verified && <Badge tone="success">Verified employer</Badge>}
          </div>

          <dl className="mt-10">
            {spec.map(([label, value], i) => (
              <div
                key={label}
                className={`grid gap-2 py-4 sm:grid-cols-[180px_1fr] ${
                  i > 0 ? 'border-t border-rule' : ''
                }`}
              >
                <dt className={`${monoUi} ${muted}`}>{label}</dt>
                <dd
                  className={
                    label === 'Pay' && !hasPay ? `text-body ${muted}` : 'text-body'
                  }
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 max-w-[68ch]">
            <h2 className={`${monoUi} border-b border-ink pb-3`}>About the role</h2>
            <p className="mt-5 text-body">{job.summary}</p>

            <h2 className={`${monoUi} mt-10 border-b border-ink pb-3`}>
              Responsibilities
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex gap-3 text-body">
                  <span aria-hidden className={muted}>
                    —
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="lg:sticky lg:top-[var(--sticky-top)] lg:self-start">
          <div className="border border-ink p-6">
            <p className={`${mono.pay} ${hasPay ? 'text-ink' : muted}`}>
              {formatPay(job)}
            </p>
            <p className={`${mono.meta} mt-1 ${muted}`}>
              {formatPosted(job.postedDaysAgo)}
            </p>

            <ButtonLink href={`/jobs/${job.id}/apply`} size="lg" className="mt-6 w-full">
              Apply now
            </ButtonLink>

            <div className="mt-4 flex items-center justify-between">
              <SaveButton title={job.title} />
              <Button variant="bare" size="sm">
                Share
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
