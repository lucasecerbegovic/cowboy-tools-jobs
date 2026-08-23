import { TRADE_LABELS, TYPE_LABELS } from '@/lib/jobs';
import type { Schema } from '@/lib/validate';

export const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
] as const;

export const TRADE_OPTIONS = (
  Object.keys(TRADE_LABELS) as (keyof typeof TRADE_LABELS)[]
).map((v) => ({ value: v, label: TRADE_LABELS[v] }));

export const TYPE_OPTIONS = (
  Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[]
).map((v) => ({ value: v, label: TYPE_LABELS[v] }));

export const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p, label: p }));

export const POST_JOB_SCHEMA: Schema = {
  title: { label: 'Job title', required: true, minLength: 4, maxLength: 80 },
  employer: { label: 'Company name', required: true, maxLength: 80 },
  trade: { label: 'Trade', required: true, oneOf: TRADE_OPTIONS.map((o) => o.value) },
  type: {
    label: 'Employment type',
    required: true,
    oneOf: TYPE_OPTIONS.map((o) => o.value),
  },
  city: { label: 'City', required: true, maxLength: 60 },
  province: { label: 'Province', required: true, oneOf: PROVINCES },
  payMin: { label: 'Minimum pay', integer: { min: 0, max: 500 } },
  payMax: { label: 'Maximum pay', integer: { min: 0, max: 500 } },
  experience: { label: 'Experience required', maxLength: 80 },
  summary: { label: 'About the role', required: true, minLength: 40, maxLength: 600 },
  responsibilities: {
    label: 'Responsibilities',
    required: true,
    minLength: 20,
    maxLength: 900,
  },
  contactEmail: { label: 'Contact email', required: true, email: true },
};

export const APPLY_SCHEMA: Schema = {
  name: { label: 'Full name', required: true, minLength: 2, maxLength: 80 },
  email: { label: 'Email', required: true, email: true },
  phone: { label: 'Phone', maxLength: 24 },
  ticket: { label: 'Ticket or certification', maxLength: 80 },
  message: { label: 'Message', maxLength: 1000 },
};
