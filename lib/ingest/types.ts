import type { JobSource, Prisma } from "@prisma/client";

export type IngestCounts = {
  fetched: number;
  upserted: number;
  skipped: number;
};

export type IngestResult = {
  source: JobSource | "all";
  skipped?: boolean;
  reason?: string;
  counts?: IngestCounts;
  error?: string;
};

export type NormalizedJob = {
  source: JobSource;
  sourceId: string;
  title: string;
  company: string;
  description: string;
  trade: string;
  nocOrSoc?: string | null;
  country: string;
  region?: string | null;
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
  isApprenticeship: boolean;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  applyUrl?: string | null;
  applyEmail?: string | null;
  postedAt: Date;
  expiresAt?: Date | null;
  raw?: Prisma.InputJsonValue;
};

export function emptyCounts(): IngestCounts {
  return { fetched: 0, upserted: 0, skipped: 0 };
}
