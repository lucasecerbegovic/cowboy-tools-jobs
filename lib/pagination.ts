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
