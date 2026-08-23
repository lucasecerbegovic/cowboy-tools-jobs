import type { Job, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isCountryCode, isTradeSlug } from "@/lib/trades";

export type JobFilters = {
  q?: string;
  trade?: string;
  country?: string;
  location?: string;
  apprenticeship?: boolean;
  page?: number;
  pageSize?: number;
};

export type JobListResult = {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function filtersFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): JobFilters {
  const apprenticeshipRaw = firstString(params.apprenticeship);
  return {
    q: firstString(params.q)?.trim() || undefined,
    trade: firstString(params.trade)?.trim() || undefined,
    country: firstString(params.country)?.trim() || undefined,
    location: firstString(params.location)?.trim() || undefined,
    apprenticeship:
      apprenticeshipRaw === "1" || apprenticeshipRaw === "true"
        ? true
        : undefined,
    page: Number(firstString(params.page) ?? "1") || 1,
  };
}

export async function searchJobs(filters: JobFilters): Promise<JobListResult> {
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 50);
  const page = Math.max(filters.page ?? 1, 1);
  const now = new Date();

  const where: Prisma.JobWhereInput = {
    AND: [
      {
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    ],
  };

  if (filters.q) {
    (where.AND as Prisma.JobWhereInput[]).push({
      OR: [
        { title: { contains: filters.q } },
        { company: { contains: filters.q } },
        { city: { contains: filters.q } },
        { region: { contains: filters.q } },
        { description: { contains: filters.q } },
      ],
    });
  }

  if (filters.trade && isTradeSlug(filters.trade)) {
    (where.AND as Prisma.JobWhereInput[]).push({ trade: filters.trade });
  }

  if (filters.country && isCountryCode(filters.country)) {
    (where.AND as Prisma.JobWhereInput[]).push({ country: filters.country });
  }

  if (filters.location) {
    (where.AND as Prisma.JobWhereInput[]).push({
      OR: [
        { city: { contains: filters.location } },
        { region: { contains: filters.location } },
      ],
    });
  }

  if (filters.apprenticeship) {
    (where.AND as Prisma.JobWhereInput[]).push({ isApprenticeship: true });
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    jobs,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getLatestJobs(limit = 8): Promise<Job[]> {
  const now = new Date();
  return prisma.job.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { postedAt: "desc" },
    take: limit,
  });
}

export async function getJobById(id: string): Promise<Job | null> {
  return prisma.job.findUnique({ where: { id } });
}

export async function getEmployerJobs(employerId: string): Promise<Job[]> {
  return prisma.job.findMany({
    where: { employerId },
    orderBy: { postedAt: "desc" },
  });
}
