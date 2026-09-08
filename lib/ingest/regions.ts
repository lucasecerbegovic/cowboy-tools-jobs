export const CANADIAN_REGION_CODES = [
  'BC',
  'AB',
  'SK',
  'MB',
  'ON',
  'QC',
  'NB',
  'NS',
  'PE',
  'NL',
  'YT',
  'NT',
  'NU',
] as const;

export type CanadianRegionCode = (typeof CANADIAN_REGION_CODES)[number];

/** Manitoba through BC, plus the territories. */
export const WESTERN_CANADA_CODES: readonly CanadianRegionCode[] = [
  'MB',
  'SK',
  'AB',
  'BC',
  'YT',
  'NT',
  'NU',
];

const REGION_ALIASES: Record<string, CanadianRegionCode> = {
  bc: 'BC',
  'british columbia': 'BC',
  ab: 'AB',
  alberta: 'AB',
  sk: 'SK',
  saskatchewan: 'SK',
  mb: 'MB',
  manitoba: 'MB',
  on: 'ON',
  ontario: 'ON',
  qc: 'QC',
  quebec: 'QC',
  nb: 'NB',
  'new brunswick': 'NB',
  ns: 'NS',
  'nova scotia': 'NS',
  pe: 'PE',
  pei: 'PE',
  'prince edward island': 'PE',
  nl: 'NL',
  newfoundland: 'NL',
  'newfoundland and labrador': 'NL',
  yt: 'YT',
  yukon: 'YT',
  'yukon territory': 'YT',
  nt: 'NT',
  nwt: 'NT',
  'northwest territories': 'NT',
  nu: 'NU',
  nunavut: 'NU',
};

export type RegionFilter = 'west' | CanadianRegionCode[];

function normalizeRegionKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ');
}

export function canadianRegionCode(value: string): CanadianRegionCode | null {
  const key = normalizeRegionKey(value);
  if (!key) return null;
  return REGION_ALIASES[key] ?? null;
}

export function isWesternCanada(value: string): boolean {
  const code = canadianRegionCode(value);
  return code != null && WESTERN_CANADA_CODES.includes(code);
}

export const CANADIAN_REGION_LABELS: Record<CanadianRegionCode, string> = {
  BC: 'British Columbia',
  AB: 'Alberta',
  SK: 'Saskatchewan',
  MB: 'Manitoba',
  ON: 'Ontario',
  QC: 'Quebec',
  NB: 'New Brunswick',
  NS: 'Nova Scotia',
  PE: 'Prince Edward Island',
  NL: 'Newfoundland and Labrador',
  YT: 'Yukon',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
};

export function locationSearchText(
  city: string,
  province: string,
  country: string,
): string {
  const code = canadianRegionCode(province);
  const parts = [city, province, country];
  if (code) {
    parts.push(code, CANADIAN_REGION_LABELS[code]);
    switch (code) {
      case 'NT':
        parts.push('NWT');
        break;
      case 'PE':
        parts.push('PEI');
        break;
      case 'YT':
        parts.push('Yukon Territory');
        break;
      case 'BC':
      case 'AB':
      case 'SK':
      case 'MB':
      case 'ON':
      case 'QC':
      case 'NB':
      case 'NS':
      case 'NL':
      case 'NU':
        break;
      default: {
        const exhaustive: never = code;
        return exhaustive;
      }
    }
    if (WESTERN_CANADA_CODES.includes(code)) {
      parts.push('west', 'western canada');
    }
  }
  return parts.filter(Boolean).join(' ').toLowerCase();
}

export function locationMatches(
  city: string,
  province: string,
  country: string,
  loc: string,
): boolean {
  const needle = loc.trim().toLowerCase();
  if (!needle) return true;
  const hay = locationSearchText(city, province, country);
  const tokens = hay.split(/[^a-z0-9]+/).filter(Boolean);
  if (needle.length <= 3) {
    return tokens.includes(needle);
  }
  return hay.includes(needle);
}

export function parseRegionFilter(value?: string | null): RegionFilter | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === 'west' || trimmed.toLowerCase() === 'western') {
    return 'west';
  }
  const codes = trimmed
    .split(/[,|]/)
    .map((part) => canadianRegionCode(part))
    .filter((code): code is CanadianRegionCode => code != null);
  return codes.length ? codes : undefined;
}

export function resolveRegionFilter(options?: {
  regions?: RegionFilter;
  west?: boolean;
}): RegionFilter | undefined {
  if (options?.west) return 'west';
  if (options?.regions) return options.regions;
  return parseRegionFilter(process.env.JOB_BANK_REGIONS);
}

export function matchesRegionFilter(
  region: string,
  filter?: RegionFilter,
): boolean {
  if (!filter) return true;
  if (!region) return false;
  if (filter === 'west') return isWesternCanada(region);
  const code = canadianRegionCode(region);
  return code != null && filter.includes(code);
}
