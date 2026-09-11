/** Words that stay lowercase in the middle of a title. */
const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'into',
  'nor',
  'of',
  'on',
  'or',
  'the',
  'to',
  'vs',
  'via',
  'with',
]);

/** Trades-common acronyms, matched case-insensitively. */
const ACRONYMS = new Set([
  'api',
  'asme',
  'aws',
  'cdl',
  'cnc',
  'epa',
  'fcaw',
  'gmaw',
  'gtaw',
  'h2s',
  'hvac',
  'ibew',
  'ii',
  'iii',
  'iuoe',
  'iv',
  'led',
  'liuna',
  'mig',
  'nccer',
  'nfpa',
  'noc',
  'osha',
  'plc',
  'ppe',
  'smaw',
  'tig',
  'us',
  'usa',
  'whmis',
]);

const WORD = /[A-Za-z0-9]+(?:['\u2019][A-Za-z]+)?/g;

function needsTitleCase(title: string): boolean {
  const letters = title.replace(/[^A-Za-z]/g, '');
  if (!letters) return false;
  const hasUpper = /[A-Z]/.test(letters);
  const hasLower = /[a-z]/.test(letters);
  if (!hasUpper) return true;
  if (!hasLower) {
    if (!/[\s,/-]/.test(title) && letters.length <= 5) return false;
    return true;
  }
  return false;
}

function formatWord(word: string, forceCap: boolean): string {
  const lower = word.toLowerCase();
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  if (/^\d+(st|nd|rd|th)$/i.test(word)) return lower;
  if (!forceCap && SMALL_WORDS.has(lower)) return lower;
  const idx = lower.search(/[a-z]/);
  if (idx === -1) return word;
  return lower.slice(0, idx) + lower.charAt(idx).toUpperCase() + lower.slice(idx + 1);
}

function titleCase(title: string): string {
  const matches = [...title.matchAll(WORD)];
  if (matches.length === 0) return title;

  let result = '';
  let cursor = 0;
  const last = matches.length - 1;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const start = match.index ?? 0;
    const before = title.slice(cursor, start);
    result += before;
    const afterBreak = i === 0 || /[-:[(/]\s*$/.test(result);
    result += formatWord(match[0], afterBreak || i === last);
    cursor = start + match[0].length;
  }

  return result + title.slice(cursor);
}

/**
 * Title-case sloppy ingested titles (all-lowercase or shouty ALL CAPS).
 * Leaves mixed-case titles alone so employer-posted names stay as written.
 */
export function formatJobTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return title;
  if (!needsTitleCase(trimmed)) return trimmed;
  return titleCase(trimmed);
}
