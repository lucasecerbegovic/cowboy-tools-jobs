import { TRADE_LABELS, type Job, type Trade } from '@/lib/jobs';
import {
  displayEmployerName,
  resolveEmployerLogo,
} from '@/lib/employer-logo';

export type Employer = {
  slug: string;
  name: string;
  verified: boolean;
  city: string;
  province: string;
  country: string;
  founded?: number;
  size?: string;
  about: string;
  trades: Trade[];
  openRoles: number;
  website?: string;
  logoUrl?: string;
};

export type EmployerRecord = {
  slug: string;
  name: string;
  verified: boolean;
  city: string;
  province: string;
  country: string;
  founded: number | null;
  size: string | null;
  about: string;
  website: string | null;
  logoUrl: string | null;
};

function tradesFromJobs(jobs: { trade: Trade }[]): Trade[] {
  const seen = new Set<Trade>();
  for (const j of jobs) seen.add(j.trade);
  return (Object.keys(TRADE_LABELS) as Trade[]).filter((t) => seen.has(t));
}

function employerMark(
  row: Pick<EmployerRecord, 'name' | 'slug' | 'logoUrl' | 'website'>,
): { name: string; logoUrl?: string } {
  const name = displayEmployerName(row.name);
  return {
    name,
    logoUrl: resolveEmployerLogo({
      name,
      slug: row.slug,
      logoUrl: row.logoUrl,
      website: row.website,
    }),
  };
}

export function toEmployer(row: EmployerRecord, jobs: Job[]): Employer {
  const mine = jobs.filter((j) => j.employerSlug === row.slug);
  const mark = employerMark(row);
  return {
    slug: row.slug,
    name: mark.name,
    verified: row.verified,
    city: row.city,
    province: row.province,
    country: row.country,
    founded: row.founded ?? undefined,
    size: row.size ?? undefined,
    about: row.about,
    trades: tradesFromJobs(mine),
    openRoles: mine.length,
    website: row.website ?? undefined,
    logoUrl: mark.logoUrl,
  };
}

/** Directory cards — no about/body, no unused profile fields. */
export type EmployerCard = Pick<
  Employer,
  'slug' | 'name' | 'verified' | 'city' | 'province' | 'trades' | 'openRoles' | 'logoUrl'
>;

export type EmployerJobTally = {
  employerSlug: string;
  trade: Trade;
};

export function toEmployerCard(
  row: Pick<
    EmployerRecord,
    'slug' | 'name' | 'verified' | 'city' | 'province' | 'logoUrl' | 'website'
  >,
  jobs: EmployerJobTally[],
): EmployerCard {
  const mine = jobs.filter((j) => j.employerSlug === row.slug);
  const mark = employerMark(row);
  return {
    slug: row.slug,
    name: mark.name,
    verified: row.verified,
    city: row.city,
    province: row.province,
    trades: tradesFromJobs(mine),
    openRoles: mine.length,
    logoUrl: mark.logoUrl,
  };
}

export type EmployerFilters = { q?: string; trade: Trade[] };

export function filterEmployers<
  T extends Pick<Employer, 'name' | 'city' | 'province' | 'trades'>,
>(employers: T[], f: EmployerFilters): T[] {
  return employers.filter((e) => {
    if (f.q) {
      const hay = `${e.name} ${e.city} ${e.province}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    if (f.trade.length && !f.trade.some((t) => e.trades.includes(t))) {
      return false;
    }
    return true;
  });
}

export function sortEmployersByOpenRoles<
  T extends Pick<Employer, 'name' | 'openRoles'>,
>(employers: T[]): T[] {
  return [...employers].sort(
    (a, b) => b.openRoles - a.openRoles || a.name.localeCompare(b.name),
  );
}
