import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { mono, muted } from '@/lib/brand-type';
import { paginationItems } from '@/lib/pagination';
import { href, toParams, type Query } from '@/lib/url';

function pageHref(base: string, query: Query, page: number) {
  const p = toParams(query);
  if (page <= 1) p.delete('page');
  else p.set('page', String(page));
  return href(base, p);
}

export const paginationCellClass =
  'flex h-10 min-h-[var(--tap-min)] min-w-10 min-w-[var(--tap-min)] items-center justify-center border border-ink px-2 transition-colors duration-150';

export function Pagination({
  query,
  page,
  totalPages,
  base = '/jobs',
}: {
  query: Query;
  page: number;
  totalPages: number;
  base?: string;
}) {
  if (totalPages <= 1) return null;
  const items = paginationItems(page, totalPages);

  return (
    <nav aria-label="Pagination" className={`${mono.badge} flex flex-wrap`}>
      {page > 1 ? (
        <Link
          href={pageHref(base, query, page - 1)}
          rel="prev"
          aria-label="Previous page"
          className={`${paginationCellClass} -mr-px hover:bg-row-hover`}
        >
          <ChevronLeft size={15} />
        </Link>
      ) : (
        // Chevrons are icons, not text — 0.35 is a named exception here.
        <span aria-hidden className={`${paginationCellClass} -mr-px opacity-35`}>
          <ChevronLeft size={15} />
        </span>
      )}

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className={`${paginationCellClass} -mr-px ${muted}`}
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(base, query, item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`${paginationCellClass} -mr-px ${
              item === page ? 'bg-ink text-surface' : 'hover:bg-row-hover'
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={pageHref(base, query, page + 1)}
          rel="next"
          aria-label="Next page"
          className={`${paginationCellClass} hover:bg-row-hover`}
        >
          <ChevronRight size={15} />
        </Link>
      ) : (
        <span aria-hidden className={`${paginationCellClass} opacity-35`}>
          <ChevronRight size={15} />
        </span>
      )}
    </nav>
  );
}
