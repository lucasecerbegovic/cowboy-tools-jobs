import { Search } from '@/components/icons';
import { mono } from '@/lib/brand-type';

/**
 * The most important component in the product. A plain GET form, so a search
 * is a shareable URL and works without JavaScript.
 * Spec: docs/brand-guidelines.md § Search field
 */
export function SearchField({
  defaultQ = '',
  defaultLoc = '',
}: {
  defaultQ?: string;
  defaultLoc?: string;
}) {
  const field =
    'h-[var(--search-h)] w-full bg-surface px-4 text-body outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink';

  return (
    <form action="/jobs" method="get" className="border border-ink">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px]">
        <label className="contents">
          <span className="sr-only">Trade or keyword</span>
          <input
            type="search"
            name="q"
            defaultValue={defaultQ}
            placeholder="Trade or keyword"
            className={`${field} border-b border-ink md:border-r md:border-b-0`}
          />
        </label>
        <label className="contents">
          <span className="sr-only">City or postal code</span>
          <input
            type="search"
            name="loc"
            defaultValue={defaultLoc}
            placeholder="City or postal code"
            className={`${field} border-b border-ink md:border-r md:border-b-0`}
          />
        </label>
        <button
          type="submit"
          className={`${mono.buttonLg} flex h-[var(--search-h)] items-center justify-center gap-2 bg-ink text-surface transition-opacity duration-150 hover:opacity-70`}
        >
          <Search size={15} />
          Search
        </button>
      </div>
    </form>
  );
}
