import { JOBS, TRADE_LABELS, type Job, type Trade } from '@/lib/jobs';

/** `verified` lives here rather than on Job — it is a property of the company,
 *  and duplicating it per listing lets the two drift. */
export type Employer = {
  slug: string;
  name: string;
  verified: boolean;
  city: string;
  province: string;
  founded: number;
  size: string;
  about: string;
};

export const EMPLOYERS: Employer[] = [
  {
    slug: 'northline-electric',
    name: 'Northline Electric',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    founded: 2004,
    size: '40–60 staff',
    about:
      'Commercial and light industrial electrical contractor working across the Calgary region. Runs a four-day rotation and indentures apprentices directly rather than through an agency.',
  },
  {
    slug: 'bow-valley-mechanical',
    name: 'Bow Valley Mechanical',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    founded: 1998,
    size: '25–40 staff',
    about:
      'Plumbing and mechanical service across residential and small commercial. Dispatch is centralised, and crews are home every night — no camp work.',
  },
  {
    slug: 'chinook-climate',
    name: 'Chinook Climate',
    verified: false,
    city: 'Edmonton',
    province: 'AB',
    founded: 2011,
    size: '15–25 staff',
    about:
      'HVAC and refrigeration service for retail portfolios and cold storage. Winter on-call is shared across the technician group.',
  },
  {
    slug: 'prairie-steel-fabrication',
    name: 'Prairie Steel Fabrication',
    verified: true,
    city: 'Red Deer',
    province: 'AB',
    founded: 1987,
    size: '60–90 staff',
    about:
      'Structural steel fabrication in climate-controlled bays, plus field pipe crews. Straight days in the shop.',
  },
  {
    slug: 'foothills-earthworks',
    name: 'Foothills Earthworks',
    verified: false,
    city: 'Lethbridge',
    province: 'AB',
    founded: 2015,
    size: '10–20 staff',
    about:
      'Site preparation, grading and utility trenching on a seasonal cycle. Most contracts renew into the following season.',
  },
  {
    slug: 'ridgeline-interiors',
    name: 'Ridgeline Interiors',
    verified: true,
    city: 'Canmore',
    province: 'AB',
    founded: 2009,
    size: '10–20 staff',
    about:
      'High-end residential millwork, trim and framing. Small crews, long tenure, projects running six to twelve weeks.',
  },
  {
    slug: 'cascade-industrial-services',
    name: 'Cascade Industrial Services',
    verified: true,
    city: 'Fort McMurray',
    province: 'AB',
    founded: 2001,
    size: '150+ staff',
    about:
      'Industrial electrical and instrumentation on turnaround rotations. Camp and flights provided from Calgary or Edmonton.',
  },
];

export function getEmployer(slug: string): Employer | undefined {
  return EMPLOYERS.find((e) => e.slug === slug);
}

export function jobsForEmployer(slug: string): Job[] {
  return JOBS.filter((j) => j.employerSlug === slug);
}

/** Distinct trades an employer is currently hiring for, in label order. */
export function employerTrades(slug: string): Trade[] {
  const seen = new Set<Trade>();
  for (const j of jobsForEmployer(slug)) seen.add(j.trade);
  return (Object.keys(TRADE_LABELS) as Trade[]).filter((t) => seen.has(t));
}

export function openRoleCount(slug: string): number {
  return jobsForEmployer(slug).length;
}

/** Employer for a job — the single place the two models are joined. */
export function employerOf(job: Job): Employer | undefined {
  return getEmployer(job.employerSlug);
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
    if (f.trade.length) {
      const trades = employerTrades(e.slug);
      if (!f.trade.some((t) => trades.includes(t))) return false;
    }
    return true;
  });
}
