/** Domain model + sample data. Replace the array with a real query later. */

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
  | 'heavy-equipment';

export type Job = {
  id: string;
  title: string;
  employer: string;
  verified: boolean;
  city: string;
  province: string;
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
};

export const TRADE_LABELS: Record<Trade, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC & Refrigeration',
  carpentry: 'Carpentry',
  welding: 'Welding',
  'heavy-equipment': 'Heavy Equipment',
};

export const TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  apprenticeship: 'Apprenticeship',
};

export const JOBS: Job[] = [
  {
    id: 'je-4401',
    title: 'Journeyman Electrician',
    employer: 'Northline Electric',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    trade: 'electrical',
    type: 'full-time',
    union: true,
    payMin: 38,
    payMax: 46,
    payUnit: 'hr',
    experience: '4+ years post-ticket',
    postedDaysAgo: 2,
    closesInDays: 5,
    summary:
      'Commercial and light industrial service work across the Calgary region. Company truck, tools allowance, and a four-day rotation.',
    responsibilities: [
      'Install, troubleshoot and repair commercial distribution systems',
      'Read and interpret drawings, schematics and CEC requirements',
      'Mentor apprentices on site and sign off on logged hours',
      'Complete service documentation before end of shift',
    ],
  },
  {
    id: 'pl-2210',
    title: 'Plumber — Service & Repair',
    employer: 'Bow Valley Mechanical',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    trade: 'plumbing',
    type: 'full-time',
    union: false,
    payMin: 34,
    payMax: 42,
    payUnit: 'hr',
    experience: 'Red Seal required',
    postedDaysAgo: 1,
    summary:
      'Residential and small commercial service calls. Dispatch is routed from a central office; most days run five to seven calls.',
    responsibilities: [
      'Diagnose and repair supply, drainage and venting systems',
      'Quote work on site and process payment through the field app',
      'Maintain truck stock and flag reorders weekly',
    ],
  },
  {
    id: 'hv-1180',
    title: 'HVAC Technician',
    employer: 'Chinook Climate',
    verified: false,
    city: 'Edmonton',
    province: 'AB',
    trade: 'hvac',
    type: 'full-time',
    union: false,
    payMin: 36,
    payMax: 44,
    payUnit: 'hr',
    experience: '3+ years',
    postedDaysAgo: 4,
    summary:
      'Rooftop unit maintenance and replacement for a portfolio of retail sites. Winter on-call rotation is shared across six techs.',
    responsibilities: [
      'Service RTUs, split systems and make-up air units',
      'Perform seasonal preventative maintenance to a checklist',
      'Carry gas ticket and maintain refrigerant handling records',
    ],
  },
  {
    id: 'ap-9902',
    title: 'Electrical Apprentice — 2nd Year',
    employer: 'Northline Electric',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    trade: 'electrical',
    type: 'apprenticeship',
    union: true,
    payMin: 24,
    payMax: 28,
    payUnit: 'hr',
    experience: '1st year complete',
    postedDaysAgo: 2,
    summary:
      'Indentured position with scheduled technical training and paid book time. Hours are logged and signed weekly.',
    responsibilities: [
      'Support journeymen on commercial installations',
      'Prepare and maintain material and tools on site',
      'Attend scheduled technical training blocks',
    ],
  },
  {
    id: 'we-7714',
    title: 'CWB Welder — Structural',
    employer: 'Prairie Steel Fabrication',
    verified: true,
    city: 'Red Deer',
    province: 'AB',
    trade: 'welding',
    type: 'full-time',
    union: false,
    payMin: 35,
    payMax: 45,
    payUnit: 'hr',
    experience: 'CWB All-Position',
    postedDaysAgo: 6,
    closesInDays: 2,
    summary:
      'Shop-based structural fabrication. Straight days, no camp work, climate-controlled bays.',
    responsibilities: [
      'FCAW and SMAW on structural assemblies to CSA W59',
      'Interpret fabrication drawings and weld symbols',
      'Perform visual inspection and correct defects before QC',
    ],
  },
  {
    id: 'he-3350',
    title: 'Heavy Equipment Operator',
    employer: 'Foothills Earthworks',
    verified: false,
    city: 'Lethbridge',
    province: 'AB',
    trade: 'heavy-equipment',
    type: 'contract',
    union: false,
    experience: '5+ years excavator',
    postedDaysAgo: 3,
    summary:
      'Seasonal site prep and utility trenching. Eight-month contract with likely renewal into next season.',
    responsibilities: [
      'Operate excavator and dozer for grading and trenching',
      'Complete daily pre-trip inspections and log defects',
      'Work to grade stakes and GPS control',
    ],
  },
  {
    id: 'ca-5521',
    title: 'Finish Carpenter',
    employer: 'Ridgeline Interiors',
    verified: true,
    city: 'Canmore',
    province: 'AB',
    trade: 'carpentry',
    type: 'full-time',
    union: false,
    payMin: 32,
    payMax: 40,
    payUnit: 'hr',
    experience: '3+ years finishing',
    postedDaysAgo: 8,
    summary:
      'High-end residential millwork and trim. Small crew, long-tenure shop, most projects run six to twelve weeks.',
    responsibilities: [
      'Install custom millwork, stair parts and trim packages',
      'Scribe and fit to out-of-square existing conditions',
      'Coordinate with cabinet shop on shop drawings',
    ],
  },
  {
    id: 'pl-6612',
    title: 'Plumbing Apprentice — 3rd Year',
    employer: 'Bow Valley Mechanical',
    verified: true,
    city: 'Airdrie',
    province: 'AB',
    trade: 'plumbing',
    type: 'apprenticeship',
    union: false,
    payMin: 26,
    payMax: 30,
    payUnit: 'hr',
    experience: '2nd year complete',
    postedDaysAgo: 5,
    summary:
      'Rough-in and finish on multi-family residential. Consistent local work, home every night.',
    responsibilities: [
      'Assist with rough-in of supply and DWV systems',
      'Pressure test and document results',
      'Keep site organized and material staged',
    ],
  },
  {
    id: 'hv-8830',
    title: 'Refrigeration Mechanic',
    employer: 'Chinook Climate',
    verified: false,
    city: 'Calgary',
    province: 'AB',
    trade: 'hvac',
    type: 'full-time',
    union: false,
    payMin: 42,
    payMax: 52,
    payUnit: 'hr',
    experience: 'Red Seal RSE',
    postedDaysAgo: 11,
    summary:
      'Supermarket and cold storage refrigeration. Rack systems, CO2 transcritical experience an asset.',
    responsibilities: [
      'Service parallel rack systems and walk-in units',
      'Diagnose controls and superheat/subcool faults',
      'Maintain refrigerant logs to federal requirements',
    ],
  },
  {
    id: 'el-1204',
    title: 'Industrial Electrician',
    employer: 'Cascade Industrial Services',
    verified: true,
    city: 'Fort McMurray',
    province: 'AB',
    trade: 'electrical',
    type: 'contract',
    union: true,
    payMin: 52,
    payMax: 58,
    payUnit: 'hr',
    experience: 'Red Seal + 5 years industrial',
    postedDaysAgo: 7,
    summary:
      'Site-based turnaround work on a 14/7 rotation. Camp and flights provided from Calgary or Edmonton.',
    responsibilities: [
      'Terminate and test motor control and instrumentation circuits',
      'Work to lockout and permit requirements without exception',
      'Support commissioning and loop checks',
    ],
  },
  {
    id: 'ca-4478',
    title: 'Framing Carpenter',
    employer: 'Ridgeline Interiors',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    trade: 'carpentry',
    type: 'part-time',
    union: false,
    payMin: 28,
    payMax: 34,
    payUnit: 'hr',
    experience: '2+ years',
    postedDaysAgo: 14,
    summary:
      'Three to four days a week on residential infill. Suits someone winding down from full-time or running their own side work.',
    responsibilities: [
      'Frame walls, floors and roof systems to drawings',
      'Set and brace engineered components',
      'Maintain a clean and safe work area',
    ],
  },
  {
    id: 'we-2295',
    title: 'Pipe Welder — B-Pressure',
    employer: 'Prairie Steel Fabrication',
    verified: true,
    city: 'Grande Prairie',
    province: 'AB',
    trade: 'welding',
    type: 'contract',
    union: false,
    payMin: 48,
    payMax: 62,
    payUnit: 'hr',
    experience: 'B-Pressure ticket required',
    postedDaysAgo: 9,
    summary:
      'Field pipe work on gathering systems. Rig welders welcome; truck rate negotiated separately.',
    responsibilities: [
      'Weld carbon steel pipe to B-Pressure standards',
      'Pass third-party X-ray inspection',
      'Maintain own rig and consumables where applicable',
    ],
  },
];

export function formatPay(job: Job): string {
  if (job.payMin === undefined || job.payMax === undefined) {
    return 'Pay not listed';
  }
  const unit = job.payUnit === 'yr' ? '/yr' : '/hr';
  return `$${job.payMin}–${job.payMax}${unit}`;
}

export function formatPosted(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
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
    if (f.loc) {
      const hay = `${j.city} ${j.province}`.toLowerCase();
      if (!hay.includes(f.loc.toLowerCase())) return false;
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
