import { unstable_cache } from 'next/cache';
import { isGenericEmployerName } from '@/lib/employer-logo';
import { prisma } from '@/lib/prisma';
import {
  toEmployer,
  toEmployerCard,
  sortEmployersByOpenRoles,
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

/*
 * Turso's free plan blocks every read once the monthly row-read quota is
 * spent ("SQL read operations are forbidden"), which took the whole site down
 * from Sep 15 to Oct 1 2026. Every page used to hit the database on every
 * request (/jobs reads the full table), so crawler traffic burned the quota.
 * Reads now go through the Next data cache (shared across instances) plus a
 * short in-memory memo for the full list, which can exceed the 2 MB data-cache
 * item limit. postJob() calls revalidateJobs() so new posts still go live.
 */
export const JOBS_CACHE_TAG = 'jobs';
const CACHE_SECONDS = 600;

let memoAll: { at: number; jobs: Job[] } | undefined;

/** Call after any write to jobs/employers. */
export function clearJobsMemo(): void {
  memoAll = undefined;
}

const cachedCount = unstable_cache(
  async () => prisma.job.count({ where: { country: 'CA' } }),
  ['jobs-count-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

export async function countJobs(): Promise<number> {
  return cachedCount();
}

async function readJobs(take?: number): Promise<Job[]> {
  const rows = await prisma.job.findMany({
    where: { country: 'CA' },
    orderBy: { postedAt: 'desc' },
    take,
    include: { employer: true },
  });
  return rows.map(toMappedJob);
}

const cachedRecent = unstable_cache(
  async (take: number) => readJobs(take),
  ['jobs-recent-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

const cachedAll = unstable_cache(
  async () => readJobs(),
  ['jobs-all-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

export async function listJobs(opts: { take?: number } = {}): Promise<Job[]> {
  if (opts.take !== undefined) return cachedRecent(opts.take);
  if (memoAll && Date.now() - memoAll.at < CACHE_SECONDS * 1000) {
    return memoAll.jobs;
  }
  const jobs = await cachedAll();
  memoAll = { at: Date.now(), jobs };
  return jobs;
}

const cachedJob = unstable_cache(
  async (id: string): Promise<Job | null> => {
    const row = await prisma.job.findUnique({
      where: { id },
      include: { employer: true },
    });
    if (!row || row.country !== 'CA') return null;
    return toMappedJob(row);
  },
  ['job-by-id-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

export async function getJob(id: string): Promise<Job | undefined> {
  return (await cachedJob(id)) ?? undefined;
}

const cachedEmployerVerified = unstable_cache(
  async (slug: string): Promise<boolean> => {
    const row = await prisma.employer.findUnique({
      where: { slug },
      select: { verified: true, country: true },
    });
    return Boolean(row && row.country === 'CA' && row.verified);
  },
  ['employer-verified-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

/** One-row lookup; the job page only needs the verified flag. */
export async function isEmployerVerified(slug: string): Promise<boolean> {
  return cachedEmployerVerified(slug);
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
  return sortEmployersByOpenRoles(
    employers
      .filter((e) => !isGenericEmployerName(e.name))
      .map((e) => toEmployerCard(e, bySlug.get(e.slug) ?? [])),
  );
}

export async function getEmployer(slug: string): Promise<Employer | undefined> {
  const [row, jobs] = await Promise.all([
    prisma.employer.findUnique({ where: { slug } }),
    jobsForEmployer(slug),
  ]);
  if (!row || row.country !== 'CA') return undefined;
  return toEmployer(row, jobs);
}
