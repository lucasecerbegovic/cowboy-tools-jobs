import type { Errors } from '@/lib/validate';

/** Shared shape for useActionState. Kept out of the 'use server' module,
 *  which may only export async functions. */
export type FormState = {
  status: 'idle' | 'error' | 'success';
  errors: Errors;
  values: Record<string, string>;
};

export const EMPTY_STATE: FormState = { status: 'idle', errors: {}, values: {} };
