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
 * Reads now go through the Next data cache (shared across instances) for 10
 * minutes. postJob() revalidates the tag so new posts still go live
 * immediately.
 */
export const JOBS_CACHE_TAG = 'jobs';
const CACHE_SECONDS = 600;

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

/*
 * The full board is ~3.3 MB as mapped jobs, over the 2 MB data-cache item
 * limit. List views only need the listing-row fields, so cache a slim copy in
 * chunks that each fit comfortably under the limit.
 */
const LIST_CHUNK = 1000;

const cachedListChunk = unstable_cache(
  async (index: number): Promise<Job[]> => {
    const rows = await prisma.job.findMany({
      where: { country: 'CA' },
      orderBy: [{ postedAt: 'desc' }, { id: 'asc' }],
      skip: index * LIST_CHUNK,
      take: LIST_CHUNK,
      select: {
        id: true,
        source: true,
        title: true,
        company: true,
        trade: true,
        country: true,
        region: true,
        city: true,
        isApprenticeship: true,
        employmentType: true,
        salaryMin: true,
        salaryMax: true,
        payUnit: true,
        postedAt: true,
        expiresAt: true,
        union: true,
        employerSlug: true,
        employer: { select: { logoUrl: true, website: true } },
      },
    });
    return rows.map((row) => {
      const job = toMappedJob({
        ...row,
        description: '',
        applyUrl: null,
        experience: '',
        responsibilities: null,
      });
      return { ...job, summary: '', responsibilities: [] };
    });
  },
  ['jobs-list-chunk-v1'],
  { revalidate: CACHE_SECONDS, tags: [JOBS_CACHE_TAG] },
);

async function readAllListJobs(): Promise<Job[]> {
  const total = await cachedCount();
  const chunks = await Promise.all(
    Array.from({ length: Math.max(1, Math.ceil(total / LIST_CHUNK)) }, (_, i) =>
      cachedListChunk(i),
    ),
  );
  // Chunks can expire at different times; never render a job twice.
  const seen = new Set<string>();
  const jobs: Job[] = [];
  for (const job of chunks.flat()) {
    if (seen.has(job.id)) continue;
    seen.add(job.id);
    jobs.push(job);
  }
  return jobs;
}

/**
 * With `take`, full jobs for the homepage. Without it, the whole board for
 * /jobs with listing-row fields only (summary, responsibilities, applyUrl and
 * experience are blank; use getJob() for a detail view).
 */
export async function listJobs(opts: { take?: number } = {}): Promise<Job[]> {
  if (opts.take !== undefined) return cachedRecent(opts.take);
  return readAllListJobs();
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
