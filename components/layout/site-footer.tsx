import Link from "next/link";
import { JOB_BANK_DATASET_URL } from "@/lib/ingest/job-bank";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground md:flex-row md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-medium text-foreground">Tradesboard</p>
          <p>
            Live gigs and apprenticeships for skilled trades in Canada and the
            United States. Public listings do not require an account.
          </p>
        </div>
        <div className="max-w-xl space-y-2">
          <p className="font-medium text-foreground">Data attribution</p>
          <p>
            Job Bank records contain information licensed under the{" "}
            <a
              className="underline underline-offset-2 hover:text-foreground"
              href="https://open.canada.ca/en/open-government-licence-canada"
            >
              Open Government Licence – Canada
            </a>
            . Source: Employment and Social Development Canada,{" "}
            <a
              className="underline underline-offset-2 hover:text-foreground"
              href={JOB_BANK_DATASET_URL}
            >
              Job Postings Advertised on Canada’s National Job Bank Website
            </a>
            . We do not scrape jobbank.gc.ca.
          </p>
          <p>
            Aggregated Adzuna listings are labelled “Jobs by Adzuna” as required
            by the Adzuna API terms.
          </p>
          <p>
            <Link className="underline underline-offset-2 hover:text-foreground" href="/about">
              About sources
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
