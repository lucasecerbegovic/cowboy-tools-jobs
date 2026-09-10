import { jobByline } from '@/lib/employer-logo';
import { TRADE_LABELS, TYPE_LABELS, formatPay, type Job } from '@/lib/jobs';

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_ALT = 'Work in the trades. Jobs across Canada.';

export type OgCells = readonly [string, string, string, string];

export type SiteOgCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cells: OgCells;
};

export type JobOgCopy = {
  headline: string;
  employer: string;
  pay: string;
  cells: OgCells;
};

export function siteOgCopy(): SiteOgCopy {
  return {
    eyebrow: 'Jobs',
    headline: 'Work in the trades.',
    subhead: 'Jobs across Canada.',
    cells: ['Skilled Trades', 'Open Roles', 'Canada', 'Apply Direct'],
  };
}

export function jobOgCopy(job: Job): JobOgCopy {
  return {
    headline: job.title,
    employer: jobByline(job),
    pay: formatPay(job),
    cells: [
      TYPE_LABELS[job.type],
      TRADE_LABELS[job.trade],
      `${job.city}, ${job.province}`,
      job.union ? 'Union' : 'Open role',
    ],
  };
}
