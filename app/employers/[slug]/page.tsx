import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/badge';
import { ButtonLink } from '@/components/button';
import { ChevronLeft } from '@/components/icons';
import { ListingRow } from '@/components/listing-row';
import { EmptyState } from '@/components/empty-state';
import { EmployerLogo } from '@/components/ui/employer-logo';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { TRADE_LABELS } from '@/lib/jobs';
import { getEmployer, jobsForEmployer } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const e = await getEmployer((await params).slug);
  if (!e) return { title: 'Employer not found' };
  return {
    title: e.name,
    description: e.about,
    openGraph: {
      title: e.name,
      description: e.about,
    },
    twitter: {
      card: 'summary_large_image',
      title: e.name,
      description: e.about,
    },
  };
}

export default async function EmployerProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const employer = await getEmployer((await params).slug);
  if (!employer) notFound();

  const jobs = await jobsForEmployer(employer.slug);
  const trades = employer.trades;

  const facts: [string, string][] = [
    ['Location', `${employer.city}, ${employer.province}`],
    ['Founded', employer.founded ? String(employer.founded) : 'Not listed'],
    ['Size', employer.size ?? 'Not listed'],
    ['Open roles', String(jobs.length)],
  ];

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 md:px-8">
      <ButtonLink href="/employers" variant="bare" size="sm" className="-ml-3">
        <ChevronLeft size={14} />
        All employers
      </ButtonLink>

      <div className="mt-6 flex items-start gap-5">
        <EmployerLogo name={employer.name} src={employer.logoUrl} size="lg" />
        <div className="min-w-0">
          <h1 className="text-job">{employer.name}</h1>
          <p className={`${mono.employer} mt-2 ${muted}`}>
            {employer.city}, {employer.province}
          </p>
          {employer.verified && (
            <div className="mt-3">
              <Badge tone="success">Verified employer</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_var(--apply-w)]">
        <div>
          <h2 className={`${monoUi} border-b border-ink pb-3`}>About</h2>
          <p className="mt-5 max-w-[68ch] text-body">{employer.about}</p>

          {trades.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {trades.map((t) => (
                <Badge key={t}>{TRADE_LABELS[t]}</Badge>
              ))}
            </div>
          )}

          <h2 className={`${monoUi} mt-12 border-b border-ink pb-3`}>
            Open roles ({jobs.length})
          </h2>
          {jobs.length > 0 ? (
            <div className="mt-6 -space-y-px">
              {jobs.map((job) => (
                <ListingRow key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                label="No active postings"
                body={`${employer.name} has no open roles right now.`}
                actionLabel="Browse all jobs"
                actionHref="/jobs"
              />
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-[var(--sticky-top)] lg:self-start">
          <dl className="border border-ink p-6">
            {facts.map(([k, v], i) => (
              <div key={k} className={i > 0 ? 'mt-4 border-t border-rule pt-4' : ''}>
                <dt className={`${monoUi} ${muted}`}>{k}</dt>
                <dd className="mt-1.5 text-body">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
}
