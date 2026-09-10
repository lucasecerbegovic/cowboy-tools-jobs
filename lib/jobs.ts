import type { TradeSlug } from '@/lib/trades';
import { isTradeSlug } from '@/lib/trades';
import {
  displayEmployerName,
  resolveEmployerLogo,
} from '@/lib/employer-logo';
import { formatJobTitle } from '@/lib/format-title';
import { locationMatches } from '@/lib/ingest/regions';

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'apprenticeship';

export type Trade =
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'carpentry'
  | 'welding'
  | 'heavy-equipment'
  | 'millwright'
  | 'other';

export type JobSource = 'employer' | 'job_bank' | 'adzuna';

export type Job = {
  id: string;
  source: JobSource;
  title: string;
  employer: string;
  employerSlug: string;
  city: string;
  province: string;
  country: string;
  trade: Trade;
  type: EmploymentType;
  union: boolean;
  /** Omit both to render PAY NOT LISTED — the slot never collapses. */
  payMin?: number;
  payMax?: number;
  payUnit?: 'hr' | 'yr';
  experience: string;
  postedDaysAgo: number;
  closesInDays?: number;
  summary: string;
  responsibilities: string[];
  applyUrl?: string;
  employerLogo?: string;
};

export const TRADE_LABELS: Record<Trade, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC & Refrigeration',
  carpentry: 'Carpentry',
  welding: 'Welding',
  'heavy-equipment': 'Heavy Equipment',
  millwright: 'Millwright',
  other: 'Other trades',
};

export const TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  apprenticeship: 'Apprenticeship',
};

export const SOURCE_LABELS: Record<JobSource, string> = {
  employer: 'Employer',
  job_bank: 'Job Bank',
  adzuna: 'Adzuna',
};

const INGEST_TO_UI: Record<TradeSlug, Trade> = {
  electrician: 'electrical',
  plumber: 'plumbing',
  hvac: 'hvac',
  carpenter: 'carpentry',
  welder: 'welding',
  heavy_equipment: 'heavy-equipment',
  millwright: 'millwright',
  other: 'other',
};

const UI_TO_INGEST: Record<Trade, TradeSlug> = {
  electrical: 'electrician',
  plumbing: 'plumber',
  hvac: 'hvac',
  carpentry: 'carpenter',
  welding: 'welder',
  'heavy-equipment': 'heavy_equipment',
  millwright: 'millwright',
  other: 'other',
};

export function isTrade(value: string): value is Trade {
  return Object.hasOwn(TRADE_LABELS, value);
}

export function isEmploymentType(value: string): value is EmploymentType {
  return Object.hasOwn(TYPE_LABELS, value);
}

export function isJobSource(value: string): value is JobSource {
  return Object.hasOwn(SOURCE_LABELS, value);
}

export function toUiTrade(slug: string): Trade {
  if (isTradeSlug(slug)) return INGEST_TO_UI[slug];
  if (isTrade(slug)) return slug;
  return 'other';
}

export function toIngestTrade(trade: Trade): TradeSlug {
  return UI_TO_INGEST[trade];
}

export type JobRecord = {
  id: string;
  source: string;
  title: string;
  company: string;
  description: string;
  trade: string;
  country: string;
  region: string | null;
  city: string | null;
  isApprenticeship: boolean;
  employmentType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  payUnit: string | null;
  applyUrl: string | null;
  postedAt: Date;
  expiresAt: Date | null;
  union: boolean;
  experience: string;
  responsibilities: unknown;
  employerSlug: string;
  logoUrl?: string | null;
  website?: string | null;
};

export function mapEmploymentType(
  isApprenticeship: boolean,
  employmentType: string | null,
): EmploymentType {
  if (isApprenticeship) return 'apprenticeship';
  const t = (employmentType ?? '').toLowerCase();
  if (t.includes('part')) return 'part-time';
  if (
    t.includes('contract') ||
    t.includes('seasonal') ||
    t.includes('term') ||
    t.includes('casual')
  ) {
    return 'contract';
  }
  return 'full-time';
}

export function mapPayUnit(
  payUnit: string | null,
  salaryMax: number | null,
  salaryMin: number | null,
): 'hr' | 'yr' | undefined {
  const raw = (payUnit ?? '').toLowerCase();
  if (raw === 'hr' || raw.includes('hour') || raw === 'ph') return 'hr';
  if (
    raw === 'yr' ||
    raw.includes('year') ||
    raw.includes('annum') ||
    raw === 'pa'
  ) {
    return 'yr';
  }
  const max = salaryMax ?? salaryMin;
  if (max == null) return undefined;
  return max > 200 ? 'yr' : 'hr';
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export function mapJobRecord(row: JobRecord): Job {
  const payMin = row.salaryMin ?? undefined;
  const payMax = row.salaryMax ?? undefined;
  const postedDaysAgo = Math.max(
    0,
    Math.floor((Date.now() - row.postedAt.getTime()) / 86_400_000),
  );
  const closesInDays =
    row.expiresAt && row.expiresAt.getTime() > Date.now()
      ? Math.max(
          0,
          Math.ceil((row.expiresAt.getTime() - Date.now()) / 86_400_000),
        )
      : undefined;

  return {
    id: row.id,
    source: isJobSource(row.source) ? row.source : 'employer',
    title: formatJobTitle(row.title),
    employer: displayEmployerName(row.company),
    employerSlug: row.employerSlug,
    city: row.city || row.region || '—',
    province: row.region || row.country,
    country: row.country,
    trade: toUiTrade(row.trade),
    type: mapEmploymentType(row.isApprenticeship, row.employmentType),
    union: row.union,
    payMin: payMin != null && payMax != null ? payMin : undefined,
    payMax: payMin != null && payMax != null ? payMax : undefined,
    payUnit: mapPayUnit(row.payUnit, row.salaryMax, row.salaryMin),
    experience: row.experience || 'See listing',
    postedDaysAgo,
    closesInDays,
    summary: row.description,
    responsibilities: asStringList(row.responsibilities),
    applyUrl: row.applyUrl ?? undefined,
    employerLogo: resolveEmployerLogo({
      name: displayEmployerName(row.company),
      slug: row.employerSlug,
      logoUrl: row.logoUrl,
      website: row.website,
    }),
  };
}

export function formatPay(job: Job): string {
  if (job.payMin === undefined || job.payMax === undefined) {
    return 'Pay not listed';
  }
  const unit = job.payUnit === 'yr' ? '/yr' : '/hr';
  return `$${job.payMin}–$${job.payMax}${unit}`;
}

export function formatPosted(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

export type Filters = {
  q?: string;
  loc?: string;
  trade: Trade[];
  type: EmploymentType[];
  union: boolean;
};

export function filterJobs(jobs: Job[], f: Filters): Job[] {
  return jobs.filter((j) => {
    if (f.q) {
      const hay = `${j.title} ${j.employer} ${TRADE_LABELS[j.trade]}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    if (f.loc && !locationMatches(j.city, j.province, j.country, f.loc)) {
      return false;
    }
    if (f.trade.length && !f.trade.includes(j.trade)) return false;
    if (f.type.length && !f.type.includes(j.type)) return false;
    if (f.union && !j.union) return false;
    return true;
  });
}

/** Facet counts ignore the facet's own selection, so counts stay useful. */
export function countBy<K extends string>(
  jobs: Job[],
  key: (j: Job) => K,
): Record<string, number> {
  return jobs.reduce<Record<string, number>>((acc, j) => {
    const k = key(j);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

export function applyTarget(job: Job): { href: string; external: boolean } {
  switch (job.source) {
    case 'employer':
      return { href: `/jobs/${job.id}/apply`, external: false };
    case 'job_bank':
    case 'adzuna':
      return {
        href: job.applyUrl || `/jobs/${job.id}/apply`,
        external: Boolean(job.applyUrl),
      };
    default: {
      const exhaustive: never = job.source;
      return exhaustive;
    }
  }
}
