import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateField, validateAll } from '@/lib/validate';
import { APPLY_SCHEMA, POST_JOB_SCHEMA } from '@/lib/schemas';

test('required rejects empty and whitespace-only', () => {
  assert.equal(
    validateField('', { label: 'Job title', required: true }),
    'Job title is required.',
  );
  assert.equal(
    validateField('   ', { label: 'City', required: true }),
    'City is required.',
  );
});

test('optional field accepts empty', () => {
  assert.equal(validateField('', { label: 'Phone', maxLength: 5 }), undefined);
});

test('length bounds', () => {
  assert.equal(
    validateField('abc', { label: 'Summary', minLength: 40 }),
    'Summary must be at least 40 characters.',
  );
  assert.equal(
    validateField('abcdef', { label: 'City', maxLength: 3 }),
    'City must be 3 characters or fewer.',
  );
});

test('email requires a tld', () => {
  const rule = { label: 'Email', email: true };
  assert.equal(validateField('nope', rule), 'Enter a valid email address.');
  assert.equal(validateField('a@b', rule), 'Enter a valid email address.');
  assert.equal(validateField('a@b.ca', rule), undefined);
});

test('integer bounds reject decimals and out-of-range', () => {
  assert.equal(
    validateField('12.5', { label: 'Minimum pay', integer: {} }),
    'Minimum pay must be a whole number.',
  );
  assert.equal(
    validateField('-2', { label: 'Minimum pay', integer: { min: 0 } }),
    'Minimum pay must be 0 or more.',
  );
  assert.equal(
    validateField('900', { label: 'Minimum pay', integer: { max: 500 } }),
    'Minimum pay must be 500 or less.',
  );
  assert.equal(
    validateField('38', { label: 'Minimum pay', integer: { min: 0, max: 500 } }),
    undefined,
  );
});

test('oneOf constrains select values', () => {
  const rule = { label: 'Trade', oneOf: ['electrical'] };
  assert.equal(validateField('cooking', rule), 'Choose a trade.');
  assert.equal(validateField('electrical', rule), undefined);
});

test('empty post-a-job flags exactly the required fields', () => {
  const errors = validateAll({}, POST_JOB_SCHEMA);
  assert.deepEqual(
    Object.keys(errors).sort(),
    [
      'city',
      'contactEmail',
      'employer',
      'province',
      'responsibilities',
      'summary',
      'title',
      'trade',
      'type',
    ],
  );
  // Optional fields must not appear.
  assert.equal(errors.payMin, undefined);
  assert.equal(errors.experience, undefined);
});

test('valid post-a-job produces no errors', () => {
  const errors = validateAll(
    {
      title: 'Journeyman Electrician',
      employer: 'Northline Electric',
      trade: 'electrical',
      type: 'full-time',
      city: 'Calgary',
      province: 'AB',
      payMin: '38',
      payMax: '46',
      experience: '4+ years post-ticket',
      summary:
        'Commercial and light industrial service work across the Calgary region every week.',
      responsibilities: 'Install and repair commercial distribution systems',
      contactEmail: 'hiring@northline.ca',
    },
    POST_JOB_SCHEMA,
  );
  assert.deepEqual(errors, {});
});

test('apply requires only name and email', () => {
  assert.deepEqual(Object.keys(validateAll({}, APPLY_SCHEMA)).sort(), [
    'email',
    'name',
  ]);
  assert.deepEqual(
    validateAll({ name: 'Sam Delaney', email: 'sam@example.ca' }, APPLY_SCHEMA),
    {},
  );
});
