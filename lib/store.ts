import { prisma } from '@/lib/prisma';
import { toEmployer, type Employer } from '@/lib/employers';
import { mapJobRecord, type Job, type JobRecord } from '@/lib/jobs';

type JobWithEmployer = JobRecord & {
  employer?: { logoUrl: string | null; website: string | null } | null;
};

function toMappedJob(row: JobWithEmployer): Job {
  return mapJobRecord({
    ...row,
    logoUrl: row.employer?.logoUrl ?? row.logoUrl ?? null,
    website: row.employer?.website ?? row.website ?? null,
  });
}

export async function countJobs(): Promise<number> {
  return prisma.job.count({ where: { country: 'CA' } });
}

export async function listJobs(opts: { take?: number } = {}): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { country: 'CA' },
    orderBy: { postedAt: 'desc' },
    take: opts.take,
    include: { employer: true },
  });
  return rows.map(toMappedJob);
}

export async function getJob(id: string): Promise<Job | undefined> {
  const row = await prisma.job.findUnique({
    where: { id },
    include: { employer: true },
  });
  if (!row || row.country !== 'CA') return undefined;
  return toMappedJob(row);
}

export async function jobsForEmployer(slug: string): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { employerSlug: slug, country: 'CA' },
    orderBy: { postedAt: 'desc' },
    include: { employer: true },
  });
  return rows.map(toMappedJob);
}

export async function listEmployers(): Promise<Employer[]> {
  const [employers, jobs] = await Promise.all([listEmployerRows(), listJobs()]);
  return employers.map((e) => toEmployer(e, jobs));
}

export async function getEmployer(slug: string): Promise<Employer | undefined> {
  const [row, jobs] = await Promise.all([
    prisma.employer.findUnique({ where: { slug } }),
    jobsForEmployer(slug),
  ]);
  if (!row || row.country !== 'CA') return undefined;
  return toEmployer(row, jobs);
}

async function listEmployerRows() {
  return prisma.employer.findMany({
    where: { country: 'CA' },
    orderBy: { name: 'asc' },
  });
}
