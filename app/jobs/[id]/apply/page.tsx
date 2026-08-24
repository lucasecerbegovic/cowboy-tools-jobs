import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApplyForm } from '@/components/apply-form';
import { ButtonLink } from '@/components/button';
import { ChevronLeft } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { formatPay, getJob } from '@/lib/jobs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const job = getJob((await params).id);
  return { title: job ? `Apply — ${job.title} — Tradesboard` : 'Not found' };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = getJob((await params).id);
  if (!job) notFound();

  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
      <ButtonLink href={`/jobs/${job.id}`} variant="bare" size="sm" className="-ml-3">
        <ChevronLeft size={14} />
        Back to job
      </ButtonLink>

      <p className={`${monoUi} ${muted} mt-6`}>Application</p>
      <h1 className="mt-3 text-page-title">{job.title}</h1>
      <p className={`${mono.employer} mt-2 ${muted}`}>
        {job.employer} · {job.city}, {job.province} · {formatPay(job)}
      </p>

      <div className="mt-12">
        <ApplyForm jobId={job.id} jobTitle={job.title} />
      </div>
    </main>
  );
}
