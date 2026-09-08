import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { mono, muted } from '@/lib/brand-type';
import { paginationItems } from '@/lib/pagination';
import { href, toParams, type Query } from '@/lib/url';

function pageHref(query: Query, page: number) {
  const p = toParams(query);
  if (page <= 1) p.delete('page');
  else p.set('page', String(page));
  return href('/jobs', p);
}

const cell =
  'flex h-10 min-w-10 items-center justify-center border border-ink px-2 transition-colors duration-150';

export function Pagination({
  query,
  page,
  totalPages,
}: {
  query: Query;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const items = paginationItems(page, totalPages);

  return (
    <nav aria-label="Pagination" className={`${mono.badge} flex flex-wrap`}>
      {page > 1 ? (
        <Link
          href={pageHref(query, page - 1)}
          rel="prev"
          aria-label="Previous page"
          className={`${cell} -mr-px hover:bg-row-hover`}
        >
          <ChevronLeft size={15} />
        </Link>
      ) : (
        // Chevrons are icons, not text — 0.35 is a named exception here.
        <span aria-hidden className={`${cell} -mr-px opacity-35`}>
          <ChevronLeft size={15} />
        </span>
      )}

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className={`${cell} -mr-px ${muted}`}
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(query, item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`${cell} -mr-px ${
              item === page ? 'bg-ink text-surface' : 'hover:bg-row-hover'
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={pageHref(query, page + 1)}
          rel="next"
          aria-label="Next page"
          className={`${cell} hover:bg-row-hover`}
        >
          <ChevronRight size={15} />
        </Link>
      ) : (
        <span aria-hidden className={`${cell} opacity-35`}>
          <ChevronRight size={15} />
        </span>
      )}
    </nav>
  );
}
