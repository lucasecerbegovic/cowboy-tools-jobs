export type PageItem = number | 'ellipsis';

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * Compact page list for the jobs pager. Always includes first and last;
 * windows around the current page; ellipsis for skipped ranges.
 * Caps at 7 numeric buttons so the bar cannot grow with result count.
 */
export function paginationItems(page: number, totalPages: number): PageItem[] {
  if (totalPages < 1) return [];
  const current = Math.min(Math.max(1, page), totalPages);

  if (totalPages <= 7) return range(1, totalPages);

  const siblings = 1;
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, totalPages);

  const showLeftEllipsis = left > 3;
  const showRightEllipsis = right < totalPages - 2;

  if (!showLeftEllipsis && !showRightEllipsis) return range(1, totalPages);
  if (!showLeftEllipsis) return [...range(1, 5), 'ellipsis', totalPages];
  if (!showRightEllipsis) return [1, 'ellipsis', ...range(totalPages - 4, totalPages)];
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', totalPages];
}

export function paginate<T>(
  items: T[],
  requestedPage: number,
  perPage: number,
): { page: number; totalPages: number; items: T[] } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1),
  );
  return {
    page,
    totalPages,
    items: items.slice((page - 1) * perPage, page * perPage),
  };
}
