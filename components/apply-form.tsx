'use client';

import { useActionState } from 'react';
import { Button, ButtonLink } from '@/components/button';
import {
  ErrorSummary,
  Fieldset,
  TextArea,
  TextField,
} from '@/components/form/fields';
import { monoUi, muted } from '@/lib/brand-type';
import { applyToJob } from '@/lib/actions';
import { EMPTY_STATE } from '@/lib/form-state';
import { APPLY_SCHEMA } from '@/lib/schemas';

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, action, pending] = useActionState(applyToJob, EMPTY_STATE);
  const s = APPLY_SCHEMA;
  const v = state.values;
  const e = state.errors;

  if (state.status === 'success') {
    return (
      <div className="mx-auto flex max-w-[480px] flex-col items-center border border-ink px-8 py-12 text-center">
        <p className={monoUi}>Application sent</p>
        <p className={`mt-4 text-body ${muted}`}>
          Your application for {jobTitle} is with the employer. A copy went to{' '}
          {v.email}.
        </p>
        <ButtonLink href="/jobs" className="mt-8">
          Back to jobs
        </ButtonLink>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-10">
      <input type="hidden" name="jobId" value={jobId} />
      <ErrorSummary errors={e} />

      <Fieldset legend="Your details">
        <TextField
          name="name"
          label="Full name"
          rule={s.name}
          serverError={e.name}
          defaultValue={v.name}
          placeholder="Sam Delaney"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            name="email"
            label="Email"
            type="email"
            rule={s.email}
            serverError={e.email}
            defaultValue={v.email}
            placeholder="you@example.ca"
          />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            rule={s.phone}
            serverError={e.phone}
            defaultValue={v.phone}
            placeholder="(403) 555-0142"
          />
        </div>
        <TextField
          name="ticket"
          label="Ticket or certification"
          rule={s.ticket}
          serverError={e.ticket}
          defaultValue={v.ticket}
          placeholder="Red Seal — Construction Electrician"
          help="Optional, but employers filter on it."
        />
      </Fieldset>

      <Fieldset legend="Message">
        <TextArea
          name="message"
          label="Message to the employer"
          rule={s.message}
          serverError={e.message}
          defaultValue={v.message}
          placeholder="Availability, relevant sites you have worked, anything else worth knowing."
          help="Optional. Keep it short — most employers skim."
        />
      </Fieldset>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Sending…' : 'Send application'}
        </Button>
        <ButtonLink href={`/jobs/${jobId}`} variant="bare" size="sm">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
