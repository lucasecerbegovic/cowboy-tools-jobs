import type { Metadata } from 'next';
import Link from 'next/link';
import { BADGE_TONES, isBadgeTone } from '@/components/badge';
import { EmptyState } from '@/components/empty-state';
import { FilterRail } from '@/components/filter-rail';
import { ListingRow } from '@/components/listing-row';
import { Pagination } from '@/components/pagination';
import { SearchField } from '@/components/search-field';
import { Close } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import {
  TRADE_LABELS,
  TYPE_LABELS,
  filterJobs,
  isEmploymentType,
  isTrade,
  type Filters,
} from '@/lib/jobs';
import { paginate } from '@/lib/pagination';
import { listJobs } from '@/lib/store';
import { asArray, href, removeParam, type Query } from '@/lib/url';

const PER_PAGE = 18;

function chipTone(key: string, value: string | undefined): string {
  if (key === 'union') return BADGE_TONES.union;
  if (key === 'type' && value && isBadgeTone(value)) return BADGE_TONES[value];
  return 'border-ink bg-ink text-surface';
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Jobs',
  description: 'Browse skilled trades jobs in Canada.',
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const sp = await searchParams;
  const jobs = await listJobs();

  const filters: Filters = {
    q: typeof sp.q === 'string' && sp.q ? sp.q : undefined,
    loc: typeof sp.loc === 'string' && sp.loc ? sp.loc : undefined,
    trade: asArray(sp.trade).filter(isTrade),
    type: asArray(sp.type).filter(isEmploymentType),
    union: sp.union === '1',
  };

  const results = filterJobs(jobs, filters);

  /* Facet counts exclude their own dimension, so a count never reads as zero
     just because you already narrowed by it. */
  const tradeCounts = (t: (typeof filters.trade)[number]) =>
    filterJobs(jobs, { ...filters, trade: [t] }).length;
  const typeCounts = (t: (typeof filters.type)[number]) =>
    filterJobs(jobs, { ...filters, type: [t] }).length;

  const trades = (Object.keys(TRADE_LABELS) as Array<keyof typeof TRADE_LABELS>)
    .map((v) => ({ value: v, label: TRADE_LABELS[v], count: tradeCounts(v) }))
    .filter((o) => o.count > 0 || filters.trade.includes(o.value));

  const types = (Object.keys(TYPE_LABELS) as Array<keyof typeof TYPE_LABELS>)
    .map((v) => ({ value: v, label: TYPE_LABELS[v], count: typeCounts(v) }))
    .filter((o) => o.count > 0 || filters.type.includes(o.value));

  const unionCount = filterJobs(jobs, { ...filters, union: true }).length;

  const { page, totalPages, items: pageItems } = paginate(
    results,
    Number(sp.page) || 1,
    PER_PAGE,
  );

  /* Active filters, rendered as removable chips above the results. */
  const chips = [
    ...(filters.q ? [{ key: 'q', value: undefined, label: `“${filters.q}”` }] : []),
    ...(filters.loc
      ? [{ key: 'loc', value: undefined, label: filters.loc }]
      : []),
    ...filters.trade.map((t) => ({
      key: 'trade',
      value: t,
      label: TRADE_LABELS[t],
    })),
    ...filters.type.map((t) => ({
      key: 'type',
      value: t,
      label: TYPE_LABELS[t],
    })),
    ...(filters.union ? [{ key: 'union', value: '1', label: 'Union only' }] : []),
  ];

  /* Zero results must offer the nearest broader query — drop whichever single
     filter recovers the most jobs, rather than dumping the user at "clear all". */
  const broader = chips
    .map((c) => {
      const next = removeParam(sp, c.key, c.value);
      const f: Filters = {
        q: c.key === 'q' ? undefined : filters.q,
        loc: c.key === 'loc' ? undefined : filters.loc,
        trade:
          c.key === 'trade' ? filters.trade.filter((t) => t !== c.value) : filters.trade,
        type:
          c.key === 'type' ? filters.type.filter((t) => t !== c.value) : filters.type,
        union: c.key === 'union' ? false : filters.union,
      };
      return { label: c.label, href: href('/jobs', next), count: filterJobs(jobs, f).length };
    })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)[0];

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 md:px-8">
      <SearchField defaultQ={filters.q} defaultLoc={filters.loc} />

      {chips.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Link
              key={`${c.key}-${c.value ?? ''}`}
              href={href('/jobs', removeParam(sp, c.key, c.value))}
              className={`${mono.badge} inline-flex items-center gap-2 border py-1.5 pl-3 pr-2 transition-opacity duration-150 hover:opacity-70 ${chipTone(c.key, c.value)}`}
            >
              {c.label}
              <Close size={13} />
              <span className="sr-only">Remove filter</span>
            </Link>
          ))}
          <Link
            href="/jobs"
            className={`${mono.badge} ml-auto underline-offset-4 hover:underline`}
          >
            Clear all
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[var(--rail-w)_1fr]">
        <aside className="lg:sticky lg:top-[var(--sticky-top)] lg:self-start">
          <h2 className="sr-only">Filters</h2>
          <FilterRail
            query={sp}
            trades={trades}
            types={types}
            unionCount={unionCount}
            selectedTrades={filters.trade}
            selectedTypes={filters.type}
            unionOnly={filters.union}
          />
        </aside>

        <section>
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <h2 className={monoUi}>
              {results.length} {results.length === 1 ? 'job' : 'jobs'}
            </h2>
            {totalPages > 1 && (
              <p className={`${mono.meta} ${muted}`}>
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {pageItems.length > 0 ? (
            <>
              <div className="mt-6 -space-y-px">
                {pageItems.map((job) => (
                  <ListingRow key={job.id} job={job} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination query={sp} page={page} totalPages={totalPages} />
              </div>
            </>
          ) : (
            <div className="mt-10">
              <EmptyState
                label="No matches"
                body="Nothing matched every filter you applied. Widening one of them usually brings results back."
                actionLabel="Clear filters"
                actionHref="/jobs"
                secondary={
                  broader
                    ? {
                        label: `Drop “${broader.label}” — ${broader.count} jobs`,
                        href: broader.href,
                      }
                    : undefined
                }
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
