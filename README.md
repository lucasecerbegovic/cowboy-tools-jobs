# Cowboy Tools Jobs

Job board for skilled trades gigs and apprenticeships in Canada. Production: [jobs.cowboytools.ca](https://jobs.cowboytools.ca).

## Local setup

Requires Node 22+. This repo uses pnpm.

```bash
cp .env.example .env
pnpm install
npx prisma migrate dev --name init
pnpm db:seed
pnpm ingest
pnpm dev
```

The app listens on **http://localhost:8081**.

`pnpm db:seed` does not insert demo listings — it removes leftover invented shops from earlier seeds. Load Canadian jobs with `pnpm ingest` (Job Bank fixture CSV; Adzuna skips unless API keys are set).

Listing rows show a logo when we have one: a mark on file, an Adzuna company image, or a .gc.ca favicon. Missing logos use a trade icon. The employer directory is parked (`/employers` redirects to `/jobs`). Set `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY` to resolve logos for other real companies by domain or name.

## Ingest (legal sources only)

```bash
pnpm ingest                 # fixture Job Bank CSV + skip APIs without keys
pnpm ingest:job-bank        # uses data/job-bank-fixture.csv
pnpm ingest:job-bank:west   # live August 2026 CSV, Western Canada trades only
pnpm ingest:adzuna          # no-op without ADZUNA_APP_ID / ADZUNA_APP_KEY
```

Live Job Bank CSV (do **not** scrape jobbank.gc.ca). `--west` keeps Manitoba, Saskatchewan, Alberta, British Columbia, Yukon, Northwest Territories, and Nunavut:

```bash
pnpm ingest:job-bank -- --live --west
```

Or set `JOB_BANK_REGIONS=west` (or `BC,AB,SK`) in `.env`. Override the snapshot with `JOB_BANK_CSV_URL` if a newer monthly file is published.

HTTP:

```bash
curl -X POST http://localhost:8081/api/ingest \
  -H "Authorization: Bearer $INGEST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"job_bank","live":true,"west":true}'
```

Sources:

1. **Canada Job Bank monthly open data CSV** — Open Government Licence – Canada. Trades filtered by NOC 72/73/74.
2. **Adzuna API** (Canada) — skipped without keys. Cards show **Jobs by Adzuna**.

We do **not** scrape Indeed, LinkedIn, Glassdoor, or jobbank.gc.ca.

## Database

Prisma + SQLite locally (`DATABASE_URL=file:./dev.db`). Swap to Postgres later by changing the URL and `provider` to `postgresql`.
