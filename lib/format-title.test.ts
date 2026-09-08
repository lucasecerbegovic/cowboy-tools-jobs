import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatJobTitle } from '@/lib/format-title';

test('title-cases all-lowercase job titles', () => {
  assert.equal(
    formatJobTitle('auto body technician - refinishing'),
    'Auto Body Technician - Refinishing',
  );
  assert.equal(
    formatJobTitle('automotive electrical technician'),
    'Automotive Electrical Technician',
  );
  assert.equal(formatJobTitle('painter'), 'Painter');
  assert.equal(formatJobTitle('wood floor installer'), 'Wood Floor Installer');
  assert.equal(formatJobTitle('taper, drywall'), 'Taper, Drywall');
});

test('title-cases shouty ALL CAPS titles but leaves short acronyms', () => {
  assert.equal(formatJobTitle('JOURNEYMAN ELECTRICIAN'), 'Journeyman Electrician');
  assert.equal(formatJobTitle('HVAC'), 'HVAC');
  assert.equal(formatJobTitle('HVAC TECHNICIAN'), 'HVAC Technician');
});

test('preserves mixed-case titles as written', () => {
  assert.equal(formatJobTitle('Journeyman Electrician'), 'Journeyman Electrician');
  assert.equal(formatJobTitle('Construction electrician'), 'Construction electrician');
  assert.equal(formatJobTitle('HVAC Service Tech'), 'HVAC Service Tech');
});

test('keeps small words lowercase in the middle', () => {
  assert.equal(
    formatJobTitle('helper of the millwright'),
    'Helper of the Millwright',
  );
});

test('capitalizes after hyphens and slashes', () => {
  assert.equal(formatJobTitle('hvac/r technician'), 'HVAC/R Technician');
  assert.equal(formatJobTitle('on-site carpenter'), 'On-Site Carpenter');
});

test('leaves ordinals and empty strings alone', () => {
  assert.equal(formatJobTitle('1st class millwright'), '1st Class Millwright');
  assert.equal(formatJobTitle(''), '');
  assert.equal(formatJobTitle('   '), '   ');
});
