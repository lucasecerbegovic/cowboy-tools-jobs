import { OG_SIZE, fallbackOgCopy, jobOgCopy } from '@/lib/og/copy';
import { JobOgCard, SiteOgCard } from '@/lib/og/frame';
import { renderOgImage } from '@/lib/og/render';
import { getJob } from '@/lib/store';
import { SITE_NAME } from '@/lib/site';

export const runtime = 'nodejs';
export const alt = `Skilled trades job on ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await getJob((await params).id);
  if (!job) {
    const copy = fallbackOgCopy('Job not found');
    return renderOgImage(
      <SiteOgCard
        locale={copy.locale}
        headline={copy.headline}
        description={copy.description}
        trades={copy.trades}
      />,
    );
  }

  const copy = jobOgCopy(job);
  return renderOgImage(
    <JobOgCard
      headline={copy.headline}
      employer={copy.employer}
      pay={copy.pay}
      badges={copy.badges}
    />,
  );
}
