import type { ReactElement } from 'react';
import { ImageResponse } from 'next/og';
import type { Job } from '@/lib/jobs';
import { jobOgCopy, OG_SIZE, siteOgCopy } from '@/lib/og/copy';
import { JobOgCard, SiteOgCard } from '@/lib/og/frame';
import { loadOgFonts, loadOgLogoDataUri } from '@/lib/og/load-fonts';

export async function renderOgImage(element: ReactElement) {
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts: await loadOgFonts(),
  });
}

export async function renderSiteOgImage() {
  const copy = siteOgCopy();
  const logoUrl = await loadOgLogoDataUri();
  return renderOgImage(
    <SiteOgCard
      logoUrl={logoUrl}
      eyebrow={copy.eyebrow}
      headline={copy.headline}
      subhead={copy.subhead}
      cells={copy.cells}
    />,
  );
}

export async function renderJobOgImage(job: Job) {
  const copy = jobOgCopy(job);
  const logoUrl = await loadOgLogoDataUri();
  return renderOgImage(
    <JobOgCard
      logoUrl={logoUrl}
      headline={copy.headline}
      employer={copy.employer}
      pay={copy.pay}
      cells={copy.cells}
    />,
  );
}
