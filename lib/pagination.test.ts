import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginationItems } from '@/lib/pagination';

test('small sets list every page', () => {
  assert.deepEqual(paginationItems(1, 1), [1]);
  assert.deepEqual(paginationItems(3, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test('near the start expands the first window instead of 1 … 3', () => {
  assert.deepEqual(paginationItems(1, 29), [1, 2, 3, 4, 5, 'ellipsis', 29]);
  assert.deepEqual(paginationItems(4, 29), [1, 2, 3, 4, 5, 'ellipsis', 29]);
});

test('the middle keeps first, last, and current ±1', () => {
  assert.deepEqual(paginationItems(5, 29), [1, 'ellipsis', 4, 5, 6, 'ellipsis', 29]);
  assert.deepEqual(paginationItems(23, 29), [1, 'ellipsis', 22, 23, 24, 'ellipsis', 29]);
});

test('near the end expands the last window', () => {
  assert.deepEqual(paginationItems(26, 29), [1, 'ellipsis', 25, 26, 27, 28, 29]);
  assert.deepEqual(paginationItems(29, 29), [1, 'ellipsis', 25, 26, 27, 28, 29]);
});

test('out-of-range pages clamp to the nearest real page', () => {
  assert.deepEqual(paginationItems(0, 29), paginationItems(1, 29));
  assert.deepEqual(paginationItems(99, 29), paginationItems(29, 29));
});

test('empty totals produce no items', () => {
  assert.deepEqual(paginationItems(1, 0), []);
});
