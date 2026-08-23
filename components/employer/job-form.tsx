import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES, COUNTRY_LABELS, TRADE_LABELS, TRADE_SLUGS } from "@/lib/trades";

export function JobPostForm({
  action,
  error,
  defaultCompany,
}: {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  defaultCompany?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Field label="Job title" name="title" required />
      <Field
        label="Company"
        name="company"
        required
        defaultValue={defaultCompany}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="trade">Trade</Label>
          <select
            id="trade"
            name="trade"
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {TRADE_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {TRADE_LABELS[slug]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <select
            id="country"
            name="country"
            required
            defaultValue="CA"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {COUNTRY_LABELS[country]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" name="city" required />
        <Field label="Province / state" name="region" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wage min" name="salaryMin" type="number" step="0.01" />
        <Field label="Wage max" name="salaryMax" type="number" step="0.01" />
        <div className="space-y-1.5">
          <Label htmlFor="salaryCurrency">Currency</Label>
          <select
            id="salaryCurrency"
            name="salaryCurrency"
            defaultValue="CAD"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <Field label="Employment type" name="employmentType" placeholder="full-time, contract, seasonal" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isApprenticeship" value="1" className="size-4" />
        Apprenticeship
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Apply URL" name="applyUrl" type="url" placeholder="https://" />
        <Field label="Apply email" name="applyEmail" type="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={8} />
      </div>
      <Button type="submit" size="lg">
        Publish listing
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={step}
      />
    </div>
  );
}
