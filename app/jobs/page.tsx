import type { Metadata } from "next";
import Link from "next/link";
import { JobCard } from "@/components/jobs/job-card";
import { JobFiltersBar } from "@/components/jobs/job-filters";
import { SearchForm } from "@/components/jobs/search-form";
import { filtersFromSearchParams, searchJobs } from "@/lib/jobs";

export const metadata: Metadata = { title: "Jobs" };
export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = filtersFromSearchParams(params);
  const result = await searchJobs(filters);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Filter by trade, country, city or region, and apprenticeship.
        </p>
      </div>
      <SearchForm filters={filters} />
      <JobFiltersBar filters={filters} total={result.total} />
      {result.jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No jobs match those filters. Try another trade or city.
        </p>
      ) : (
        <div className="grid gap-4">
          {result.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
      {result.pageCount > 1 ? (
        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          params={params}
        />
      ) : null}
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page") continue;
    const text = Array.isArray(value) ? value[0] : value;
    if (text) query.set(key, text);
  }
  const hrefFor = (target: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(target));
    return `/jobs?${next.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      {page > 1 ? <Link href={hrefFor(page - 1)}>Previous</Link> : null}
      <span>
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? <Link href={hrefFor(page + 1)}>Next</Link> : null}
    </div>
  );
}
