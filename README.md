# Tradesboard

Live job board for skilled trades gigs and apprenticeships in **Canada** and the **United States**. Search is public. Employers can sign in locally and post native listings.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- Prisma + **SQLite** for local/dev (no hosted database required)
- Ingest modules for Job Bank open data, Adzuna, and USAJOBS

## Local setup

Requires Node 22+ and npm.

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

The app listens on **http://localhost:8081**.

### Dev employer login

- Email: `employer@tradesboard.dev`
- Password: `tradesboard`

Seed data includes ~20 realistic CA/US trades jobs (mix of employer, Job Bank, Adzuna, and USAJOBS sources, plus apprenticeships).

## Search

Open `/` or `/jobs` and filter by:

- Keyword
- Trade chips
- Country (CA / US)
- City or region
- Apprenticeship toggle

Job cards show title, company, location, trade, wage when present, source badge, and an apprentice badge. Adzuna cards include the required **Jobs by Adzuna** attribution.

## Employer posts

1. Sign in (or create an account at `/signup`)
2. Dashboard lists your posts
3. **Post a job** publishes a native listing with apply email and/or URL

Aggregated listings always **link out**. Native listings use a simple email/URL apply flow (no hosted inbox required).

## Database

`prisma/schema.prisma` uses SQLite via `DATABASE_URL`. Models are portable: swapping to Postgres/Supabase later is:

1. Point `DATABASE_URL` at Postgres
2. Change `datasource.db.provider` from `sqlite` to `postgresql`
3. Run `npx prisma migrate dev`

No model rewrite.

## Ingest (legal sources only)

Run on a cron, or hit the API with `Authorization: Bearer $INGEST_SECRET`.

```bash
npm run ingest                 # fixture Job Bank CSV + skip APIs without keys
npm run ingest:job-bank        # uses data/job-bank-fixture.csv
npm run ingest:adzuna          # no-op without ADZUNA_APP_ID / ADZUNA_APP_KEY
npm run ingest:usajobs         # no-op without USAJOBS_API_KEY
```

Live Job Bank CSV (do **not** scrape jobbank.gc.ca):

```bash
JOB_BANK_CSV_URL="https://open.canada.ca/data/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072/resource/6f422ded-5d9b-4ce6-b471-92fe46d1c734/download/job-bank-open-data-all-job-postings-en-july2026.csv" \
  npm run ingest:job-bank
# or
node --env-file=.env --import tsx scripts/ingest.ts job_bank --live
```

HTTP:

```bash
curl -X POST http://localhost:8081/api/ingest \
  -H "Authorization: Bearer $INGEST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"all"}'
```

Sources:

1. **Canada Job Bank monthly open data CSV** — Open Government Licence – Canada. Trades filtered by NOC 72/73/74 (featured: 72200 electrician, 72300 plumber, 72310 carpenter, 72106 welder, 72400 millwright, 73200/72402 HVAC, 73400 heavy equipment). Tests use `data/job-bank-fixture.csv`.
2. **Adzuna API** (`us` + `ca`) — keyword queries per trade. Skips if keys are missing.
3. **USAJOBS Search API** — FWS series 2805, 2810, 4204, 4206, 3703, 4607, and related. Requires `USAJOBS_API_KEY` and `USAJOBS_USER_AGENT`.

We do **not** scrape Indeed, LinkedIn, Glassdoor, apprenticeship.gov, or jobbank.gc.ca.

## Tests

```bash
npm test
```

## Environment

See `.env.example`. Change `AUTH_SECRET` and `INGEST_SECRET` before deploying.

## Notes

- SQLite is for local/dev only. Use Postgres/Supabase in production.
- Login is email/password (no magic links) so the app runs without a mail host.
- Public pages do not require an account.
