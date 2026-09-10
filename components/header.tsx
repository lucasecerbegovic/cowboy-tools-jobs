import Link from 'next/link';
import { ButtonLink } from '@/components/button';
import { HeaderMenu } from '@/components/header-menu';
import { SiteBrandLink } from '@/components/ui/site-brand-link';
import { monoUi } from '@/lib/brand-type';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-surface pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[var(--content-max)] items-center justify-between gap-4 px-4 md:px-8">
        <SiteBrandLink tone="light" className="min-w-0" />

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
