import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { monoUi } from '@/lib/brand-type';
import { SITE_NAME } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-surface">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[var(--content-max)] items-center justify-between gap-6 px-4 md:px-8">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className={`${monoUi} shrink-0 hover:opacity-70`}
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className={`${monoUi} hidden gap-7 md:flex`}>
          <Link href="/jobs" className="hover:opacity-70">
            Jobs
          </Link>
          <Link href="/employers" className="text-muted hover:opacity-70">
            Employers
          </Link>
        </nav>

        <ButtonLink href="/post" size="sm" variant="outline">
          Post a job
        </ButtonLink>
      </div>
    </header>
  );
}
