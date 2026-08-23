import Link from "next/link";
import { JobCard } from "@/components/jobs/job-card";
import { SearchForm } from "@/components/jobs/search-form";
import { Button } from "@/components/ui/button";
import { getLatestJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const jobs = await getLatestJobs(8);

  return (
    <div>
      <section className="border-b border-border/80 bg-[linear-gradient(180deg,oklch(0.94_0.02_80)_0%,oklch(0.965_0.012_85)_100%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-copper uppercase">
              Canada & United States
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Work for people who actually build things.
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Tradesboard lists gigs and apprenticeships for electricians,
              plumbers, carpenters, welders, millwrights, HVAC techs, and heavy
              equipment operators — from Job Bank open data, Adzuna, USAJOBS, and
              employers who post here.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Latest jobs</h2>
            <p className="text-sm text-muted-foreground">
              Seeded sample data ships with local setup so this page is never empty.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/jobs" />}>
            View all
          </Button>
        </div>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
