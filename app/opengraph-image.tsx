import { OG_SIZE, siteOgCopy } from '@/lib/og/copy';
import { SiteOgCard } from '@/lib/og/frame';
import { renderOgImage } from '@/lib/og/render';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const runtime = 'nodejs';
export const alt = `${SITE_NAME} — ${SITE_DESCRIPTION}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  const copy = siteOgCopy();
  return renderOgImage(
    <SiteOgCard
      locale={copy.locale}
      headline={copy.headline}
      description={copy.description}
      trades={copy.trades}
    />,
  );
}
