import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyTarget,
  filterJobs,
  formatPay,
  mapJobRecord,
  toUiTrade,
  type Job,
} from '@/lib/jobs';

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

test('toUiTrade maps ingest slugs onto board trades', () => {
  assert.equal(toUiTrade('electrician'), 'electrical');
  assert.equal(toUiTrade('heavy_equipment'), 'heavy-equipment');
  assert.equal(toUiTrade('millwright'), 'millwright');
});

test('formatPay never collapses when pay is missing', () => {
  assert.equal(formatPay({ ...sample, payMin: undefined, payMax: undefined }), 'Pay not listed');
  assert.equal(formatPay(sample), '$38–$46/hr');
});

test('filterJobs matches location across city, province, and country', () => {
  const on: Job = { ...sample, id: 'on-1', city: 'Toronto', province: 'ON', country: 'CA' };
  const bc: Job = { ...sample, id: 'bc-1', city: 'Vancouver', province: 'BC', country: 'CA' };
  const yt: Job = { ...sample, id: 'ab-yt', city: 'Drayton Valley', province: 'AB', country: 'CA' };
  assert.equal(filterJobs([sample, on], { loc: 'on', trade: [], type: [], union: false }).length, 1);
  assert.equal(filterJobs([sample, on], { loc: 'calgary', trade: [], type: [], union: false }).length, 1);
  assert.equal(filterJobs([sample, on], { loc: 'Alberta', trade: [], type: [], union: false }).length, 1);
  assert.equal(filterJobs([sample, on], { loc: 'west', trade: [], type: [], union: false }).length, 1);
  assert.equal(filterJobs([sample, bc], { loc: 'MB', trade: [], type: [], union: false }).length, 0);
  assert.equal(filterJobs([yt], { loc: 'YT', trade: [], type: [], union: false }).length, 0);
});

test('aggregated jobs apply by linking out', () => {
  const adzuna: Job = {
    ...sample,
    source: 'adzuna',
    applyUrl: 'https://www.adzuna.com/job/1',
  };
  assert.deepEqual(applyTarget(adzuna), {
    href: 'https://www.adzuna.com/job/1',
    external: true,
  });
  assert.deepEqual(applyTarget(sample), {
    href: '/jobs/je-4401/apply',
    external: false,
  });
});

test('mapJobRecord hydrates posted age and pay unit', () => {
  const job = mapJobRecord({
    id: 'x',
    source: 'job_bank',
    title: 'Plumber',
    company: 'Shop',
    description: 'Service.',
    trade: 'plumber',
    country: 'CA',
    region: 'AB',
    city: 'Calgary',
    isApprenticeship: false,
    employmentType: 'Full-time',
    salaryMin: 34,
    salaryMax: 42,
    payUnit: 'HOUR',
    applyUrl: 'https://www.jobbank.gc.ca',
    postedAt: new Date(),
    expiresAt: null,
    union: false,
    experience: '',
    responsibilities: ['Quote work'],
    employerSlug: 'shop',
  });
  assert.equal(job.trade, 'plumbing');
  assert.equal(job.type, 'full-time');
  assert.equal(job.payUnit, 'hr');
  assert.equal(job.postedDaysAgo, 0);
  assert.equal(job.applyUrl, 'https://www.jobbank.gc.ca');
  assert.equal(job.employerLogo, undefined);
});

test('mapJobRecord title-cases sloppy lowercase titles', () => {
  const job = mapJobRecord({
    id: 'x',
    source: 'job_bank',
    title: 'auto body technician - refinishing',
    company: 'Shop',
    description: 'Body work.',
    trade: 'other',
    country: 'CA',
    region: 'SK',
    city: 'Wadena',
    isApprenticeship: false,
    employmentType: 'Full-time',
    salaryMin: 25,
    salaryMax: 38,
    payUnit: 'HOUR',
    applyUrl: null,
    postedAt: new Date(),
    expiresAt: null,
    union: false,
    experience: '',
    responsibilities: [],
    employerSlug: 'shop',
  });
  assert.equal(job.title, 'Auto Body Technician - Refinishing');
});
