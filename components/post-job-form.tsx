'use client';

import { useActionState } from 'react';
import { Button, ButtonLink } from '@/components/button';
import {
  CheckboxField,
  ErrorSummary,
  Fieldset,
  SelectField,
  TextArea,
  TextField,
} from '@/components/form/fields';
import { monoUi, muted } from '@/lib/brand-type';
import { postJob } from '@/lib/actions';
import { EMPTY_STATE } from '@/lib/form-state';
import {
  POST_JOB_SCHEMA,
  PROVINCE_OPTIONS,
  TRADE_OPTIONS,
  TYPE_OPTIONS,
} from '@/lib/schemas';

export function PostJobForm() {
  const [state, action, pending] = useActionState(postJob, EMPTY_STATE);
  const s = POST_JOB_SCHEMA;
  const v = state.values;
  const e = state.errors;

  if (state.status === 'success') {
    return (
      <div className="mx-auto flex max-w-[480px] flex-col items-center border border-ink px-8 py-12 text-center">
        <p className={monoUi}>Posting submitted</p>
        <p className={`mt-4 text-body ${muted}`}>
          “{v.title}” at {v.employer} is live on the board. Applications go to{' '}
          {v.contactEmail}.
        </p>
        <ButtonLink href="/jobs" className="mt-8">
          Back to jobs
        </ButtonLink>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-10">
      <ErrorSummary errors={e} />

      <Fieldset legend="The role">
        <TextField
          name="title"
          label="Job title"
          rule={s.title}
          serverError={e.title}
          defaultValue={v.title}
          placeholder="Journeyman Electrician"
        />
        <TextField
          name="employer"
          label="Company name"
          rule={s.employer}
          serverError={e.employer}
          defaultValue={v.employer}
          placeholder="Northline Electric"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            name="trade"
            label="Trade"
            rule={s.trade}
            serverError={e.trade}
            defaultValue={v.trade}
            options={TRADE_OPTIONS}
          />
          <SelectField
            name="type"
            label="Employment type"
            rule={s.type}
            serverError={e.type}
            defaultValue={v.type}
            options={TYPE_OPTIONS}
          />
        </div>
      </Fieldset>

      <Fieldset legend="Location">
        <div className="grid gap-6 sm:grid-cols-[1fr_140px]">
          <TextField
            name="city"
            label="City"
            rule={s.city}
            serverError={e.city}
            defaultValue={v.city}
            placeholder="Calgary"
          />
          <SelectField
            name="province"
            label="Province"
            rule={s.province}
            serverError={e.province}
            defaultValue={v.province}
            options={PROVINCE_OPTIONS}
            placeholder="—"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Pay and experience">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            name="payMin"
            label="Minimum pay"
            type="number"
            rule={s.payMin}
            serverError={e.payMin}
            defaultValue={v.payMin}
            placeholder="38"
            help="Hourly, in dollars."
          />
          <TextField
            name="payMax"
            label="Maximum pay"
            type="number"
            rule={s.payMax}
            serverError={e.payMax}
            defaultValue={v.payMax}
            placeholder="46"
            help="Listings with pay get materially more applicants."
          />
        </div>
        <TextField
          name="experience"
          label="Experience required"
          rule={s.experience}
          serverError={e.experience}
          defaultValue={v.experience}
          placeholder="4+ years post-ticket"
        />
        <CheckboxField
          name="union"
          label="This is a union position"
          defaultChecked={v.union === '1'}
        />
      </Fieldset>

      <Fieldset legend="Description">
        <TextArea
          name="summary"
          label="About the role"
          rule={s.summary}
          serverError={e.summary}
          defaultValue={v.summary}
          placeholder="Commercial and light industrial service work across the region."
          help="At least 40 characters."
        />
        <TextArea
          name="responsibilities"
          label="Responsibilities"
          rule={s.responsibilities}
          serverError={e.responsibilities}
          defaultValue={v.responsibilities}
          placeholder="One per line."
          help="One per line."
        />
      </Fieldset>

      <Fieldset legend="Contact">
        <TextField
          name="contactEmail"
          label="Contact email"
          type="email"
          rule={s.contactEmail}
          serverError={e.contactEmail}
          defaultValue={v.contactEmail}
          placeholder="hiring@company.ca"
          help="Applications are forwarded here. Not shown on the listing."
        />
      </Fieldset>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Submitting…' : 'Submit posting'}
        </Button>
        <ButtonLink href="/jobs" variant="bare" size="sm">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
