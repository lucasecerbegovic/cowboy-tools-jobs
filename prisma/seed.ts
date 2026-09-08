import { PrismaClient, type JobSource, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SeedEmployer = {
  slug: string;
  name: string;
  verified: boolean;
  city: string;
  province: string;
  country: string;
  founded?: number;
  size?: string;
  about: string;
  website?: string;
  logoUrl?: string;
};

function mark(slug: string): string {
  return `/employer-logos/${slug}.svg`;
}

type SeedJob = {
  id: string;
  source: JobSource;
  sourceId: string;
  title: string;
  company: string;
  employerSlug: string;
  description: string;
  trade: string;
  nocOrSoc?: string;
  country: 'CA';
  region: string;
  city: string;
  isApprenticeship?: boolean;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: 'CAD';
  payUnit?: 'hr' | 'yr';
  applyUrl?: string;
  applyEmail?: string;
  postedAt: string;
  expiresAt?: string;
  union?: boolean;
  experience?: string;
  responsibilities?: string[];
};

const EMPLOYERS: SeedEmployer[] = [
  {
    slug: 'northline-electric',
    name: 'Northline Electric',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    country: 'CA',
    founded: 2004,
    size: '40–60 staff',
    about:
      'Commercial and light industrial electrical contractor working across the Calgary region. Runs a four-day rotation and indentures apprentices directly rather than through an agency.',
    logoUrl: mark('northline-electric'),
  },
  {
    slug: 'bow-valley-mechanical',
    name: 'Bow Valley Mechanical',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    country: 'CA',
    founded: 1998,
    size: '25–40 staff',
    about:
      'Plumbing and mechanical service across residential and small commercial. Dispatch is centralised, and crews are home every night — no camp work.',
    logoUrl: mark('bow-valley-mechanical'),
  },
  {
    slug: 'chinook-climate',
    name: 'Chinook Climate',
    verified: false,
    city: 'Edmonton',
    province: 'AB',
    country: 'CA',
    founded: 2011,
    size: '15–25 staff',
    about:
      'HVAC and refrigeration service for retail portfolios and cold storage. Winter on-call is shared across the technician group.',
    logoUrl: mark('chinook-climate'),
  },
  {
    slug: 'prairie-steel-fabrication',
    name: 'Prairie Steel Fabrication',
    verified: true,
    city: 'Red Deer',
    province: 'AB',
    country: 'CA',
    founded: 1987,
    size: '60–90 staff',
    about:
      'Structural steel fabrication in climate-controlled bays, plus field pipe crews. Straight days in the shop.',
    logoUrl: mark('prairie-steel-fabrication'),
  },
  {
    slug: 'foothills-earthworks',
    name: 'Foothills Earthworks',
    verified: false,
    city: 'Lethbridge',
    province: 'AB',
    country: 'CA',
    founded: 2015,
    size: '10–20 staff',
    about:
      'Site preparation, grading and utility trenching on a seasonal cycle. Most contracts renew into the following season.',
    logoUrl: mark('foothills-earthworks'),
  },
  {
    slug: 'ridgeline-interiors',
    name: 'Ridgeline Interiors',
    verified: true,
    city: 'Canmore',
    province: 'AB',
    country: 'CA',
    founded: 2009,
    size: '10–20 staff',
    about:
      'High-end residential millwork, trim and framing. Small crews, long tenure, projects running six to twelve weeks.',
    logoUrl: mark('ridgeline-interiors'),
  },
  {
    slug: 'cascade-industrial-services',
    name: 'Cascade Industrial Services',
    verified: true,
    city: 'Fort McMurray',
    province: 'AB',
    country: 'CA',
    founded: 2001,
    size: '150+ staff',
    about:
      'Industrial electrical and instrumentation on turnaround rotations. Camp and flights provided from Calgary or Edmonton.',
    logoUrl: mark('cascade-industrial-services'),
  },
  {
    slug: 'job-bank-seed-jb-carpenter-vancouver',
    name: 'Employer (via Job Bank)',
    verified: false,
    city: 'Vancouver',
    province: 'BC',
    country: 'CA',
    about:
      'Listings aggregated from Job Bank open data (Employment and Social Development Canada), licensed under the Open Government Licence – Canada.',
  },
  {
    slug: 'job-bank-seed-jb-millwright-hamilton',
    name: 'Employer (via Job Bank)',
    verified: false,
    city: 'Hamilton',
    province: 'ON',
    country: 'CA',
    about:
      'Listings aggregated from Job Bank open data (Employment and Social Development Canada), licensed under the Open Government Licence – Canada.',
  },
  {
    slug: 'northline-mechanical',
    name: 'Northline Mechanical',
    verified: true,
    city: 'Toronto',
    province: 'ON',
    country: 'CA',
    founded: 1996,
    size: '80–120 staff',
    about:
      'Commercial mechanical and electrical contractor across the GTA and Ottawa. Direct employer postings on Tradesboard.',
    logoUrl: mark('northline-mechanical'),
  },
];

const JOBS: SeedJob[] = [
  {
    id: 'je-4401',
    source: 'employer',
    sourceId: 'je-4401',
    title: 'Journeyman Electrician',
    company: 'Northline Electric',
    employerSlug: 'northline-electric',
    description:
      'Commercial and light industrial service work across the Calgary region. Company truck, tools allowance, and a four-day rotation.',
    trade: 'electrician',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    employmentType: 'full-time',
    salaryMin: 38,
    salaryMax: 46,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-05',
    expiresAt: '2026-09-12',
    union: true,
    experience: '4+ years post-ticket',
    responsibilities: [
      'Install, troubleshoot and repair commercial distribution systems',
      'Read and interpret drawings, schematics and CEC requirements',
      'Mentor apprentices on site and sign off on logged hours',
      'Complete service documentation before end of shift',
    ],
    applyEmail: 'jobs@northline-electric.example',
  },
  {
    id: 'pl-2210',
    source: 'employer',
    sourceId: 'pl-2210',
    title: 'Plumber — Service & Repair',
    company: 'Bow Valley Mechanical',
    employerSlug: 'bow-valley-mechanical',
    description:
      'Residential and small commercial service calls. Dispatch is routed from a central office; most days run five to seven calls.',
    trade: 'plumber',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    employmentType: 'full-time',
    salaryMin: 34,
    salaryMax: 42,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-06',
    experience: 'Red Seal required',
    responsibilities: [
      'Diagnose and repair supply, drainage and venting systems',
      'Quote work on site and process payment through the field app',
      'Maintain truck stock and flag reorders weekly',
    ],
    applyEmail: 'jobs@bow-valley.example',
  },
  {
    id: 'hv-1180',
    source: 'employer',
    sourceId: 'hv-1180',
    title: 'HVAC Technician',
    company: 'Chinook Climate',
    employerSlug: 'chinook-climate',
    description:
      'Rooftop unit maintenance and replacement for a portfolio of retail sites. Winter on-call rotation is shared across six techs.',
    trade: 'hvac',
    country: 'CA',
    region: 'AB',
    city: 'Edmonton',
    employmentType: 'full-time',
    salaryMin: 36,
    salaryMax: 44,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-03',
    experience: '3+ years',
    responsibilities: [
      'Service RTUs, split systems and make-up air units',
      'Perform seasonal preventative maintenance to a checklist',
      'Carry gas ticket and maintain refrigerant handling records',
    ],
    applyEmail: 'shop@chinook-climate.example',
  },
  {
    id: 'ap-9902',
    source: 'employer',
    sourceId: 'ap-9902',
    title: 'Electrical Apprentice — 2nd Year',
    company: 'Northline Electric',
    employerSlug: 'northline-electric',
    description:
      'Indentured position with scheduled technical training and paid book time. Hours are logged and signed weekly.',
    trade: 'electrician',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    isApprenticeship: true,
    employmentType: 'apprenticeship',
    salaryMin: 24,
    salaryMax: 28,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-05',
    union: true,
    experience: '1st year complete',
    responsibilities: [
      'Support journeymen on commercial installations',
      'Prepare and maintain material and tools on site',
      'Attend scheduled technical training blocks',
    ],
    applyEmail: 'jobs@northline-electric.example',
  },
  {
    id: 'we-7714',
    source: 'employer',
    sourceId: 'we-7714',
    title: 'CWB Welder — Structural',
    company: 'Prairie Steel Fabrication',
    employerSlug: 'prairie-steel-fabrication',
    description:
      'Shop-based structural fabrication. Straight days, no camp work, climate-controlled bays.',
    trade: 'welder',
    country: 'CA',
    region: 'AB',
    city: 'Red Deer',
    employmentType: 'full-time',
    salaryMin: 35,
    salaryMax: 45,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-01',
    expiresAt: '2026-09-09',
    experience: 'CWB All-Position',
    responsibilities: [
      'FCAW and SMAW on structural assemblies to CSA W59',
      'Interpret fabrication drawings and weld symbols',
      'Perform visual inspection and correct defects before QC',
    ],
    applyEmail: 'shop@prairie-steel.example',
  },
  {
    id: 'he-3350',
    source: 'employer',
    sourceId: 'he-3350',
    title: 'Heavy Equipment Operator',
    company: 'Foothills Earthworks',
    employerSlug: 'foothills-earthworks',
    description:
      'Seasonal site prep and utility trenching. Eight-month contract with likely renewal into next season.',
    trade: 'heavy_equipment',
    country: 'CA',
    region: 'AB',
    city: 'Lethbridge',
    employmentType: 'contract',
    salaryCurrency: 'CAD',
    postedAt: '2026-09-04',
    experience: '5+ years excavator',
    responsibilities: [
      'Operate excavator and dozer for grading and trenching',
      'Complete daily pre-trip inspections and log defects',
      'Work to grade stakes and GPS control',
    ],
    applyEmail: 'dispatch@foothills.example',
  },
  {
    id: 'ca-5521',
    source: 'employer',
    sourceId: 'ca-5521',
    title: 'Finish Carpenter',
    company: 'Ridgeline Interiors',
    employerSlug: 'ridgeline-interiors',
    description:
      'High-end residential millwork and trim. Small crew, long-tenure shop, most projects run six to twelve weeks.',
    trade: 'carpenter',
    country: 'CA',
    region: 'AB',
    city: 'Canmore',
    employmentType: 'full-time',
    salaryMin: 32,
    salaryMax: 40,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-30',
    experience: '3+ years finishing',
    responsibilities: [
      'Install custom millwork, stair parts and trim packages',
      'Scribe and fit to out-of-square existing conditions',
      'Coordinate with cabinet shop on shop drawings',
    ],
    applyEmail: 'shop@ridgeline.example',
  },
  {
    id: 'pl-6612',
    source: 'employer',
    sourceId: 'pl-6612',
    title: 'Plumbing Apprentice — 3rd Year',
    company: 'Bow Valley Mechanical',
    employerSlug: 'bow-valley-mechanical',
    description:
      'Rough-in and finish on multi-family residential. Consistent local work, home every night.',
    trade: 'plumber',
    country: 'CA',
    region: 'AB',
    city: 'Airdrie',
    isApprenticeship: true,
    employmentType: 'apprenticeship',
    salaryMin: 26,
    salaryMax: 30,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-09-02',
    experience: '2nd year complete',
    responsibilities: [
      'Assist with rough-in of supply and DWV systems',
      'Pressure test and document results',
      'Keep site organized and material staged',
    ],
    applyEmail: 'jobs@bow-valley.example',
  },
  {
    id: 'hv-8830',
    source: 'employer',
    sourceId: 'hv-8830',
    title: 'Refrigeration Mechanic',
    company: 'Chinook Climate',
    employerSlug: 'chinook-climate',
    description:
      'Supermarket and cold storage refrigeration. Rack systems, CO2 transcritical experience an asset.',
    trade: 'hvac',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    employmentType: 'full-time',
    salaryMin: 42,
    salaryMax: 52,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-27',
    experience: 'Red Seal RSE',
    responsibilities: [
      'Service parallel rack systems and walk-in units',
      'Diagnose controls and superheat/subcool faults',
      'Maintain refrigerant logs to federal requirements',
    ],
    applyEmail: 'shop@chinook-climate.example',
  },
  {
    id: 'el-1204',
    source: 'employer',
    sourceId: 'el-1204',
    title: 'Industrial Electrician',
    company: 'Cascade Industrial Services',
    employerSlug: 'cascade-industrial-services',
    description:
      'Site-based turnaround work on a 14/7 rotation. Camp and flights provided from Calgary or Edmonton.',
    trade: 'electrician',
    country: 'CA',
    region: 'AB',
    city: 'Fort McMurray',
    employmentType: 'contract',
    salaryMin: 52,
    salaryMax: 58,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-31',
    union: true,
    experience: 'Red Seal + 5 years industrial',
    responsibilities: [
      'Terminate and test motor control and instrumentation circuits',
      'Work to lockout and permit requirements without exception',
      'Support commissioning and loop checks',
    ],
    applyEmail: 'hire@cascade-industrial.example',
  },
  {
    id: 'ca-4478',
    source: 'employer',
    sourceId: 'ca-4478',
    title: 'Framing Carpenter',
    company: 'Ridgeline Interiors',
    employerSlug: 'ridgeline-interiors',
    description:
      'Three to four days a week on residential infill. Suits someone winding down from full-time or running their own side work.',
    trade: 'carpenter',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    employmentType: 'part-time',
    salaryMin: 28,
    salaryMax: 34,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-24',
    experience: '2+ years',
    responsibilities: [
      'Frame walls, floors and roof systems to drawings',
      'Set and brace engineered components',
      'Maintain a clean and safe work area',
    ],
    applyEmail: 'shop@ridgeline.example',
  },
  {
    id: 'we-2295',
    source: 'employer',
    sourceId: 'we-2295',
    title: 'Pipe Welder — B-Pressure',
    company: 'Prairie Steel Fabrication',
    employerSlug: 'prairie-steel-fabrication',
    description:
      'Field pipe work on gathering systems. Rig welders welcome; truck rate negotiated separately.',
    trade: 'welder',
    country: 'CA',
    region: 'AB',
    city: 'Grande Prairie',
    employmentType: 'contract',
    salaryMin: 48,
    salaryMax: 62,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-29',
    experience: 'B-Pressure ticket required',
    responsibilities: [
      'Weld carbon steel pipe to B-Pressure standards',
      'Pass third-party X-ray inspection',
      'Maintain own rig and consumables where applicable',
    ],
    applyEmail: 'shop@prairie-steel.example',
  },
  {
    id: 'seed-emp-electrician-toronto',
    source: 'employer',
    sourceId: 'seed-emp-electrician-toronto',
    title: 'Journeyperson electrician — commercial fit-up',
    company: 'Northline Mechanical',
    employerSlug: 'northline-mechanical',
    description:
      'Northline Mechanical is hiring a licensed construction electrician for commercial tenant fit-ups across the GTA. Pull pipe, terminate panels, and work from issued-for-construction drawings. Red Seal preferred.',
    trade: 'electrician',
    nocOrSoc: '72200',
    country: 'CA',
    region: 'ON',
    city: 'Toronto',
    employmentType: 'full-time',
    salaryMin: 42,
    salaryMax: 48,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-12',
    applyEmail: 'jobs@northline.example',
  },
  {
    id: 'seed-emp-hvac-ottawa',
    source: 'employer',
    sourceId: 'seed-emp-hvac-ottawa',
    title: 'HVAC service technician',
    company: 'Northline Mechanical',
    employerSlug: 'northline-mechanical',
    description:
      'Service and start-up of rooftop units, split systems, and building automation on federal and commercial sites in Ottawa. G2/G3 and ozone-depletion prevention tickets required.',
    trade: 'hvac',
    nocOrSoc: '72402',
    country: 'CA',
    region: 'ON',
    city: 'Ottawa',
    employmentType: 'full-time',
    salaryMin: 36,
    salaryMax: 44,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-18',
    applyEmail: 'jobs@northline.example',
  },
  {
    id: 'seed-jb-carpenter-vancouver',
    source: 'job_bank',
    sourceId: 'seed-jb-carpenter-vancouver',
    title: 'Formwork carpenter',
    company: 'Employer (via Job Bank)',
    employerSlug: 'job-bank-seed-jb-carpenter-vancouver',
    description:
      'High-rise formwork carpenter for pours in Metro Vancouver. Experience with gang forms and fly tables is an asset. NOC 72310. Open Government Licence – Canada.',
    trade: 'carpenter',
    nocOrSoc: '72310',
    country: 'CA',
    region: 'BC',
    city: 'Vancouver',
    employmentType: 'full-time',
    salaryMin: 38,
    salaryMax: 44,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-01',
    applyUrl:
      'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=carpenter&locationstring=Vancouver',
  },
  {
    id: 'seed-jb-millwright-hamilton',
    source: 'job_bank',
    sourceId: 'seed-jb-millwright-hamilton',
    title: 'Industrial millwright',
    company: 'Employer (via Job Bank)',
    employerSlug: 'job-bank-seed-jb-millwright-hamilton',
    description:
      'Maintenance millwright for a steel-adjacent plant in Hamilton. Alignments, conveyors, and shutdown work. NOC 72400.',
    trade: 'millwright',
    nocOrSoc: '72400',
    country: 'CA',
    region: 'ON',
    city: 'Hamilton',
    employmentType: 'full-time',
    salaryMin: 41,
    salaryMax: 47,
    salaryCurrency: 'CAD',
    payUnit: 'hr',
    postedAt: '2026-08-05',
    applyUrl:
      'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=millwright&locationstring=Hamilton',
  },
];

async function main() {
  await prisma.job.deleteMany({ where: { country: { not: 'CA' } } });
  await prisma.employer.deleteMany({ where: { country: { not: 'CA' } } });
  await prisma.ingestRun.deleteMany({
    where: { NOT: { source: { in: ['job_bank', 'adzuna'] } } },
  });

  for (const employer of EMPLOYERS) {
    await prisma.employer.upsert({
      where: { slug: employer.slug },
      update: {
        name: employer.name,
        verified: employer.verified,
        city: employer.city,
        province: employer.province,
        country: employer.country,
        founded: employer.founded ?? null,
        size: employer.size ?? null,
        about: employer.about,
        website: employer.website ?? null,
        logoUrl: employer.logoUrl ?? null,
      },
      create: {
        slug: employer.slug,
        name: employer.name,
        verified: employer.verified,
        city: employer.city,
        province: employer.province,
        country: employer.country,
        founded: employer.founded ?? null,
        size: employer.size ?? null,
        about: employer.about,
        website: employer.website ?? null,
        logoUrl: employer.logoUrl ?? null,
      },
    });
  }

  for (const job of JOBS) {
    const data = {
      id: job.id,
      source: job.source,
      sourceId: job.sourceId,
      title: job.title,
      company: job.company,
      description: job.description,
      trade: job.trade,
      nocOrSoc: job.nocOrSoc ?? null,
      country: job.country,
      region: job.region,
      city: job.city,
      isApprenticeship: job.isApprenticeship ?? job.employmentType === 'apprenticeship',
      employmentType: job.employmentType ?? null,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryCurrency: job.salaryCurrency,
      payUnit: job.payUnit ?? null,
      applyUrl: job.applyUrl ?? null,
      applyEmail: job.applyEmail ?? null,
      postedAt: new Date(job.postedAt),
      expiresAt: job.expiresAt ? new Date(job.expiresAt) : null,
      union: job.union ?? false,
      experience: job.experience ?? '',
      responsibilities: (job.responsibilities ?? []) satisfies Prisma.InputJsonValue,
      employerSlug: job.employerSlug,
      raw: { seed: true } satisfies Prisma.InputJsonValue,
    };

    await prisma.job.upsert({
      where: {
        source_sourceId: { source: job.source, sourceId: job.sourceId },
      },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${EMPLOYERS.length} employers and ${JOBS.length} jobs`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
