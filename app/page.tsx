import { ListingRow } from '@/components/listing-row';
import { SearchField } from '@/components/search-field';
import { ButtonLink } from '@/components/button';
import { monoUi, muted } from '@/lib/brand-type';
import { JOBS } from '@/lib/jobs';

export default function Home() {
  const recent = [...JOBS].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4);

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 md:px-8">
      {/* Search is the hero — capped so listings clear the fold on a 667px phone. */}
      <section className="max-h-[320px] py-10 md:py-12">
        <p className={`${monoUi} ${muted}`}>Alberta · {JOBS.length} open roles</p>
        <h1 className="mt-3 text-display uppercase">Work in the trades</h1>
        <div className="mt-7">
          <SearchField />
        </div>
      </section>

      <section className="pb-16">
        <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
          <h2 className={monoUi}>Recently posted</h2>
          <ButtonLink href="/jobs" variant="bare" size="sm">
            View all
          </ButtonLink>
        </div>
        {/* -space-y-px collapses adjacent borders into one shared rule. */}
        <div className="mt-6 -space-y-px">
          {recent.map((job) => (
            <ListingRow key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
