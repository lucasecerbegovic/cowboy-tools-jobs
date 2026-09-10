import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApplyForm } from '@/components/apply-form';
import { ButtonAnchor, ButtonLink } from '@/components/button';
import { ChevronLeft } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { JobByline } from '@/components/job-byline';
import { applyTarget, formatPay } from '@/lib/jobs';
import { getJob } from '@/lib/store';
import { SITE_NAME } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const job = await getJob((await params).id);
  return { title: job ? `Apply — ${job.title}` : 'Not found' };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJob((await params).id);
  if (!job) notFound();

  const apply = applyTarget(job);

  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
      <ButtonLink href={`/jobs/${job.id}`} variant="bare" size="sm" className="-ml-3">
        <ChevronLeft size={14} />
        Back to job
      </ButtonLink>

      <p className={`${monoUi} ${muted} mt-6`}>Application</p>
      <h1 className="mt-3 text-page-title">{job.title}</h1>
      <p className={`${mono.employer} mt-2 ${muted}`}>
        <JobByline
          employer={job.employer}
          city={job.city}
          province={job.province}
          extra={formatPay(job)}
        />
      </p>

      <div className="mt-12">
        {apply.external ? (
          <div className="border border-ink px-8 py-12 text-center">
            <p className={monoUi}>Apply on the original listing</p>
            <p className={`mt-4 text-body ${muted}`}>
              This role is aggregated from an external board. Applications go
              through the source listing, not {SITE_NAME}.
            </p>
            <ButtonAnchor
              href={apply.href}
              className="mt-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue to listing
            </ButtonAnchor>
          </div>
        ) : (
          <ApplyForm jobId={job.id} jobTitle={job.title} />
        )}
      </div>
    </main>
  );
}
