import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Invented demo shops from earlier seeds. Real listings come from ingest. */
const SEED_EMPLOYER_SLUGS = [
  'northline-electric',
  'bow-valley-mechanical',
  'chinook-climate',
  'prairie-steel-fabrication',
  'foothills-earthworks',
  'ridgeline-interiors',
  'cascade-industrial-services',
  'northline-mechanical',
  'job-bank-seed-jb-carpenter-vancouver',
  'job-bank-seed-jb-millwright-hamilton',
] as const;

/** Short ids used before sourceIds were prefixed with `seed-`. */
const SEED_JOB_IDS = [
  'je-4401',
  'pl-2210',
  'hv-1180',
  'ap-9902',
  'we-7714',
  'he-3350',
  'ca-5521',
  'pl-6612',
  'hv-8830',
  'el-1204',
  'ca-4478',
  'we-2295',
  'seed-emp-electrician-toronto',
  'seed-emp-hvac-ottawa',
  'seed-jb-carpenter-vancouver',
  'seed-jb-millwright-hamilton',
] as const;

async function main() {
  await prisma.job.deleteMany({ where: { country: { not: 'CA' } } });
  await prisma.employer.deleteMany({ where: { country: { not: 'CA' } } });
  await prisma.ingestRun.deleteMany({
    where: { NOT: { source: { in: ['job_bank', 'adzuna'] } } },
  });

  const seededJobs = await prisma.job.deleteMany({
    where: {
      OR: [
        { id: { in: [...SEED_JOB_IDS] } },
        { sourceId: { startsWith: 'seed-' } },
        { employerSlug: { in: [...SEED_EMPLOYER_SLUGS] } },
      ],
    },
  });

  const seededEmployers = await prisma.employer.deleteMany({
    where: { slug: { in: [...SEED_EMPLOYER_SLUGS] } },
  });

  console.log(
    `Removed ${seededJobs.count} seeded jobs and ${seededEmployers.count} demo employers. Load listings with ingest.`,
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
