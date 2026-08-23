import Link from 'next/link';
import { mono, monoUi } from '@/lib/brand-type';

const COLUMNS = [
  {
    title: 'For tradespeople',
    links: ['Browse jobs', 'Saved jobs', 'Apprenticeships', 'Wage guide'],
  },
  {
    title: 'For employers',
    links: ['Post a job', 'Pricing', 'Employer login', 'Hiring resources'],
  },
  { title: 'Company', links: ['About', 'Contact', 'Privacy', 'Terms'] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-surface">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className={monoUi}>Tradesboard</p>
            <p className={`${mono.meta} mt-4 text-surface/60`}>
              Alberta · Canada
            </p>
            <form className="mt-6 flex max-w-[320px] border border-surface">
              <label className="contents">
                <span className="sr-only">Email for job alerts</span>
                <input
                  type="email"
                  placeholder="Email for job alerts"
                  className="h-10 w-full bg-transparent px-3 text-body-sm outline-none placeholder:text-surface/60"
                />
              </label>
              <button
                type="submit"
                className={`${mono.button} shrink-0 bg-surface px-4 text-ink transition-opacity duration-150 hover:opacity-70`}
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
                  <li key={l}>
                    <Link
                      href="/jobs"
                      className="text-body-sm transition-opacity duration-150 hover:opacity-70"
                    >
                      {l}
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
          © 2026 Tradesboard
        </div>
      </div>
    </footer>
  );
}
