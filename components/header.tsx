import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { HeaderMenu } from '@/components/header-menu';
import { monoUi } from '@/lib/brand-type';
import { SITE_NAME } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-surface pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[var(--content-max)] items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className={`${monoUi} min-w-0 truncate hover:opacity-70`}
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className={`${monoUi} hidden gap-7 md:flex`}>
          <Link href="/jobs" className="hover:opacity-70">
            Jobs
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block">
            <ButtonLink href="/post" size="sm" variant="outline">
              Post a job
            </ButtonLink>
          </div>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
