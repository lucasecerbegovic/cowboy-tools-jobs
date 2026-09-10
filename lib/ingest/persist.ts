import type { JobSource, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { formatJobTitle } from '@/lib/format-title';
import type { IngestCounts, NormalizedJob } from '@/lib/ingest/types';
import {
  displayEmployerName,
  inferEmployerBranding,
  isGenericEmployerName,
} from '@/lib/employer-logo';
import { SITE_NAME } from '@/lib/site';

type DbClient = Prisma.TransactionClient | typeof prisma;

const PERSIST_CHUNK = 40;

export function employerSlugFor(
  name: string,
  source: JobSource,
  sourceId: string,
): string {
  if (isGenericEmployerName(name)) return slugify(`${source}-${sourceId}`);
  return slugify(name);
}

function aboutForSource(source: JobSource, name: string): string {
  switch (source) {
    case 'employer':
      return `${name} posts roles directly on ${SITE_NAME}.`;
    case 'job_bank':
      return `Listings aggregated from Job Bank open data (Employment and Social Development Canada), licensed under the Open Government Licence – Canada.`;
    case 'adzuna':
      return `Listings aggregated from Adzuna. Jobs by Adzuna.`;
    default: {
      const exhaustive: never = source;
      return exhaustive;
    }
  }
}

function inferPayUnit(job: NormalizedJob): string | null {
  const raw =
    job.raw && typeof job.raw === 'object' && !Array.isArray(job.raw)
      ? (job.raw as Record<string, unknown>)
      : {};
  const per = String(raw.salaryPer ?? raw.rateInterval ?? '').toUpperCase();
  if (per.includes('HOUR') || per === 'PH' || per === 'HR') return 'hr';
  if (per.includes('YEAR') || per === 'PA' || per === 'YR' || per.includes('ANNUM')) {
    return 'yr';
  }
  const max = job.salaryMax ?? job.salaryMin;
  if (max != null && max > 200) return 'yr';
  if (max != null) return 'hr';
  return null;
}

export async function ensureEmployer(
  input: {
    name: string;
    source: JobSource;
    sourceId: string;
    city: string | null;
    region: string | null;
    country: string;
    verified?: boolean;
    logoUrl?: string | null;
    website?: string | null;
    applyUrl?: string | null;
    applyEmail?: string | null;
  },
  db: DbClient = prisma,
): Promise<string> {
  const name = displayEmployerName(input.name);
  const slug = employerSlugFor(input.name, input.source, input.sourceId);
  const city = input.city || '—';
  const province = input.region || input.country;
  const branding = inferEmployerBranding({
    name,
    logoUrl: input.logoUrl,
    website: input.website,
    applyUrl: input.applyUrl,
    applyEmail: input.applyEmail,
  });

  await db.employer.upsert({
    where: { slug },
    update: {
      name,
      city,
      province,
      country: input.country,
      ...(branding.website ? { website: branding.website } : {}),
      ...(branding.logoUrl ? { logoUrl: branding.logoUrl } : {}),
    },
    create: {
      slug,
      name,
      verified: input.verified ?? input.source === 'employer',
      city,
      province,
      country: input.country,
      about: aboutForSource(input.source, name),
      website: branding.website,
      logoUrl: branding.logoUrl,
    },
  });

  return slug;
}

async function persistOneJob(db: DbClient, job: NormalizedJob): Promise<void> {
  const company = displayEmployerName(job.company);
  const employerSlug = await ensureEmployer(
    {
      name: job.company,
      source: job.source,
      sourceId: job.sourceId,
      city: job.city ?? null,
      region: job.region ?? null,
      country: job.country,
      logoUrl: job.logoUrl,
      website: job.website,
      applyUrl: job.applyUrl,
      applyEmail: job.applyEmail,
    },
    db,
  );

  await db.job.upsert({
    where: {
      source_sourceId: {
        source: job.source,
        sourceId: job.sourceId,
      },
    },
    update: {
      title: job.title,
      company,
      description: job.description,
      trade: job.trade,
      nocOrSoc: job.nocOrSoc ?? null,
      country: job.country,
      region: job.region ?? null,
      city: job.city ?? null,
      lat: job.lat ?? null,
      lng: job.lng ?? null,
      isApprenticeship: job.isApprenticeship,
      employmentType: job.employmentType ?? null,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryCurrency: job.salaryCurrency ?? null,
      payUnit: inferPayUnit(job),
      applyUrl: job.applyUrl ?? null,
      applyEmail: job.applyEmail ?? null,
      postedAt: job.postedAt,
      expiresAt: job.expiresAt ?? null,
      raw: job.raw ?? undefined,
      employerSlug,
    },
    create: {
      source: job.source,
      sourceId: job.sourceId,
      title: job.title,
      company,
      description: job.description,
      trade: job.trade,
      nocOrSoc: job.nocOrSoc ?? null,
      country: job.country,
      region: job.region ?? null,
      city: job.city ?? null,
      lat: job.lat ?? null,
      lng: job.lng ?? null,
      isApprenticeship: job.isApprenticeship,
      employmentType: job.employmentType ?? null,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryCurrency: job.salaryCurrency ?? null,
      payUnit: inferPayUnit(job),
      applyUrl: job.applyUrl ?? null,
      applyEmail: job.applyEmail ?? null,
      postedAt: job.postedAt,
      expiresAt: job.expiresAt ?? null,
      raw: job.raw ?? undefined,
      employerSlug,
    },
  });
}

export async function persistIngest(
  source: JobSource,
  jobs: NormalizedJob[],
): Promise<IngestCounts> {
  const ready: NormalizedJob[] = [];
  let skipped = 0;

  for (const job of jobs) {
    if (!job.title || !job.sourceId || job.country !== 'CA') {
      skipped += 1;
      continue;
    }
    ready.push({ ...job, title: formatJobTitle(job.title) });
  }

  for (let i = 0; i < ready.length; i += PERSIST_CHUNK) {
    const slice = ready.slice(i, i + PERSIST_CHUNK);
    await prisma.$transaction(
      async (tx) => {
        for (const job of slice) {
          await persistOneJob(tx, job);
        }
      },
      { timeout: 60_000, maxWait: 15_000 },
    );
    const done = Math.min(i + slice.length, ready.length);
    if (done === ready.length || done % 200 === 0) {
      console.log(`Persist ${source}: ${done}/${ready.length}`);
    }
  }

  return { fetched: jobs.length, upserted: ready.length, skipped };
}

export async function recordIngestRun(input: {
  source: string;
  startedAt: Date;
  counts?: IngestCounts | null;
  error?: string | null;
}) {
  return prisma.ingestRun.create({
    data: {
      source: input.source,
      startedAt: input.startedAt,
      finishedAt: new Date(),
      counts: input.counts ?? undefined,
      error: input.error ?? null,
    },
  });
}
