import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Geist latin subsets for ImageResponse (Satori).
 * SIL Open Font License 1.1 — https://github.com/vercel/geist-font
 * Files: Fontsource 5.3.0 latin WOFF (Satori does not read WOFF2).
 *
 * Read from disk — Next.js rewrites `new URL(..., import.meta.url)` to a
 * relative `/_next/static/media` path that Node `fetch` cannot load.
 */
const FONT_DIR = join(process.cwd(), 'lib/og/fonts');

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600;
  style: 'normal';
};

let cachedFonts: OgFont[] | undefined;

export async function loadOgFonts(): Promise<OgFont[]> {
  if (cachedFonts) return cachedFonts;

  const [sans400, sans600, mono400, mono500] = await Promise.all([
    readFile(join(FONT_DIR, 'geist-sans-400.woff')),
    readFile(join(FONT_DIR, 'geist-sans-600.woff')),
    readFile(join(FONT_DIR, 'geist-mono-400.woff')),
    readFile(join(FONT_DIR, 'geist-mono-500.woff')),
  ]);

  cachedFonts = [
    { name: 'Geist', data: sans400, weight: 400, style: 'normal' },
    { name: 'Geist', data: sans600, weight: 600, style: 'normal' },
    { name: 'Geist Mono', data: mono400, weight: 400, style: 'normal' },
    { name: 'Geist Mono', data: mono500, weight: 500, style: 'normal' },
  ];
  return cachedFonts;
}

const LOGO_PATH = join(process.cwd(), 'public/cowboy-tools-logo-full.png');

let cachedLogoDataUri: string | undefined;

export async function loadOgLogoDataUri(): Promise<string> {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  const buf = await readFile(LOGO_PATH);
  cachedLogoDataUri = `data:image/png;base64,${buf.toString('base64')}`;
  return cachedLogoDataUri;
}
