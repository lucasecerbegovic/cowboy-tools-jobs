import Link from 'next/link';
import { mono, monoUi } from '@/lib/brand-type';
import { SITE_NAME } from '@/lib/site';

const COLUMNS = [
  {
    title: 'For tradespeople',
    links: [
      { label: 'Browse jobs', href: '/jobs' },
      { label: 'Apprenticeships', href: '/jobs?type=apprenticeship' },
      { label: 'Union roles', href: '/jobs?union=1' },
    ],
  },
  {
    title: 'For employers',
    links: [{ label: 'Post a job', href: '/post' }],
  },
  { title: 'Company', links: [{ label: 'About', href: '/' }] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className={monoUi}>{SITE_NAME}</p>
            <p className={`${mono.meta} mt-4 text-surface/60`}>
              Canada
            </p>
            <form className="mt-6 flex max-w-[320px] border border-surface">
              <label className="contents">
                <span className="sr-only">Email for job alerts</span>
                <input
                  type="email"
                  placeholder="Email for job alerts"
                  className="h-[var(--tap-min)] w-full bg-transparent px-3 text-[16px] outline-none placeholder:text-surface/60"
                />
              </label>
              <button
                type="submit"
                className={`${mono.button} min-h-[var(--tap-min)] shrink-0 bg-surface px-4 text-ink transition-opacity duration-150 hover:opacity-70`}
              >
                Subscribe
              </button>
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className={`${monoUi} text-surface/60`}>{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex min-h-[var(--tap-min)] items-center text-body-sm transition-opacity duration-150 hover:opacity-70"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`${mono.meta} mt-12 border-t border-hairline pt-6 text-surface/60`}
        >
          © 2026 {SITE_NAME}
        </div>
      </div>
    </footer>
  );
}
