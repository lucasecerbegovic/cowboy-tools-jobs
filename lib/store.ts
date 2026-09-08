import { prisma } from '@/lib/prisma';
import {
  toEmployer,
  toEmployerCard,
  type Employer,
  type EmployerCard,
} from '@/lib/employers';
import { mapJobRecord, toUiTrade, type Job, type JobRecord } from '@/lib/jobs';

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

export async function listEmployers(): Promise<EmployerCard[]> {
  const [employers, jobs] = await Promise.all([
    prisma.employer.findMany({
      where: { country: 'CA' },
      orderBy: { name: 'asc' },
      select: {
        slug: true,
        name: true,
        verified: true,
        city: true,
        province: true,
        logoUrl: true,
        website: true,
      },
    }),
    prisma.job.findMany({
      where: { country: 'CA' },
      select: { employerSlug: true, trade: true },
    }),
  ]);
  const tallies = jobs.map((j) => ({
    employerSlug: j.employerSlug,
    trade: toUiTrade(j.trade),
  }));
  const bySlug = new Map<string, typeof tallies>();
  for (const j of tallies) {
    const list = bySlug.get(j.employerSlug);
    if (list) list.push(j);
    else bySlug.set(j.employerSlug, [j]);
  }
  return employers.map((e) => toEmployerCard(e, bySlug.get(e.slug) ?? []));
}

export async function getEmployer(slug: string): Promise<Employer | undefined> {
  const [row, jobs] = await Promise.all([
    prisma.employer.findUnique({ where: { slug } }),
    jobsForEmployer(slug),
  ]);
  if (!row || row.country !== 'CA') return undefined;
  return toEmployer(row, jobs);
}
