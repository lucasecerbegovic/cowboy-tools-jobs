import { test } from 'node:test';
import assert from 'node:assert/strict';
import { href, toggleParam, withFilters, withoutFilters } from '@/lib/url';

test('withFilters opens and closes the drawer without resetting facets', () => {
  const sp = { q: 'electrician', trade: 'electrical', filters: '1' };
  assert.equal(href('/jobs', withFilters(sp, true)), '/jobs?q=electrician&trade=electrical&filters=1');
  assert.equal(href('/jobs', withFilters(sp, false)), '/jobs?q=electrician&trade=electrical');
});

test('toggleParam keeps filters=1 so the drawer stays open', () => {
  const next = toggleParam(
    { filters: '1', trade: 'electrical' },
    'type',
    'full-time',
  );
  assert.equal(next.get('filters'), '1');
  assert.equal(href('/jobs', next), '/jobs?filters=1&trade=electrical&type=full-time');
});

test('withoutFilters drops the drawer flag for desktop and pagination links', () => {
  const next = withoutFilters({ q: 'welder', filters: '1', page: '2' });
  assert.equal(next.filters, undefined);
  assert.equal(next.q, 'welder');
  assert.equal(next.page, '2');
});
