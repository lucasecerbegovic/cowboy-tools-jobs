import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { ApplyCard } from '@/components/apply-card';
import { FilterRail } from '@/components/filter-rail';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import type { Job } from '@/lib/jobs';

const job: Job = {
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

test('Header paints a mobile menu button', () => {
  const html = renderToString(Header());
  assert.match(html, /aria-label="Open menu"/);
  assert.match(html, /aria-expanded="false"/);
});

test('Header and Footer show the Cowboy Tools logo mark', () => {
  const header = renderToString(Header());
  const footer = renderToString(Footer());
  assert.match(header, /cowboy-tools-logo-full\.png/);
  assert.match(footer, /cowboy-tools-logo-full\.png/);
});

test('Footer links to the parent retail site', () => {
  const footer = renderToString(Footer());
  assert.match(footer, /href="https:\/\/cowboytools\.ca"/);
  assert.match(footer, /Need great deals on tools\?/);
});

test('Footer Company About links to /about', () => {
  const footer = renderToString(Footer());
  assert.match(footer, /href="\/about"/);
  assert.match(footer, />About</);
});

test('nav does not surface the parked employer directory', () => {
  const header = renderToString(Header());
  const footer = renderToString(Footer());
  assert.doesNotMatch(header, /href="\/employers/);
  assert.doesNotMatch(footer, /href="\/employers/);
  assert.doesNotMatch(header, />Employers</);
  assert.doesNotMatch(footer, />Directory</);
});

test('FilterRail facet hrefs stay shareable GET urls on /jobs', () => {
  const html = renderToString(
    FilterRail({
      query: { q: 'welder', filters: '1' },
      trades: [{ value: 'welding', label: 'Welding', count: 4 }],
      types: [{ value: 'full-time', label: 'Full-time', count: 2 }],
      unionCount: 1,
      selectedTrades: [],
      selectedTypes: [],
      unionOnly: false,
    }),
  );
  assert.match(html, /href="\/jobs\?[^"]*trade=welding/);
  assert.match(html, /filters=1/);
});

test('ApplyCard renders a single Apply control', () => {
  const html = renderToString(
    ApplyCard({
      job,
      apply: { href: `/jobs/${job.id}/apply`, external: false },
    }),
  );
  const matches = html.match(/Apply now/g) ?? [];
  assert.equal(matches.length, 1);
  assert.match(html, /href="\/jobs\/je-4401\/apply"/);
});
