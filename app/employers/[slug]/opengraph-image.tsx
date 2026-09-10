import { OG_ALT, OG_SIZE } from '@/lib/og/copy';
import { renderSiteOgImage } from '@/lib/og/render';

export const runtime = 'nodejs';
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = 'image/png';
export const revalidate = 86400;

/** Directory is parked; old employer URLs share the site card. */
export default async function Image() {
  return renderSiteOgImage();
}
