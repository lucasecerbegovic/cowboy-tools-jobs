import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobOgCopy, OG_ALT, siteOgCopy } from '@/lib/og/copy';
import type { Job } from '@/lib/jobs';
import {
  getMetadataBase,
  normalizeSiteUrl,
  OG_SITE_NAME,
  SITE_NAME,
} from '@/lib/site';

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

test('site OG copy is the jobs manifesto, not the HTML meta description', () => {
  const copy = siteOgCopy();
  assert.equal(copy.eyebrow, 'Jobs');
  assert.equal(copy.headline, 'Work in the trades.');
  assert.equal(copy.subhead, 'Jobs across Canada.');
  assert.deepEqual(copy.cells, [
    'Skilled Trades',
    'Open Roles',
    'Canada',
    'Apply Direct',
  ]);
  assert.equal(OG_ALT, 'Work in the trades. Jobs across Canada.');
});

test('OG site name is Cowboy Tools; in-app name stays Cowboy Tools Jobs', () => {
  assert.equal(OG_SITE_NAME, 'Cowboy Tools');
  assert.equal(SITE_NAME, 'Cowboy Tools Jobs');
});

test('job OG copy keeps pay in the body and always fills four cells', () => {
  const copy = jobOgCopy(sample);
  assert.equal(copy.headline, 'Journeyman Electrician');
  assert.equal(copy.employer, 'Northline Electric · Calgary, AB');
  assert.equal(copy.pay, '$38–$46/hr');
  assert.deepEqual(copy.cells, [
    'Full-time',
    'Electrical',
    'Calgary, AB',
    'Union',
  ]);
  assert.equal(copy.cells.length, 4);
});

test('job OG copy uses Open role when the listing is not union', () => {
  const copy = jobOgCopy({ ...sample, union: false });
  assert.deepEqual(copy.cells, [
    'Full-time',
    'Electrical',
    'Calgary, AB',
    'Open role',
  ]);
});

test('job OG copy omits placeholder employers from the byline', () => {
  const copy = jobOgCopy({
    ...sample,
    employer: 'Employer not listed',
    source: 'job_bank',
  });
  assert.equal(copy.employer, 'Calgary, AB');
});

test('job OG copy still renders PAY NOT LISTED when pay is omitted', () => {
  const copy = jobOgCopy({ ...sample, payMin: undefined, payMax: undefined });
  assert.equal(copy.pay, 'Pay not listed');
});

test('normalizeSiteUrl adds https except for localhost', () => {
  assert.equal(normalizeSiteUrl('https://jobs.cowboytools.ca/').href, 'https://jobs.cowboytools.ca/');
  assert.equal(normalizeSiteUrl('jobs.cowboytools.ca').href, 'https://jobs.cowboytools.ca/');
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
