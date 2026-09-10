/** Shown when a listing has no real employer. Matches the "Pay not listed" pattern. */
export const UNLISTED_EMPLOYER_NAME = 'Employer not listed';

/** First two letters of the name, ignoring punctuation. "A.B. Mechanical" → "AB". */
export function employerInitials(name: string): string {
  const letters = name.replace(/[^A-Za-z0-9]+/g, '').slice(0, 2).toUpperCase();
  return letters || '—';
}

const PLACEHOLDER_EMPLOYER_NAMES = new Set([
  'no',
  'yes',
  'none',
  'n/a',
  'na',
  'n.a',
  'n.a.',
  'unknown',
  'unknown employer',
  'not specified',
  'not listed',
  'not available',
  'confidential',
  'confidential employer',
  'undisclosed',
  'tbd',
  'null',
  '-',
  '--',
  '—',
  UNLISTED_EMPLOYER_NAME.toLowerCase(),
]);

/**
 * Aggregator labels, empty strings, and junk values like "No" / "N/A".
 * These must not become a shared employer slug — they are not a company.
 */
export function isGenericEmployerName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (/via job bank|via adzuna/i.test(trimmed)) return true;
  const folded = trimmed.toLowerCase().replace(/\.+$/, '');
  if (PLACEHOLDER_EMPLOYER_NAMES.has(folded)) return true;
  if (/^(yes|no(ne)?|n\/a)(\s+(company|employer|name))?$/i.test(trimmed)) {
    return true;
  }
  return false;
}

export function displayEmployerName(name: string): string {
  return isGenericEmployerName(name) ? UNLISTED_EMPLOYER_NAME : name;
}

export function jobLocationLine(city: string, province: string): string {
  return `${city}, ${province}`;
}

/** Location always. Company name only when it is a real shop — never a placeholder. */
export function jobByline(input: {
  employer: string;
  city: string;
  province: string;
}): string {
  const location = jobLocationLine(input.city, input.province);
  if (isGenericEmployerName(input.employer)) return location;
  return `${input.employer} · ${location}`;
}

export function jobDocumentTitle(input: {
  title: string;
  employer: string;
  city: string;
  province: string;
}): string {
  return `${input.title} — ${jobByline(input)}`;
}

const PUBLIC_MAIL_HOSTS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'aol.com',
  'msn.com',
  'proton.me',
  'protonmail.com',
]);

const SKIP_TLDS = new Set(['example', 'test', 'invalid', 'localhost']);

const AGGREGATOR_HOSTS = new Set([
  'adzuna.com',
  'adzuna.ca',
  'adzuna.co.uk',
  'jobbank.gc.ca',
  'indeed.com',
  'linkedin.com',
  'glassdoor.com',
  'ziprecruiter.com',
  'simplyhired.com',
  'monster.com',
  'careerbuilder.com',
]);

const SEED_LOGO_SLUGS = new Set([
  'northline-electric',
  'bow-valley-mechanical',
  'chinook-climate',
  'prairie-steel-fabrication',
  'foothills-earthworks',
  'ridgeline-interiors',
  'cascade-industrial-services',
  'northline-mechanical',
]);

export function seedLogoPath(slug: string | null | undefined): string | undefined {
  if (!slug || !SEED_LOGO_SLUGS.has(slug)) return undefined;
  return `/employer-logos/${slug}.svg`;
}

function hostnameOf(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return host || null;
  } catch {
    return null;
  }
}

function isSkippedTld(domain: string): boolean {
  const tld = domain.split('.').at(-1) ?? '';
  return SKIP_TLDS.has(tld);
}

function registrableHost(host: string): string {
  return host.replace(/^www\./, '').toLowerCase();
}

export function websiteFromEmail(email: string | null | undefined): string | null {
  if (!email || !email.includes('@')) return null;
  const host = email.split('@')[1]?.trim().toLowerCase();
  if (!host || PUBLIC_MAIL_HOSTS.has(host) || isSkippedTld(host)) return null;
  return `https://${host}`;
}

export function websiteFromApplyUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const host = hostnameOf(url);
  if (!host) return null;
  if (AGGREGATOR_HOSTS.has(host) || AGGREGATOR_HOSTS.has(registrableHost(host))) {
    return null;
  }
  if (isSkippedTld(host)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

/** Same-origin path or https URL. Rejects javascript: and protocol-relative. */
export function isSafeLogoUrl(url: string): boolean {
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

function safeWebsite(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    if (isSkippedTld(parsed.hostname)) return null;
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

function isGovDomain(domain: string): boolean {
  return /\.gc\.ca$/i.test(domain);
}

function logoDevToken(): string | undefined {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY?.trim();
  return token || undefined;
}

function logoSrcForWebsite(website: string, domain: string, size: number): string {
  const token = logoDevToken();
  if (token) {
    return `https://img.logo.dev/${domain}?token=${encodeURIComponent(token)}&size=${size}&format=png&fallback=404`;
  }
  return `${website.replace(/\/$/, '')}/favicon.ico`;
}

function logoSrcForName(name: string, size: number): string | undefined {
  const token = logoDevToken();
  if (!token || isGenericEmployerName(name)) return undefined;
  return `https://img.logo.dev/name/${encodeURIComponent(name)}?token=${encodeURIComponent(token)}&size=${size}&format=png&fallback=404`;
}

export function inferEmployerBranding(input: {
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  applyUrl?: string | null;
  applyEmail?: string | null;
}): { website: string | null; logoUrl: string | null } {
  const website =
    safeWebsite(input.website) ??
    websiteFromEmail(input.applyEmail) ??
    websiteFromApplyUrl(input.applyUrl) ??
    null;
  const logoUrl =
    input.logoUrl && isSafeLogoUrl(input.logoUrl) ? input.logoUrl : null;
  return { website, logoUrl };
}

/**
 * URL to render in the logo box, or undefined to keep the trade mark.
 * Without a Logo.dev key, .gc.ca sites use their official favicon — we do
 * not guess logos for unknown contractors (wrong marks are worse than a trade icon).
 */
export function resolveEmployerLogo(
  input: {
    name: string;
    slug?: string | null;
    logoUrl?: string | null;
    website?: string | null;
  },
  size = 128,
): string | undefined {
  if (input.logoUrl && isSafeLogoUrl(input.logoUrl)) return input.logoUrl;

  const seed = seedLogoPath(input.slug);
  if (seed) return seed;

  const website = safeWebsite(input.website);
  const domain = website ? hostnameOf(website) : null;
  if (website && domain) {
    if (logoDevToken() || isGovDomain(domain)) {
      return logoSrcForWebsite(website, domain, size);
    }
  }

  return logoSrcForName(input.name, size);
}
