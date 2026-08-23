import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { IngestResult } from "@/lib/ingest/types";
import { emptyCounts } from "@/lib/ingest/types";
import { persistIngest } from "@/lib/ingest/persist";
import { parseJobBankCsv } from "@/lib/ingest/job-bank-parse";

export const JOB_BANK_DATASET_URL =
  "https://open.canada.ca/data/en/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072";

export const DEFAULT_JOB_BANK_CSV_URL =
  "https://open.canada.ca/data/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072/resource/6f422ded-5d9b-4ce6-b471-92fe46d1c734/download/job-bank-open-data-all-job-postings-en-july2026.csv";

export { parseJobBankCsv };

export async function ingestJobBank(options?: {
  csvText?: string;
  live?: boolean;
}): Promise<IngestResult> {
  const counts = emptyCounts();
  try {
    const csvText = options?.csvText ?? (await loadJobBankCsv(options?.live));
    const jobs = parseJobBankCsv(csvText);
    counts.fetched = jobs.length;
    const persisted = await persistIngest("job_bank", jobs);
    counts.upserted = persisted.upserted;
    counts.skipped = persisted.skipped;
    return { source: "job_bank", counts };
  } catch (error) {
    return {
      source: "job_bank",
      counts,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function loadJobBankCsv(live?: boolean): Promise<string> {
  const explicitPath = process.env.JOB_BANK_CSV_PATH;
  if (explicitPath) {
    return readFile(resolve(explicitPath), "utf8");
  }

  const shouldFetchLive = live || Boolean(process.env.JOB_BANK_CSV_URL);
  if (shouldFetchLive) {
    const url = process.env.JOB_BANK_CSV_URL || DEFAULT_JOB_BANK_CSV_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Job Bank CSV download failed: ${response.status} ${url}`);
    }
    return response.text();
  }

  return readFile(resolve(process.cwd(), "data/job-bank-fixture.csv"), "utf8");
}
