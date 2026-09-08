import { EmptyState } from '@/components/empty-state';
import { ListingRow } from '@/components/listing-row';
import { SearchField } from '@/components/search-field';
import { ButtonLink } from '@/components/button';
import { monoUi, muted } from '@/lib/brand-type';
import { countJobs, listJobs } from '@/lib/store';

export const dynamic = 'force-dynamic';

const HOME_LISTING_LIMIT = 20;

export default async function Home() {
  const [openCount, recent] = await Promise.all([
    countJobs(),
    listJobs({ take: HOME_LISTING_LIMIT }),
  ]);
  const hasMore = openCount > recent.length;

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 md:px-8">
      {/* Search is the hero — capped so listings clear the fold on a 667px phone. */}
      <section className="max-h-[320px] py-10 md:py-12">
        <p className={`${monoUi} ${muted}`}>Canada · {openCount} open roles</p>
        <h1 className="mt-3 text-display uppercase">Work in the trades</h1>
        <div className="mt-7">
          <SearchField />
        </div>
      </section>

      <section className="pb-16">
        <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
          <h2 className={monoUi}>Recently posted</h2>
          {hasMore && (
            <ButtonLink href="/jobs" variant="bare" size="sm">
              View all
            </ButtonLink>
          )}
        </div>
        {recent.length > 0 ? (
          <>
            {/* -space-y-px collapses adjacent borders into one shared rule. */}
            <div className="mt-6 -space-y-px">
              {recent.map((job) => (
                <ListingRow key={job.id} job={job} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <ButtonLink href="/jobs" size="lg">
                  Search hundreds more jobs
                </ButtonLink>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10">
            <EmptyState
              label="No open roles"
              body="Nothing on the board right now. Check back soon, or post a job if you’re hiring."
              actionLabel="Post a job"
              actionHref="/post"
            />
          </div>
        )}
      </section>
    </main>
  );
}
