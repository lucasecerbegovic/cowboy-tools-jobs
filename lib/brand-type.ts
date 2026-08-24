/**
 * Mono type roles from docs/brand-guidelines.md § Type.
 *
 * Import these instead of writing `font-mono text-[11px] tracking-[0.18em]`
 * at a call site. Each role's size, weight and tracking live in the
 * `--text-*` tokens in app/globals.css, so a role name is the whole recipe.
 *
 * Do not declare a local `const mono` in a component file.
 */
export const mono = {
  /** Employer name on rows and detail pages. 13px / 0.14em. */
  employer: 'font-mono text-employer uppercase',
  /** Pay figures. 14px / 500 / 0.02em. The most-scanned value on the page. */
  pay: 'font-mono text-pay',
  /** Row metadata: type, location, posted date. 12px / 0.08em. */
  meta: 'font-mono text-meta uppercase',
  /** Field and section labels. 11px / 500 / 0.18em. */
  label: 'font-mono text-label uppercase',
  /** Badges: employment type, trade, status. 11px / 500 / 0.14em. */
  badge: 'font-mono text-badge uppercase',
  /** Default and compact buttons. 12px / 500 / 0.16em. */
  button: 'font-mono text-button uppercase',
  /** Large primary CTA. 13px / 500 / 0.16em. */
  buttonLg: 'font-mono text-button-lg uppercase',
} as const;

export type MonoRole = keyof typeof mono;

/**
 * Shorthand for the most common case — nav items and small UI labels.
 * Equivalent to `mono.label`.
 */
export const monoUi = mono.label;

/**
 * Muted text. 0.6 alpha is 5.74:1 on white; 0.55 is the absolute floor.
 * Never go below. Spec: docs/brand-guidelines.md § Accessibility floor.
 */
export const muted = 'text-muted';
