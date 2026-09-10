import { displayEmployerName, jobByline } from '@/lib/employer-logo';
import type { Employer } from '@/lib/employers';
import {
  TRADE_LABELS,
  TYPE_LABELS,
  formatPay,
  type EmploymentType,
  type Job,
  type Trade,
} from '@/lib/jobs';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 } as const;

export type OgBadgeTone =
  | 'default'
  | EmploymentType
  | Trade
  | 'union'
  | 'success';

export type OgBadge = {
  label: string;
  tone: OgBadgeTone;
};

export type SiteOgCopy = {
  brand: string;
  locale: string;
  headline: string;
  description: string;
  trades: string;
};

export type JobOgCopy = {
  brand: string;
  headline: string;
  employer: string;
  pay: string;
  badges: OgBadge[];
};

export type EmployerOgCopy = {
  brand: string;
  headline: string;
  location: string;
  roles: string;
  verified: boolean;
  trades: OgBadge[];
};

const TRADE_STRIP = (Object.entries(TRADE_LABELS) as [keyof typeof TRADE_LABELS, string][])
  .filter(([slug]) => slug !== 'other')
  .map(([, label]) => label)
  .join(' · ');

export function siteOgCopy(): SiteOgCopy {
  return {
    brand: SITE_NAME,
    locale: 'Canada',
    headline: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    trades: TRADE_STRIP,
  };
}

export function jobOgCopy(job: Job): JobOgCopy {
  const badges: OgBadge[] = [
    { label: TYPE_LABELS[job.type], tone: job.type },
  ];
  if (job.union) badges.push({ label: 'Union', tone: 'union' });
  badges.push({ label: TRADE_LABELS[job.trade], tone: job.trade });

  return {
    brand: SITE_NAME,
    headline: job.title,
    employer: jobByline(job),
    pay: formatPay(job),
    badges,
  };
}

export function employerOgCopy(
  employer: Pick<
    Employer,
    'name' | 'city' | 'province' | 'openRoles' | 'verified' | 'trades'
  >,
): EmployerOgCopy {
  return {
    brand: SITE_NAME,
    headline: displayEmployerName(employer.name),
    location: `${employer.city}, ${employer.province}`,
    roles:
      employer.openRoles === 1
        ? '1 open role'
        : `${employer.openRoles} open roles`,
    verified: employer.verified,
    trades: employer.trades.map((t) => ({
      label: TRADE_LABELS[t],
      tone: t,
    })),
  };
}

export function fallbackOgCopy(headline: string): SiteOgCopy {
  return { ...siteOgCopy(), headline };
}
