import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buttonClass } from '@/components/button';
import { fieldControlClass } from '@/components/form/fields';
import { paginationCellClass } from '@/components/pagination';

test('buttonClass wraps long labels on small screens and keeps a 44px tap', () => {
  const cls = buttonClass('fill', 'lg');
  assert.match(cls, /max-sm:whitespace-normal/);
  assert.match(cls, /min-h-\[var\(--tap-min\)\]/);
});

test('sm buttons use the tap-min token', () => {
  assert.match(buttonClass('outline', 'sm'), /min-h-\[var\(--tap-min\)\]/);
});

test('field controls are 16px on small viewports so iOS does not zoom', () => {
  assert.match(fieldControlClass, /text-\[16px\]/);
  assert.match(fieldControlClass, /md:text-field/);
});

test('pagination cells include the tap-min token', () => {
  assert.match(paginationCellClass, /min-h-\[var\(--tap-min\)\]/);
});
