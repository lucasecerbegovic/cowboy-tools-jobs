import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES, COUNTRY_LABELS, TRADE_LABELS, TRADE_SLUGS } from "@/lib/trades";
import type { JobFilters } from "@/lib/jobs";

export function SearchForm({
  filters,
  action = "/jobs",
}: {
  filters?: JobFilters;
  action?: string;
}) {
  return (
    <form
      action={action}
      method="get"
      className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-[1fr_180px_160px_auto]"
    >
      <Input
        name="q"
        placeholder="Trade, employer, or keyword"
        defaultValue={filters?.q ?? ""}
        aria-label="Keyword"
      />
      <select
        name="country"
        defaultValue={filters?.country ?? ""}
        aria-label="Country"
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
      >
        <option value="">Canada & US</option>
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {COUNTRY_LABELS[country]}
          </option>
        ))}
      </select>
      <Input
        name="location"
        placeholder="City or region"
        defaultValue={filters?.location ?? ""}
        aria-label="Location"
      />
      <Button type="submit" size="lg" className="h-8">
        Search jobs
      </Button>
      <input type="hidden" name="trade" value={filters?.trade ?? ""} />
      {filters?.apprenticeship ? (
        <input type="hidden" name="apprenticeship" value="1" />
      ) : null}
      <div className="md:col-span-4">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Trade
        </p>
        <div className="flex flex-wrap gap-2">
          {TRADE_SLUGS.map((slug) => {
            const active = filters?.trade === slug;
            const params = new URLSearchParams();
            if (filters?.q) params.set("q", filters.q);
            if (filters?.country) params.set("country", filters.country);
            if (filters?.location) params.set("location", filters.location);
            if (filters?.apprenticeship) params.set("apprenticeship", "1");
            if (!active) params.set("trade", slug);
            const href = `${action}?${params.toString()}`;
            return (
              <Link
                key={slug}
                href={href}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {TRADE_LABELS[slug]}
              </Link>
            );
          })}
        </div>
      </div>
    </form>
  );
}
