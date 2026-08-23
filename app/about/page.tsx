import type { Metadata } from "next";
import { JOB_BANK_DATASET_URL } from "@/lib/ingest/job-bank";

export const metadata: Metadata = { title: "About sources" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About sources</h1>
      <p className="text-muted-foreground">
        Tradesboard only ingests from legal, documented feeds. We do not scrape
        Indeed, LinkedIn, Glassdoor, apprenticeship.gov, or jobbank.gc.ca HTML.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Canada Job Bank open data</h2>
        <p>
          Monthly CSV published by Employment and Social Development Canada
          under the Open Government Licence – Canada. Dataset:{" "}
          <a className="underline" href={JOB_BANK_DATASET_URL}>
            {JOB_BANK_DATASET_URL}
          </a>
          . Local ingest uses <code>data/job-bank-fixture.csv</code> unless you
          pass a live URL.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Adzuna</h2>
        <p>
          Job search API for <code>ca</code> and <code>us</code>. Listings show
          the required “Jobs by Adzuna” attribution. Ingest is skipped when{" "}
          <code>ADZUNA_APP_ID</code> / <code>ADZUNA_APP_KEY</code> are missing.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">USAJOBS</h2>
        <p>
          Official Search API with <code>Authorization-Key</code> and{" "}
          <code>User-Agent</code> headers, filtered to FWS trades series (2805,
          2810, 4204, 4206, 3703, 4607, and related). Skipped without{" "}
          <code>USAJOBS_API_KEY</code>.
        </p>
      </section>
    </div>
  );
}
