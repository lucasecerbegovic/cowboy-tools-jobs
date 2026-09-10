import type { Metadata } from 'next';
import { ButtonLink } from '@/components/button';
import { monoUi, muted } from '@/lib/brand-type';
import { OG_SITE_NAME, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Cowboy Tools brings buyers and sellers together to build a stronger country and economy.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
      <p className={`${monoUi} ${muted}`}>Company</p>
      <h1 className="mt-3 text-page-title">About {OG_SITE_NAME}</h1>
      <div className={`mt-4 max-w-[60ch] space-y-4 text-body ${muted}`}>
        <p>
          {OG_SITE_NAME} is a service that helps our customers — buyers and
          sellers — come together. When people trade fairly and work with
          purpose, they build a stronger country and a stronger economy.
        </p>
        <p>
          We exist to make those connections practical: the right tools in the
          right hands, and the right people on the right jobs. That is how
          shops grow, crews stay busy, and communities thrive.
        </p>
        <p>
          {SITE_NAME} is how that mission shows up for skilled-trades hiring in
          Canada — connecting employers who need crews with tradespeople ready
          to work.
        </p>
      </div>
      <div className="mt-12">
        <ButtonLink href="/jobs">Browse jobs</ButtonLink>
      </div>
    </main>
  );
}
