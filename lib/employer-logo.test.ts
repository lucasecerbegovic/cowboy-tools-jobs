import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  displayEmployerName,
  employerInitials,
  inferEmployerBranding,
  isGenericEmployerName,
  isSafeLogoUrl,
  jobByline,
  jobDocumentTitle,
  resolveEmployerLogo,
  websiteFromApplyUrl,
  websiteFromEmail,
} from '@/lib/employer-logo';

test('initials skip punctuation', () => {
  assert.equal(employerInitials('Bow Valley Mechanical'), 'BO');
  assert.equal(employerInitials('A.B. Mechanical'), 'AB');
});

test('generic aggregator names are skipped', () => {
  assert.equal(isGenericEmployerName('Employer (via Job Bank)'), true);
  assert.equal(isGenericEmployerName('Northline Electric'), false);
});

test('junk placeholders like "No" are not treated as a company', () => {
  assert.equal(isGenericEmployerName('No'), true);
  assert.equal(isGenericEmployerName('Yes'), true);
  assert.equal(isGenericEmployerName('none'), true);
  assert.equal(isGenericEmployerName('N/A'), true);
  assert.equal(isGenericEmployerName('Unknown'), true);
  assert.equal(isGenericEmployerName('No company'), true);
  assert.equal(isGenericEmployerName('Nova Electric'), false);
  assert.equal(displayEmployerName('No'), 'Employer not listed');
  assert.equal(displayEmployerName('Northline Electric'), 'Northline Electric');
});

test('job byline omits placeholder companies and keeps real names', () => {
  assert.equal(jobByline({ employer: 'No', city: 'Calgary', province: 'AB' }), 'Calgary, AB');
  assert.equal(
    jobByline({ employer: 'Employer (via Job Bank)', city: 'Toronto', province: 'ON' }),
    'Toronto, ON',
  );
  assert.equal(
    jobByline({ employer: 'Employer not listed', city: 'Winnipeg', province: 'MB' }),
    'Winnipeg, MB',
  );
  assert.equal(
    jobByline({ employer: 'Northline Electric', city: 'Calgary', province: 'AB' }),
    'Northline Electric · Calgary, AB',
  );
  assert.equal(
    jobDocumentTitle({
      title: 'Plumber',
      employer: 'No',
      city: 'Calgary',
      province: 'AB',
    }),
    'Plumber — Calgary, AB',
  );
});

test('email domains become websites except public mail and .example', () => {
  assert.equal(websiteFromEmail('jobs@northline-electric.ca'), 'https://northline-electric.ca');
  assert.equal(websiteFromEmail('jobs@northline-electric.example'), null);
  assert.equal(websiteFromEmail('a@gmail.com'), null);
});

test('apply URLs on job boards are not treated as employer sites', () => {
  assert.equal(websiteFromApplyUrl('https://www.adzuna.com/jobs/1'), null);
  assert.equal(
    websiteFromApplyUrl('https://careers.northline.ca/apply'),
    'https://careers.northline.ca',
  );
});

test('logo URLs must be https or same-origin paths', () => {
  assert.equal(isSafeLogoUrl('/employer-logos/bow-valley-mechanical.svg'), true);
  assert.equal(isSafeLogoUrl('https://img.logo.dev/jobbank.gc.ca'), true);
  assert.equal(isSafeLogoUrl('javascript:alert(1)'), false);
  assert.equal(isSafeLogoUrl('//evil.example/x.png'), false);
});

test('resolve prefers stored logo, then seed mark, then .gc.ca favicon', () => {
  assert.equal(
    resolveEmployerLogo({
      name: 'Bow Valley Mechanical',
      slug: 'bow-valley-mechanical',
    }),
    '/employer-logos/bow-valley-mechanical.svg',
  );
  assert.equal(
    resolveEmployerLogo({
      name: 'Employment and Social Development Canada',
      website: 'https://www.jobbank.gc.ca',
    }),
    'https://www.jobbank.gc.ca/favicon.ico',
  );
  assert.equal(
    resolveEmployerLogo({
      name: 'Employer (via Job Bank)',
      slug: 'job-bank-seed-jb-carpenter-vancouver',
    }),
    undefined,
  );
});

test('ingest branding stores website without inventing a logo URL', () => {
  const fromSite = inferEmployerBranding({
    name: 'Shop',
    website: 'https://www.jobbank.gc.ca',
  });
  assert.equal(fromSite.website, 'https://www.jobbank.gc.ca');
  assert.equal(fromSite.logoUrl, null);

  const fromSource = inferEmployerBranding({
    name: 'Acme',
    logoUrl: 'https://cdn.example.com/acme.png',
  });
  assert.equal(fromSource.logoUrl, 'https://cdn.example.com/acme.png');
});
