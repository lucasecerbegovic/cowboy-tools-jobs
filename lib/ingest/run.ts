import type { JobSource } from '@prisma/client';
import { ingestAdzuna } from '@/lib/ingest/adzuna';
import { ingestJobBank } from '@/lib/ingest/job-bank';
import { recordIngestRun } from '@/lib/ingest/persist';
import type { RegionFilter } from '@/lib/ingest/regions';
import type { IngestResult } from '@/lib/ingest/types';

const SOURCES = ['job_bank', 'adzuna'] as const;
export type IngestSourceName = (typeof SOURCES)[number];

function isIngestSource(value: string): value is IngestSourceName {
  return (SOURCES as readonly string[]).includes(value);
}

async function runOne(
  source: IngestSourceName,
  options?: { liveJobBank?: boolean; regions?: RegionFilter; west?: boolean },
): Promise<IngestResult> {
  const startedAt = new Date();
  let result: IngestResult;

  switch (source) {
    case 'job_bank':
      result = await ingestJobBank({
        live: options?.liveJobBank,
        regions: options?.regions,
        west: options?.west,
      });
      break;
    case 'adzuna':
      result = await ingestAdzuna();
      break;
    default: {
      const exhaustive: never = source;
      throw new Error(`Unknown ingest source: ${exhaustive}`);
    }
  }

  await recordIngestRun({
    source: result.source as JobSource | string,
    startedAt,
    counts: result.counts ?? null,
    error: result.error ?? result.reason ?? null,
  });

  return result;
}

export async function runIngest(options?: {
  source?: string;
  liveJobBank?: boolean;
  regions?: RegionFilter;
  west?: boolean;
}): Promise<IngestResult[]> {
  const requested = options?.source ?? 'all';
  if (requested !== 'all' && !isIngestSource(requested)) {
    return [
      {
        source: 'all',
        error: `Unknown source "${requested}". Use job_bank, adzuna, or all.`,
      },
    ];
  }

  const sources: IngestSourceName[] =
    requested === 'all' ? [...SOURCES] : [requested];

  const results: IngestResult[] = [];
  for (const source of sources) {
    results.push(await runOne(source, options));
  }
  return results;
}

export { SOURCES, isIngestSource };
