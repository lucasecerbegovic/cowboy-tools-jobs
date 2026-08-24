import type { Metadata } from 'next';
import Link from 'next/link';
import { CompanyCard } from '@/components/company-card';
import { EmptyState } from '@/components/empty-state';
import { Search } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { EMPLOYERS, employerTrades, filterEmployers } from '@/lib/employers';
import { TRADE_LABELS, type Trade } from '@/lib/jobs';
import { asArray, href, toggleParam, type Query } from '@/lib/url';

export const metadata: Metadata = {
  title: 'Employers — Tradesboard',
  description: 'Companies hiring in the skilled trades.',
};

export default async function EmployersPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' && sp.q ? sp.q : undefined;
  const selected = asArray(sp.trade) as Trade[];

  const results = filterEmployers(EMPLOYERS, { q, trade: selected });

  /* Only offer trades some employer is actually hiring for. */
  const available = (Object.keys(TRADE_LABELS) as Trade[]).filter((t) =>
    EMPLOYERS.some((e) => employerTrades(e.slug).includes(t)),
  );

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 md:px-8">
      <p className={`${monoUi} ${muted}`}>Directory</p>
      <h1 className="mt-3 text-page-title">Employers</h1>

      <form action="/employers" method="get" className="mt-8 flex max-w-[520px] border border-ink">
        <label className="contents">
          <span className="sr-only">Company or city</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Company or city"
            className="h-[var(--field-h)] w-full bg-surface px-4 text-field outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
          />
        </label>
        <button
          type="submit"
          className={`${mono.button} flex shrink-0 items-center gap-2 bg-ink px-5 text-surface transition-opacity duration-150 hover:opacity-70`}
        >
          <Search size={14} />
          Search
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {available.map((t) => {
          const on = selected.includes(t);
          return (
            <Link
              key={t}
              href={href('/employers', toggleParam(sp, 'trade', t))}
              aria-pressed={on}
              className={`${mono.badge} border px-3 py-1.5 transition-opacity duration-150 hover:opacity-70 ${
                on ? 'border-ink bg-ink text-surface' : 'border-ink bg-surface'
              }`}
            >
              {TRADE_LABELS[t]}
            </Link>
          );
        })}
        {(selected.length > 0 || q) && (
          <Link
            href="/employers"
            className={`${mono.badge} ml-auto underline-offset-4 hover:underline`}
          >
            Clear all
          </Link>
        )}
      </div>

      <h2 className={`${monoUi} mt-10 border-b border-ink pb-3`}>
        {results.length} {results.length === 1 ? 'company' : 'companies'}
      </h2>

      {results.length > 0 ? (
        /* Negative margins collapse adjacent card borders into shared rules. */
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*]:-ml-px [&>*]:-mt-px">
          {results.map((e) => (
            <CompanyCard key={e.slug} employer={e} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            label="No companies"
            body="No employer matched that search. Clearing the trade filters usually brings results back."
            actionLabel="Clear filters"
            actionHref="/employers"
          />
        </div>
      )}
    </main>
  );
}
