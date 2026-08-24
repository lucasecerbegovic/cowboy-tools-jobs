/**
 * One rule set, used by the blur handler in the browser and by the server
 * action. Client validation is a convenience; the server call is the one
 * that decides. Keeping both on this module means they cannot drift.
 */

export type Rule = {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  integer?: { min?: number; max?: number };
  oneOf?: readonly string[];
};

export type Schema = Record<string, Rule>;
export type Errors = Record<string, string>;

export function validateField(raw: string, rule: Rule): string | undefined {
  const v = raw.trim();

  if (rule.required && !v) return `${rule.label} is required.`;
  if (!v) return undefined; // optional and empty is valid

  if (rule.minLength && v.length < rule.minLength) {
    return `${rule.label} must be at least ${rule.minLength} characters.`;
  }
  if (rule.maxLength && v.length > rule.maxLength) {
    return `${rule.label} must be ${rule.maxLength} characters or fewer.`;
  }
  if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return 'Enter a valid email address.';
  }
  if (rule.integer) {
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return `${rule.label} must be a whole number.`;
    }
    if (rule.integer.min !== undefined && n < rule.integer.min) {
      return `${rule.label} must be ${rule.integer.min} or more.`;
    }
    if (rule.integer.max !== undefined && n > rule.integer.max) {
      return `${rule.label} must be ${rule.integer.max} or less.`;
    }
  }
  if (rule.oneOf && !rule.oneOf.includes(v)) {
    return `Choose a ${rule.label.toLowerCase()}.`;
  }
  return undefined;
}

export function validateAll(data: Record<string, string>, schema: Schema): Errors {
  const errors: Errors = {};
  for (const [name, rule] of Object.entries(schema)) {
    const msg = validateField(data[name] ?? '', rule);
    if (msg) errors[name] = msg;
  }
  return errors;
}

export function formToRecord(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') out[k] = v;
  return out;
}
