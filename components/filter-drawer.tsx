'use client';

import { useRouter } from 'next/navigation';
import { OverlayDrawer } from '@/components/ui/overlay-drawer';
import { ButtonLink } from '@/components/button';

export function FilterDrawer({
  open,
  closeHref,
  clearHref,
  children,
}: {
  open: boolean;
  closeHref: string;
  clearHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="lg:hidden">
      <OverlayDrawer
        open={open}
        onClose={() => router.push(closeHref)}
        title="Filters"
        closeAt="(min-width: 1024px)"
        footer={
          <>
            <ButtonLink href={closeHref} className="min-h-[var(--tap-min)] flex-1">
              Done
            </ButtonLink>
            <ButtonLink
              href={clearHref}
              variant="outline"
              className="min-h-[var(--tap-min)] flex-1"
            >
              Clear
            </ButtonLink>
          </>
        }
      >
        {children}
      </OverlayDrawer>
    </div>
  );
}
