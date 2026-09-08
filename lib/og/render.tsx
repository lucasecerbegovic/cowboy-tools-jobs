import type { ReactElement } from 'react';
import { ImageResponse } from 'next/og';
import { OG_SIZE } from '@/lib/og/copy';
import { loadOgFonts } from '@/lib/og/load-fonts';

export async function renderOgImage(element: ReactElement) {
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts: await loadOgFonts(),
  });
}
