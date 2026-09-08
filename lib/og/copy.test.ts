import { test } from 'node:test';
import assert from 'node:assert/strict';
import { employerOgCopy, jobOgCopy, siteOgCopy } from '@/lib/og/copy';
import type { Job } from '@/lib/jobs';
import { getMetadataBase, normalizeSiteUrl } from '@/lib/site';

const sample: Job = {
  id: 'je-4401',
  source: 'employer',
  title: 'Journeyman Electrician',
  employer: 'Northline Electric',
  employerSlug: 'northline-electric',
  city: 'Calgary',
  province: 'AB',
  country: 'CA',
  trade: 'electrical',
  type: 'full-time',
  union: true,
  payMin: 38,
  payMax: 46,
  payUnit: 'hr',
  experience: '4+ years',
  postedDaysAgo: 2,
  summary: 'Commercial service.',
  responsibilities: ['Install'],
};

test('site OG copy is the homepage headline and trade strip', () => {
  const copy = siteOgCopy();
  assert.equal(copy.brand, 'Tradesboard');
  assert.equal(copy.headline, 'Work in the trades');
  assert.equal(copy.locale, 'Canada');
  assert.match(copy.trades, /Electrical/);
  assert.doesNotMatch(copy.trades, /Other trades/);
});

test('job OG copy keeps pay in the leftmost scanned slot', () => {
  const copy = jobOgCopy(sample);
  assert.equal(copy.headline, 'Journeyman Electrician');
  assert.equal(copy.employer, 'Northline Electric · Calgary, AB');
  assert.equal(copy.pay, '$38–$46/hr');
  assert.deepEqual(
    copy.badges.map((b) => b.label),
    ['Full-time', 'Union', 'Electrical'],
  );
  assert.equal(copy.badges[0]?.tone, 'full-time');
});

test('job OG copy still renders PAY NOT LISTED when pay is omitted', () => {
  const copy = jobOgCopy({ ...sample, payMin: undefined, payMax: undefined });
  assert.equal(copy.pay, 'Pay not listed');
});

test('employer OG copy pluralizes open roles and marks verified', () => {
  const one = employerOgCopy({
    name: 'Northline Electric',
    city: 'Calgary',
    province: 'AB',
    openRoles: 1,
    verified: true,
    trades: ['electrical'],
  });
  assert.equal(one.roles, '1 open role');
  assert.equal(one.verified, true);
  assert.equal(one.trades[0]?.label, 'Electrical');

  const many = employerOgCopy({
    name: 'Northline Electric',
    city: 'Calgary',
    province: 'AB',
    openRoles: 12,
    verified: false,
    trades: ['electrical', 'hvac'],
  });
  assert.equal(many.roles, '12 open roles');
});

test('normalizeSiteUrl adds https except for localhost', () => {
  assert.equal(normalizeSiteUrl('https://tradesboard.com/').href, 'https://tradesboard.com/');
  assert.equal(normalizeSiteUrl('tradesboard.com').href, 'https://tradesboard.com/');
  assert.equal(normalizeSiteUrl('localhost:8081').href, 'http://localhost:8081/');
});

test('getMetadataBase falls back to the local app port', () => {
  const prev = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercel = process.env.VERCEL_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.VERCEL_URL;
  try {
    assert.equal(getMetadataBase().href, 'http://localhost:8081/');
  } finally {
    if (prev !== undefined) process.env.NEXT_PUBLIC_SITE_URL = prev;
    if (vercelProd !== undefined) process.env.VERCEL_PROJECT_PRODUCTION_URL = vercelProd;
    if (vercel !== undefined) process.env.VERCEL_URL = vercel;
  }
});
