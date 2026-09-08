/**
 * Canonical site identity for <title>, Open Graph, and Twitter cards.
 * metadataBase must be absolute so crawlers accept og:image.
 */
export const SITE_NAME = 'Cowboy Tools Jobs';
export const SITE_DESCRIPTION = 'Jobs and employers in the skilled trades in Canada.';
export const SITE_TAGLINE = 'Work in the trades';

export function normalizeSiteUrl(value: string): URL {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed);
  if (trimmed.startsWith('localhost') || trimmed.startsWith('127.')) {
    return new URL(`http://${trimmed}`);
  }
  return new URL(`https://${trimmed}`);
}

export function getMetadataBase(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return normalizeSiteUrl(fromEnv);

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (vercel) return normalizeSiteUrl(vercel);

  return new URL('http://localhost:8081');
}
