import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFocusTrap,
  cycleFocus,
  lockBodyScroll,
  measureScrollbarWidth,
  restoreBodyScroll,
} from '@/lib/overlay';

test('lockBodyScroll hides overflow and compensates the gutter', () => {
  const el = { style: { overflow: '', paddingRight: '' } };
  const snapshot = lockBodyScroll(el, 15);
  assert.equal(el.style.overflow, 'hidden');
  assert.equal(el.style.paddingRight, '15px');
  restoreBodyScroll(el, snapshot);
  assert.equal(el.style.overflow, '');
  assert.equal(el.style.paddingRight, '');
});

test('measureScrollbarWidth is the inner minus client width', () => {
  assert.equal(
    measureScrollbarWidth({
      documentElement: { clientWidth: 980 },
      defaultView: { innerWidth: 1000 },
    }),
    20,
  );
  assert.equal(
    measureScrollbarWidth({
      documentElement: { clientWidth: 1000 },
      defaultView: { innerWidth: 1000 },
    }),
    0,
  );
});

test('cycleFocus wraps Tab at the ends of the trap', () => {
  const order: string[] = [];
  const first = { focus: () => order.push('first') };
  const last = { focus: () => order.push('last') };
  const prevented: boolean[] = [];
  const event = (key: string, shiftKey: boolean, target: unknown) => ({
    key,
    shiftKey,
    target,
    preventDefault: () => prevented.push(true),
  });

  assert.equal(cycleFocus(event('Tab', false, last), [first, last]), true);
  assert.equal(cycleFocus(event('Tab', true, first), [first, last]), true);
  assert.equal(cycleFocus(event('Tab', false, first), [first, last]), false);
  assert.equal(cycleFocus(event('Escape', false, first), [first, last]), false);
  assert.deepEqual(order, ['first', 'last']);
  assert.equal(prevented.length, 2);
});

test('createFocusTrap registers and unregisters the keydown listener', () => {
  const listeners: Array<(e: KeyboardEvent) => void> = [];
  const container = {
    addEventListener(type: 'keydown', listener: (e: KeyboardEvent) => void) {
      assert.equal(type, 'keydown');
      listeners.push(listener);
    },
    removeEventListener(type: 'keydown', listener: (e: KeyboardEvent) => void) {
      assert.equal(type, 'keydown');
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    },
    querySelectorAll() {
      return [];
    },
  };
  const trap = createFocusTrap(container);
  trap.activate();
  assert.equal(listeners.length, 1);
  trap.deactivate();
  assert.equal(listeners.length, 0);
});
