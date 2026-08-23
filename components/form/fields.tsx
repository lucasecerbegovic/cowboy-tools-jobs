'use client';

import { useId, useState } from 'react';
import { ChevronDown, Check } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { validateField, type Rule } from '@/lib/validate';

/* Field chrome. 48px, 1px ink, radius 0, hard inset focus — no glow. */
const CONTROL =
  'w-full bg-surface px-4 text-field outline-none placeholder:text-muted ' +
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink';

function borderFor(error?: string) {
  return error ? 'border border-urgent' : 'border border-ink';
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={`${monoUi} mb-2 block`}>
      {children}
      {required && (
        <span className="text-urgent" aria-hidden>
          {' '}
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  );
}

function Messages({
  helpId,
  errorId,
  help,
  error,
}: {
  helpId: string;
  errorId: string;
  help?: string;
  error?: string;
}) {
  /* Never colour alone — an error is always accompanied by text. */
  if (error) {
    return (
      <p id={errorId} className="mt-1.5 text-help text-urgent" role="alert">
        {error}
      </p>
    );
  }
  if (help) {
    return (
      <p id={helpId} className={`mt-1.5 text-help ${muted}`}>
        {help}
      </p>
    );
  }
  return null;
}

/** Errors surface on blur, never on keystroke — then clear live as they fix it. */
function useBlurValidation(rule: Rule | undefined, serverError?: string) {
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);
  const error = touched ? localError : serverError;

  const handlers = {
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!rule) return;
      setTouched(true);
      setLocalError(validateField(e.target.value, rule));
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!rule || !touched) return;
      setLocalError(validateField(e.target.value, rule));
    },
  };

  return { error, handlers };
}

type Common = {
  name: string;
  label: string;
  rule?: Rule;
  help?: string;
  serverError?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function TextField({
  name,
  label,
  rule,
  help,
  serverError,
  defaultValue,
  placeholder,
  type = 'text',
}: Common & { type?: string }) {
  const id = useId();
  const { error, handlers } = useBlurValidation(rule, serverError);

  return (
    <div>
      <Label htmlFor={id} required={rule?.required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
        className={`${CONTROL} h-[var(--field-h)] ${borderFor(error)}`}
        {...handlers}
      />
      <Messages helpId={`${id}-help`} errorId={`${id}-err`} help={help} error={error} />
    </div>
  );
}

export function TextArea({
  name,
  label,
  rule,
  help,
  serverError,
  defaultValue,
  placeholder,
}: Common) {
  const id = useId();
  const { error, handlers } = useBlurValidation(rule, serverError);

  return (
    <div>
      <Label htmlFor={id} required={rule?.required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={5}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
        className={`${CONTROL} min-h-[120px] resize-y py-3 ${borderFor(error)}`}
        {...handlers}
      />
      <Messages helpId={`${id}-help`} errorId={`${id}-err`} help={help} error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  rule,
  help,
  serverError,
  defaultValue,
  options,
  placeholder = 'Choose one',
}: Common & { options: { value: string; label: string }[] }) {
  const id = useId();
  const { error, handlers } = useBlurValidation(rule, serverError);

  return (
    <div>
      <Label htmlFor={id} required={rule?.required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          name={name}
          defaultValue={defaultValue ?? ''}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
          className={`${CONTROL} h-[var(--field-h)] appearance-none pr-11 ${borderFor(error)}`}
          {...handlers}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </div>
      <Messages helpId={`${id}-help`} errorId={`${id}-err`} help={help} error={error} />
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  help,
  defaultChecked,
}: {
  name: string;
  label: string;
  help?: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  return (
    <div>
      {/* The styled box must be a direct sibling of the input — peer-checked:
          compiles to `~`, which cannot reach a nested element. */}
      <label
        htmlFor={id}
        className="flex min-h-[var(--tap-min)] cursor-pointer items-center gap-3"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          value="1"
          defaultChecked={defaultChecked}
          className="peer sr-only"
          aria-describedby={help ? `${id}-help` : undefined}
        />
        <span
          aria-hidden
          className="flex h-5 w-5 shrink-0 items-center justify-center border border-ink bg-surface text-transparent peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
        >
          <Check size={12} />
        </span>
        <span className="text-body-sm">{label}</span>
      </label>
      {help && (
        <p id={`${id}-help`} className={`ml-8 text-help ${muted}`}>
          {help}
        </p>
      )}
    </div>
  );
}

export function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className={`${monoUi} mb-5 w-full border-b border-ink pb-3`}>
        {legend}
      </legend>
      <div className="flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

/** Summary of server-side errors, focusable and announced after a failed submit. */
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return (
    <div
      role="alert"
      tabIndex={-1}
      className="border border-urgent px-5 py-4 text-urgent"
    >
      <p className={mono.label}>
        {entries.length} {entries.length === 1 ? 'problem' : 'problems'} to fix
      </p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {entries.map(([k, v]) => (
          <li key={k} className="text-help">
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
