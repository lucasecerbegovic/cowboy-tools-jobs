export const TRADE_SLUGS = [
  "electrician",
  "plumber",
  "carpenter",
  "welder",
  "millwright",
  "hvac",
  "heavy_equipment",
  "other",
] as const;

export type TradeSlug = (typeof TRADE_SLUGS)[number];

export const TRADE_LABELS: Record<TradeSlug, string> = {
  electrician: "Electrician",
  plumber: "Plumber / pipefitter",
  carpenter: "Carpenter",
  welder: "Welder",
  millwright: "Millwright",
  hvac: "HVAC / refrigeration",
  heavy_equipment: "Heavy equipment",
  other: "Other trades",
};

export const COUNTRIES = ["CA", "US"] as const;
export type CountryCode = (typeof COUNTRIES)[number];

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  CA: "Canada",
  US: "United States",
};

/** NOC 2021 (and overlapping 2016) codes called out in product scope. */
export const FEATURED_NOC_CODES = [
  "72200",
  "72300",
  "72310",
  "72106",
  "72400",
  "73200",
  "73400",
] as const;

const NOC_PREFIX_TO_TRADE: Array<{ prefix: string; trade: TradeSlug }> = [
  { prefix: "7220", trade: "electrician" },
  { prefix: "722", trade: "electrician" },
  { prefix: "72300", trade: "plumber" },
  { prefix: "72301", trade: "plumber" },
  { prefix: "72302", trade: "plumber" },
  { prefix: "7231", trade: "carpenter" },
  { prefix: "72106", trade: "welder" },
  { prefix: "7210", trade: "welder" },
  { prefix: "72400", trade: "millwright" },
  { prefix: "72401", trade: "heavy_equipment" },
  { prefix: "72402", trade: "hvac" },
  { prefix: "7242", trade: "hvac" },
  { prefix: "73200", trade: "hvac" },
  { prefix: "73400", trade: "heavy_equipment" },
  { prefix: "7340", trade: "heavy_equipment" },
];

const KEYWORD_TO_TRADE: Array<{ pattern: RegExp; trade: TradeSlug }> = [
  { pattern: /\belectrician|\belectrical\b/i, trade: "electrician" },
  { pattern: /\bplumb|\bpipefit|\bsprinkler|\bsteamfit/i, trade: "plumber" },
  { pattern: /\bcarpenter|\bcarpentry|\bframer\b/i, trade: "carpenter" },
  { pattern: /\bwelder|\bwelding|\bfabricat/i, trade: "welder" },
  { pattern: /\bmillwright|\bindustrial mechanic/i, trade: "millwright" },
  {
    pattern: /\bhvac|\brefrigerat|\bair conditioning|\bheat(?:ing)? (?:and|&) cool/i,
    trade: "hvac",
  },
  {
    pattern: /\bheavy equipment|\bexcavator|\bbackhoe|\bcrane operator/i,
    trade: "heavy_equipment",
  },
];

const APPRENTICE_PATTERN =
  /\bapprentice|\bapprenticeship|\bpre-?apprentice|\bjourneyman.?in.?training|\bjit\b/i;

export function normalizeNoc(code: string | null | undefined): string | null {
  if (!code) return null;
  const digits = code.replace(/\D/g, "");
  if (!digits) return null;
  return digits.padStart(5, "0").slice(0, 5);
}

export function isTradesNoc(code: string | null | undefined): boolean {
  const noc = normalizeNoc(code);
  if (!noc) return false;
  return noc.startsWith("72") || noc.startsWith("73") || noc.startsWith("74");
}

export function tradeFromNoc(code: string | null | undefined): TradeSlug {
  const noc = normalizeNoc(code);
  if (!noc) return "other";
  for (const { prefix, trade } of NOC_PREFIX_TO_TRADE) {
    if (noc.startsWith(prefix)) return trade;
  }
  if (isTradesNoc(noc)) return "other";
  return "other";
}

export function tradeFromText(...parts: Array<string | null | undefined>): TradeSlug {
  const haystack = parts.filter(Boolean).join(" ");
  for (const { pattern, trade } of KEYWORD_TO_TRADE) {
    if (pattern.test(haystack)) return trade;
  }
  return "other";
}

export function detectApprenticeship(
  ...parts: Array<string | null | undefined>
): boolean {
  return APPRENTICE_PATTERN.test(parts.filter(Boolean).join(" "));
}

export function isTradeSlug(value: string | null | undefined): value is TradeSlug {
  return TRADE_SLUGS.includes(value as TradeSlug);
}

export function isCountryCode(
  value: string | null | undefined,
): value is CountryCode {
  return COUNTRIES.includes(value as CountryCode);
}

export function tradeLabel(slug: string): string {
  if (isTradeSlug(slug)) return TRADE_LABELS[slug];
  return slug;
}
