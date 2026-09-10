import { notFound } from 'next/navigation';
import { Badge } from '@/components/badge';
import { ApplyCard } from '@/components/apply-card';
import { ButtonLink } from '@/components/button';
import { JobByline } from '@/components/job-byline';
import { ChevronLeft } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { isGenericEmployerName, jobDocumentTitle } from '@/lib/employer-logo';
import {
  TRADE_LABELS,
  TYPE_LABELS,
  applyTarget,
  formatPay,
  formatPosted,
} from '@/lib/jobs';
import { OG_SITE_NAME } from '@/lib/site';
import { getEmployer, getJob } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJob((await params).id);
  if (!job) return { title: 'Job not found' };
  const title = jobDocumentTitle(job);
  return {
    title,
    description: job.summary,
    openGraph: {
      title,
      description: job.summary,
      siteName: OG_SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: job.summary,
    },
  };
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJob((await params).id);
  if (!job) notFound();

  const hasPay = job.payMin !== undefined;
  const employer = await getEmployer(job.employerSlug);
  const apply = applyTarget(job);

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
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 max-lg:pb-[calc(var(--apply-bar-h)+env(safe-area-inset-bottom))] md:px-8">
      <ButtonLink href="/jobs" variant="bare" size="sm" className="-ml-3">
        <ChevronLeft size={14} />
        All jobs
      </ButtonLink>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_var(--apply-w)]">
        <article>
          <h1 className="text-job">{job.title}</h1>
          <p className={`${mono.employer} mt-2 ${muted}`}>
            <JobByline
              employer={job.employer}
              city={job.city}
              province={job.province}
            />
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone={job.type}>{TYPE_LABELS[job.type]}</Badge>
            {job.source === 'job_bank' && <Badge>Job Bank</Badge>}
            {job.source === 'adzuna' && <Badge>Jobs by Adzuna</Badge>}
            {job.union && <Badge tone="union">Union</Badge>}
            {!isGenericEmployerName(job.employer) && employer?.verified && (
              <Badge tone="success">Verified employer</Badge>
            )}
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
            <p className="mt-5 whitespace-pre-line text-body">{job.summary}</p>

            {job.responsibilities.length > 0 && (
              <>
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
              </>
            )}
          </div>
        </article>

        <aside className="lg:self-start">
          <ApplyCard job={job} apply={apply} />
        </aside>
      </div>
    </main>
  );
}
