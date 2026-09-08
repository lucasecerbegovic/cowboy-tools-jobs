import { OG_SIZE, employerOgCopy, fallbackOgCopy } from '@/lib/og/copy';
import { EmployerOgCard, SiteOgCard } from '@/lib/og/frame';
import { renderOgImage } from '@/lib/og/render';
import { getEmployer } from '@/lib/store';

export const runtime = 'nodejs';
export const alt = 'Employer on Tradesboard';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const employer = await getEmployer((await params).slug);
  if (!employer) {
    const copy = fallbackOgCopy('Employer not found');
    return renderOgImage(
      <SiteOgCard
        locale={copy.locale}
        headline={copy.headline}
        description={copy.description}
        trades={copy.trades}
      />,
    );
  }

  const copy = employerOgCopy(employer);
  return renderOgImage(
    <EmployerOgCard
      headline={copy.headline}
      location={copy.location}
      roles={copy.roles}
      verified={copy.verified}
      trades={copy.trades}
    />,
  );
}
