import { TRADE_LABELS, type Job, type Trade } from '@/lib/jobs';
import { resolveEmployerLogo } from '@/lib/employer-logo';

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

export function toEmployer(row: EmployerRecord, jobs: Job[]): Employer {
  const mine = jobs.filter((j) => j.employerSlug === row.slug);
  const seen = new Set<Trade>();
  for (const j of mine) seen.add(j.trade);
  const trades = (Object.keys(TRADE_LABELS) as Trade[]).filter((t) => seen.has(t));
  return {
    slug: row.slug,
    name: row.name,
    verified: row.verified,
    city: row.city,
    province: row.province,
    country: row.country,
    founded: row.founded ?? undefined,
    size: row.size ?? undefined,
    about: row.about,
    trades,
    openRoles: mine.length,
    website: row.website ?? undefined,
    logoUrl: resolveEmployerLogo({
      name: row.name,
      slug: row.slug,
      logoUrl: row.logoUrl,
      website: row.website,
    }),
  };
}

export type EmployerFilters = { q?: string; trade: Trade[] };

export function filterEmployers(
  employers: Employer[],
  f: EmployerFilters,
): Employer[] {
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
