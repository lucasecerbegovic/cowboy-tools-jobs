'use server';

import type { FormState } from '@/lib/form-state';
import { APPLY_SCHEMA, POST_JOB_SCHEMA } from '@/lib/schemas';
import { formToRecord, validateAll, type Errors } from '@/lib/validate';

/** Cross-field rule the per-field schema cannot express. */
function payRangeError(data: Record<string, string>): Errors {
  const min = Number(data.payMin);
  const max = Number(data.payMax);
  if (data.payMin && data.payMax && Number.isFinite(min) && Number.isFinite(max)) {
    if (min > max) {
      return { payMax: 'Maximum pay must be greater than minimum pay.' };
    }
  }
  return {};
}

export async function postJob(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formToRecord(formData);
  const errors = { ...validateAll(values, POST_JOB_SCHEMA), ...payRangeError(values) };

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, values };
  }

  // No persistence layer yet — the insert goes here.
  return { status: 'success', errors: {}, values };
}

export async function applyToJob(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formToRecord(formData);
  const errors = validateAll(values, APPLY_SCHEMA);

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, values };
  }

  // No persistence layer yet — the application record goes here.
  return { status: 'success', errors: {}, values };
}
