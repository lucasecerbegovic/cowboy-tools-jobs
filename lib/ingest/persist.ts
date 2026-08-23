import type { JobSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { IngestCounts, NormalizedJob } from "@/lib/ingest/types";

export async function persistIngest(
  source: JobSource,
  jobs: NormalizedJob[],
): Promise<IngestCounts> {
  let upserted = 0;
  let skipped = 0;

  for (const job of jobs) {
    if (!job.title || !job.sourceId) {
      skipped += 1;
      continue;
    }

    await prisma.job.upsert({
      where: {
        source_sourceId: {
          source: job.source,
          sourceId: job.sourceId,
        },
      },
      update: {
        title: job.title,
        company: job.company,
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
        applyUrl: job.applyUrl ?? null,
        applyEmail: job.applyEmail ?? null,
        postedAt: job.postedAt,
        expiresAt: job.expiresAt ?? null,
        raw: job.raw ?? undefined,
      },
      create: {
        source: job.source,
        sourceId: job.sourceId,
        title: job.title,
        company: job.company,
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
        applyUrl: job.applyUrl ?? null,
        applyEmail: job.applyEmail ?? null,
        postedAt: job.postedAt,
        expiresAt: job.expiresAt ?? null,
        raw: job.raw ?? undefined,
      },
    });
    upserted += 1;
  }

  return { fetched: jobs.length, upserted, skipped };
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
