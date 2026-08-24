import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPLOYERS,
  employerOf,
  employerTrades,
  filterEmployers,
  getEmployer,
  jobsForEmployer,
  openRoleCount,
} from '@/lib/employers';
import { JOBS } from '@/lib/jobs';

test('every job resolves to a real employer', () => {
  const orphans = JOBS.filter((j) => employerOf(j) === undefined);
  assert.deepEqual(
    orphans.map((j) => `${j.id}:${j.employerSlug}`),
    [],
    'jobs referencing a missing employer slug',
  );
});

test('employer slugs are unique', () => {
  const slugs = EMPLOYERS.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('display name on a job matches its employer record', () => {
  for (const j of JOBS) {
    assert.equal(employerOf(j)?.name, j.employer, `mismatch on ${j.id}`);
  }
});

test('open role counts partition the job list exactly', () => {
  const total = EMPLOYERS.reduce((n, e) => n + openRoleCount(e.slug), 0);
  assert.equal(total, JOBS.length);
});

test('employerTrades is distinct and matches the employer job set', () => {
  for (const e of EMPLOYERS) {
    const trades = employerTrades(e.slug);
    assert.equal(new Set(trades).size, trades.length, `${e.slug} has duplicates`);
    const fromJobs = new Set(jobsForEmployer(e.slug).map((j) => j.trade));
    assert.deepEqual([...trades].sort(), [...fromJobs].sort());
  }
});

test('unknown slug returns undefined rather than throwing', () => {
  assert.equal(getEmployer('nope'), undefined);
  assert.deepEqual(jobsForEmployer('nope'), []);
  assert.deepEqual(employerTrades('nope'), []);
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
