import { tradeLabel } from "@/lib/trades";
import type { JobSource } from "@prisma/client";

export function formatLocation(parts: {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}): string {
  const bits = [parts.city, parts.region, parts.country].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  return bits.join(", ") || "Location not listed";
}

export function formatWage(job: {
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
}): string | null {
  const currency = job.salaryCurrency ?? "CAD";
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (job.salaryMin != null && job.salaryMax != null) {
    if (job.salaryMin === job.salaryMax) {
      return `${formatter.format(job.salaryMin)}${hourlySuffix(job.salaryMin)}`;
    }
    return `${formatter.format(job.salaryMin)}–${formatter.format(job.salaryMax)}${hourlySuffix(job.salaryMax)}`;
  }
  if (job.salaryMin != null) {
    return `From ${formatter.format(job.salaryMin)}${hourlySuffix(job.salaryMin)}`;
  }
  if (job.salaryMax != null) {
    return `Up to ${formatter.format(job.salaryMax)}${hourlySuffix(job.salaryMax)}`;
  }
  return null;
}

function hourlySuffix(amount: number): string {
  return amount > 0 && amount < 250 ? "/hr" : "";
}

export function formatPostedAt(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(value);
}

export function sourceLabel(source: JobSource): string {
  switch (source) {
    case "employer":
      return "Employer";
    case "job_bank":
      return "Job Bank";
    case "adzuna":
      return "Adzuna";
    case "usajobs":
      return "USAJOBS";
    default: {
      const exhaustive: never = source;
      return exhaustive;
    }
  }
}

export function adzunaHome(country: string): string {
  return country === "CA" ? "https://www.adzuna.ca" : "https://www.adzuna.com";
}

export { tradeLabel };
