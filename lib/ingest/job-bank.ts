import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { IngestResult } from '@/lib/ingest/types';
import { emptyCounts } from '@/lib/ingest/types';
import { persistIngest } from '@/lib/ingest/persist';
import { parseJobBankCsv } from '@/lib/ingest/job-bank-parse';
import {
  resolveRegionFilter,
  type RegionFilter,
} from '@/lib/ingest/regions';

export const JOB_BANK_DATASET_URL =
  'https://open.canada.ca/data/en/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072';

/** Monthly all-postings snapshot (Open Government Licence – Canada). Newest file as of Sep 2026. */
export const DEFAULT_JOB_BANK_CSV_URL =
  'https://open.canada.ca/data/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072/resource/07546deb-70f5-4638-b34b-7c4321264972/download/job-bank-open-data-all-job-postings-en-aug2026.csv';

export { parseJobBankCsv };

export async function ingestJobBank(options?: {
  csvText?: string;
  live?: boolean;
  regions?: RegionFilter;
  west?: boolean;
}): Promise<IngestResult> {
  const counts = emptyCounts();
  try {
    const regions = resolveRegionFilter(options);
    const csvText = options?.csvText ?? (await loadJobBankCsv(options?.live));
    const jobs = parseJobBankCsv(csvText, { regions });
    counts.fetched = jobs.length;
    console.log(
      `Job Bank: ${jobs.length} trades jobs` +
        (regions === 'west'
          ? ' (Western Canada)'
          : Array.isArray(regions)
            ? ` (${regions.join(', ')})`
            : ''),
    );
    const persisted = await persistIngest('job_bank', jobs);
    counts.upserted = persisted.upserted;
    counts.skipped = persisted.skipped;
    return { source: 'job_bank', counts };
  } catch (error) {
    return {
      source: 'job_bank',
      counts,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function loadJobBankCsv(live?: boolean): Promise<Buffer> {
  const explicitPath = process.env.JOB_BANK_CSV_PATH;
  if (explicitPath) {
    return readFile(resolve(explicitPath));
  }

  const shouldFetchLive = live || Boolean(process.env.JOB_BANK_CSV_URL);
  if (shouldFetchLive) {
    const url = process.env.JOB_BANK_CSV_URL || DEFAULT_JOB_BANK_CSV_URL;
    console.log(`Downloading Job Bank CSV: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Job Bank CSV download failed: ${response.status} ${url}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    console.log(
      `Downloaded Job Bank CSV (${(buffer.length / 1_000_000).toFixed(1)} MB)`,
    );
    return buffer;
  }

  return readFile(resolve(process.cwd(), 'data/job-bank-fixture.csv'));
}
