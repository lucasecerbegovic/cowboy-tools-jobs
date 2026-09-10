import { OG_SIZE } from '@/lib/og/copy';
import { renderJobOgImage, renderSiteOgImage } from '@/lib/og/render';
import { OG_SITE_NAME } from '@/lib/site';
import { getJob } from '@/lib/store';

export const runtime = 'nodejs';
export const alt = `Skilled trades job on ${OG_SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJob((await params).id);
  if (!job) return renderSiteOgImage();
  return renderJobOgImage(job);
}
