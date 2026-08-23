import Link from "next/link";
import type { JobFilters } from "@/lib/jobs";

export function JobFiltersBar({
  filters,
  total,
}: {
  filters: JobFilters;
  total: number;
}) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.trade) params.set("trade", filters.trade);
  if (filters.country) params.set("country", filters.country);
  if (filters.location) params.set("location", filters.location);
  const apprenticeOn = Boolean(filters.apprenticeship);
  const apprenticeParams = new URLSearchParams(params);
  if (!apprenticeOn) apprenticeParams.set("apprenticeship", "1");
  const gigParams = new URLSearchParams(params);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        {total} listing{total === 1 ? "" : "s"}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/jobs?${gigParams.toString()}`}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !apprenticeOn
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          }`}
        >
          All / gigs
        </Link>
        <Link
          href={`/jobs?${apprenticeParams.toString()}`}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            apprenticeOn
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          }`}
        >
          Apprenticeships only
        </Link>
      </div>
    </div>
  );
}
