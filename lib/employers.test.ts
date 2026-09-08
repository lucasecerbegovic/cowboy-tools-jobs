import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterEmployers, type Employer } from '@/lib/employers';

const EMPLOYERS: Employer[] = [
  {
    slug: 'northline-electric',
    name: 'Northline Electric',
    verified: true,
    city: 'Calgary',
    province: 'AB',
    country: 'CA',
    about: 'Electrical contractor.',
    trades: ['electrical'],
    openRoles: 2,
  },
  {
    slug: 'ridgeline-interiors',
    name: 'Ridgeline Interiors',
    verified: true,
    city: 'Canmore',
    province: 'AB',
    country: 'CA',
    about: 'Millwork.',
    trades: ['carpentry'],
    openRoles: 2,
  },
  {
    slug: 'cascade-industrial-services',
    name: 'Cascade Industrial Services',
    verified: true,
    city: 'Fort McMurray',
    province: 'AB',
    country: 'CA',
    about: 'Industrial electrical.',
    trades: ['electrical'],
    openRoles: 1,
  },
];

test('employer slugs are unique', () => {
  const slugs = EMPLOYERS.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('filter by trade matches employers hiring that trade', () => {
  const electrical = filterEmployers(EMPLOYERS, { trade: ['electrical'] });
  assert.deepEqual(
    electrical.map((e) => e.slug).sort(),
    ['cascade-industrial-services', 'northline-electric'],
  );
});

test('filter by trade is a union across selected trades', () => {
  const both = filterEmployers(EMPLOYERS, { trade: ['electrical', 'carpentry'] });
  assert.ok(both.some((e) => e.slug === 'ridgeline-interiors'));
  assert.ok(both.some((e) => e.slug === 'northline-electric'));
});

test('name search is case-insensitive and matches city too', () => {
  assert.deepEqual(
    filterEmployers(EMPLOYERS, { q: 'NORTHLINE', trade: [] }).map((e) => e.slug),
    ['northline-electric'],
  );
  assert.ok(
    filterEmployers(EMPLOYERS, { q: 'canmore', trade: [] }).some(
      (e) => e.slug === 'ridgeline-interiors',
    ),
  );
});

test('empty filters return everything', () => {
  assert.equal(filterEmployers(EMPLOYERS, { trade: [] }).length, EMPLOYERS.length);
});
