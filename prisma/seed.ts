import { PrismaClient, type JobSource, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedJob = {
  source: JobSource;
  sourceId: string;
  title: string;
  company: string;
  description: string;
  trade: string;
  nocOrSoc?: string;
  country: "CA" | "US";
  region: string;
  city: string;
  isApprenticeship?: boolean;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: "CAD" | "USD";
  applyUrl?: string;
  applyEmail?: string;
  postedAt: string;
  employerId?: string;
};

const JOBS: SeedJob[] = [
  {
    source: "employer",
    sourceId: "seed-emp-electrician-toronto",
    title: "Journeyperson electrician — commercial fit-up",
    company: "Northline Mechanical",
    description:
      "Northline Mechanical is hiring a licensed construction electrician for commercial tenant fit-ups across the GTA. Pull pipe, terminate panels, and work from issued-for-construction drawings. Red Seal preferred. Tools provided on site; CSA boots required.",
    trade: "electrician",
    nocOrSoc: "72200",
    country: "CA",
    region: "Ontario",
    city: "Toronto",
    employmentType: "full-time",
    salaryMin: 42,
    salaryMax: 48,
    salaryCurrency: "CAD",
    applyEmail: "jobs@northline.example",
    postedAt: "2026-08-12",
  },
  {
    source: "employer",
    sourceId: "seed-emp-hvac-ottawa",
    title: "HVAC service technician",
    company: "Northline Mechanical",
    description:
      "Service and start-up of rooftop units, split systems, and building automation on federal and commercial sites in Ottawa. G2/G3 and ozone-depletion prevention tickets required. Van and phone supplied.",
    trade: "hvac",
    nocOrSoc: "72402",
    country: "CA",
    region: "Ontario",
    city: "Ottawa",
    employmentType: "full-time",
    salaryMin: 36,
    salaryMax: 44,
    salaryCurrency: "CAD",
    applyEmail: "jobs@northline.example",
    postedAt: "2026-08-18",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-plumber-calgary",
    title: "Plumber apprentice (2nd year)",
    company: "Employer (via Job Bank)",
    description:
      "Residential and light commercial plumbing shop looking for a registered 2nd-year apprentice. Rough-in, finish, and service calls with a licensed journeyperson. NOC 72300.",
    trade: "plumber",
    nocOrSoc: "72300",
    country: "CA",
    region: "Alberta",
    city: "Calgary",
    isApprenticeship: true,
    employmentType: "full-time",
    salaryMin: 24,
    salaryMax: 30,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=plumber%20apprentice&locationstring=Calgary",
    postedAt: "2026-07-22",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-carpenter-vancouver",
    title: "Formwork carpenter",
    company: "Employer (via Job Bank)",
    description:
      "High-rise formwork carpenter for pours in Metro Vancouver. Experience with gang forms and fly tables is an asset. NOC 72310. Open Government Licence – Canada.",
    trade: "carpenter",
    nocOrSoc: "72310",
    country: "CA",
    region: "British Columbia",
    city: "Vancouver",
    employmentType: "full-time",
    salaryMin: 38,
    salaryMax: 44,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=carpenter&locationstring=Vancouver",
    postedAt: "2026-08-01",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-welder-edmonton",
    title: "Pressure welder — B-pressure",
    company: "Employer (via Job Bank)",
    description:
      "Shop and field welding on process piping. CWB and B-pressure tickets required. NOC 72106.",
    trade: "welder",
    nocOrSoc: "72106",
    country: "CA",
    region: "Alberta",
    city: "Edmonton",
    employmentType: "full-time",
    salaryMin: 40,
    salaryMax: 52,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=welder&locationstring=Edmonton",
    postedAt: "2026-07-29",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-millwright-hamilton",
    title: "Industrial millwright",
    company: "Employer (via Job Bank)",
    description:
      "Maintenance millwright for a steel-adjacent plant in Hamilton. Alignments, conveyors, and shutdown work. NOC 72400.",
    trade: "millwright",
    nocOrSoc: "72400",
    country: "CA",
    region: "Ontario",
    city: "Hamilton",
    employmentType: "full-time",
    salaryMin: 41,
    salaryMax: 47,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=millwright&locationstring=Hamilton",
    postedAt: "2026-08-05",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-heavy-saskatoon",
    title: "Heavy equipment operator — civil",
    company: "Employer (via Job Bank)",
    description:
      "Excavator and dozer operator for municipal utilities. Seasonal civil package. NOC 73400.",
    trade: "heavy_equipment",
    nocOrSoc: "73400",
    country: "CA",
    region: "Saskatchewan",
    city: "Saskatoon",
    employmentType: "seasonal",
    salaryMin: 32,
    salaryMax: 38,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=heavy%20equipment%20operator&locationstring=Saskatoon",
    postedAt: "2026-08-09",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-electrician-sudbury",
    title: "Industrial electrician — underground support",
    company: "Employer (via Job Bank)",
    description:
      "Industrial electrician supporting surface plants that feed underground operations. 309A or Red Seal. NOC 72201.",
    trade: "electrician",
    nocOrSoc: "72201",
    country: "CA",
    region: "Ontario",
    city: "Greater Sudbury",
    employmentType: "full-time",
    salaryMin: 45,
    salaryMax: 52,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=industrial%20electrician&locationstring=Sudbury",
    postedAt: "2026-07-15",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-pipefitter-halifax",
    title: "Steamfitter / pipefitter apprentice",
    company: "Employer (via Job Bank)",
    description:
      "Shipyard pipefitter apprentice. School blocks respected. NOC 72301.",
    trade: "plumber",
    nocOrSoc: "72301",
    country: "CA",
    region: "Nova Scotia",
    city: "Halifax",
    isApprenticeship: true,
    employmentType: "full-time",
    salaryMin: 21,
    salaryMax: 27,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=pipefitter%20apprentice&locationstring=Halifax",
    postedAt: "2026-08-03",
  },
  {
    source: "job_bank",
    sourceId: "seed-jb-roofer-winnipeg",
    title: "Commercial roofer",
    company: "Employer (via Job Bank)",
    description:
      "Built-up and single-ply roofing on low-slope commercial buildings. NOC 73110.",
    trade: "other",
    nocOrSoc: "73110",
    country: "CA",
    region: "Manitoba",
    city: "Winnipeg",
    employmentType: "full-time",
    salaryMin: 28,
    salaryMax: 34,
    salaryCurrency: "CAD",
    applyUrl:
      "https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=roofer&locationstring=Winnipeg",
    postedAt: "2026-07-27",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-electrician-chicago",
    title: "Inside wireman — commercial",
    company: "Lakeshore Electric",
    description:
      "Journeyman electrician for hospital and lab work in Chicago. Local 134 scale. Jobs by Adzuna.",
    trade: "electrician",
    nocOrSoc: "47-2111",
    country: "US",
    region: "Illinois",
    city: "Chicago",
    employmentType: "full-time",
    salaryMin: 42,
    salaryMax: 55,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-14",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-plumber-austin",
    title: "Plumbing apprentice — new residential",
    company: "Hill Country Plumbing",
    description:
      "Registered apprentice for production homes north of Austin. Jobs by Adzuna.",
    trade: "plumber",
    nocOrSoc: "47-2152",
    country: "US",
    region: "Texas",
    city: "Austin",
    isApprenticeship: true,
    employmentType: "full-time",
    salaryMin: 18,
    salaryMax: 24,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-11",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-carpenter-seattle",
    title: "Finish carpenter — multifamily",
    company: "Cascade Interiors",
    description:
      "Interior trim, doors, and hardware on mid-rise apartments. Jobs by Adzuna.",
    trade: "carpenter",
    nocOrSoc: "47-2031",
    country: "US",
    region: "Washington",
    city: "Seattle",
    employmentType: "full-time",
    salaryMin: 34,
    salaryMax: 42,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-08",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-welder-houston",
    title: "Pipe welder — 6G",
    company: "Gulf Coast Fabrication",
    description:
      "Shop pipe welding, 6G test on hire. Jobs by Adzuna.",
    trade: "welder",
    nocOrSoc: "51-4121",
    country: "US",
    region: "Texas",
    city: "Houston",
    employmentType: "full-time",
    salaryMin: 32,
    salaryMax: 45,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-16",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-hvac-phoenix",
    title: "HVAC installer — light commercial",
    company: "Sonoran Climate",
    description:
      "RTU changeouts and ductwork in the Phoenix metro. EPA 608 required. Jobs by Adzuna.",
    trade: "hvac",
    nocOrSoc: "49-9021",
    country: "US",
    region: "Arizona",
    city: "Phoenix",
    employmentType: "full-time",
    salaryMin: 26,
    salaryMax: 36,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-06",
  },
  {
    source: "adzuna",
    sourceId: "seed-adz-heavy-denver",
    title: "Excavator operator — utilities",
    company: "Front Range Civil",
    description:
      "Grade and trench for water/sewer crews along the Front Range. Jobs by Adzuna.",
    trade: "heavy_equipment",
    nocOrSoc: "47-2073",
    country: "US",
    region: "Colorado",
    city: "Denver",
    employmentType: "full-time",
    salaryMin: 30,
    salaryMax: 40,
    salaryCurrency: "USD",
    applyUrl: "https://www.adzuna.com",
    postedAt: "2026-08-02",
  },
  {
    source: "usajobs",
    sourceId: "seed-usa-electrician-norfolk",
    title: "Electrician, WG-2805-10",
    company: "Department of the Navy",
    description:
      "Install and maintain electrical systems on a naval shore facility. FWS 2805. Apply on USAJOBS.",
    trade: "electrician",
    nocOrSoc: "2805",
    country: "US",
    region: "Virginia",
    city: "Norfolk",
    employmentType: "full-time",
    salaryMin: 28,
    salaryMax: 33,
    salaryCurrency: "USD",
    applyUrl: "https://www.usajobs.gov/Search/Results?j=2805",
    postedAt: "2026-08-04",
  },
  {
    source: "usajobs",
    sourceId: "seed-usa-plumber-san-diego",
    title: "Plumber, WG-4206-09",
    company: "Department of Defense",
    description:
      "Plumbing maintenance on federal buildings. FWS 4206. Apply on USAJOBS.",
    trade: "plumber",
    nocOrSoc: "4206",
    country: "US",
    region: "California",
    city: "San Diego",
    employmentType: "full-time",
    salaryMin: 27,
    salaryMax: 32,
    salaryCurrency: "USD",
    applyUrl: "https://www.usajobs.gov/Search/Results?j=4206",
    postedAt: "2026-07-30",
  },
  {
    source: "usajobs",
    sourceId: "seed-usa-welder-puget",
    title: "Welder, WG-3703-10",
    company: "Department of the Navy",
    description:
      "Structural and pipe welding in a public shipyard. FWS 3703.",
    trade: "welder",
    nocOrSoc: "3703",
    country: "US",
    region: "Washington",
    city: "Bremerton",
    employmentType: "full-time",
    salaryMin: 31,
    salaryMax: 36,
    salaryCurrency: "USD",
    applyUrl: "https://www.usajobs.gov/Search/Results?j=3703",
    postedAt: "2026-08-10",
  },
  {
    source: "usajobs",
    sourceId: "seed-usa-carpenter-portland",
    title: "Carpenter apprentice, WG-4607-05",
    company: "U.S. Army Corps of Engineers",
    description:
      "Apprentice carpenter supporting civil works facilities. FWS 4607.",
    trade: "carpenter",
    nocOrSoc: "4607",
    country: "US",
    region: "Oregon",
    city: "Portland",
    isApprenticeship: true,
    employmentType: "full-time",
    salaryMin: 20,
    salaryMax: 24,
    salaryCurrency: "USD",
    applyUrl: "https://www.usajobs.gov/Search/Results?j=4607",
    postedAt: "2026-08-07",
  },
  {
    source: "employer",
    sourceId: "seed-emp-millwright-detroit",
    title: "Millwright — plant shutdowns",
    company: "Great Lakes Rigging",
    description:
      "Travel millwright for automotive and food plants. Precision alignment, conveyors, and weekend outages. CDL an asset.",
    trade: "millwright",
    nocOrSoc: "49-9041",
    country: "US",
    region: "Michigan",
    city: "Detroit",
    employmentType: "contract",
    salaryMin: 38,
    salaryMax: 48,
    salaryCurrency: "USD",
    applyEmail: "hire@glrigging.example",
    applyUrl: "https://example.com/apply/millwright",
    postedAt: "2026-08-15",
  },
  {
    source: "employer",
    sourceId: "seed-emp-sheet-boston",
    title: "Sheet metal worker — architectural",
    company: "Harbor Metal",
    description:
      "Shop and field architectural sheet metal. Coping, flashing, and custom pan work. Union scale.",
    trade: "other",
    nocOrSoc: "47-2211",
    country: "US",
    region: "Massachusetts",
    city: "Boston",
    employmentType: "full-time",
    salaryMin: 36,
    salaryMax: 46,
    salaryCurrency: "USD",
    applyEmail: "shop@harbormetal.example",
    postedAt: "2026-08-13",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("tradesboard", 12);

  const employer = await prisma.profile.upsert({
    where: { email: "employer@tradesboard.dev" },
    update: { companyName: "Northline Mechanical", passwordHash },
    create: {
      email: "employer@tradesboard.dev",
      passwordHash,
      role: "employer",
      companyName: "Northline Mechanical",
    },
  });

  for (const job of JOBS) {
    const employerId =
      job.source === "employer" && job.company === "Northline Mechanical"
        ? employer.id
        : undefined;
    const data = {
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
      isApprenticeship: job.isApprenticeship ?? false,
      employmentType: job.employmentType ?? null,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryCurrency: job.salaryCurrency,
      applyUrl: job.applyUrl ?? null,
      applyEmail: job.applyEmail ?? null,
      postedAt: new Date(job.postedAt),
      employerId: employerId ?? null,
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

  console.log(
    `Seeded ${JOBS.length} jobs and employer@tradesboard.dev / tradesboard`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
