-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'employer',
    "company_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trade" TEXT NOT NULL,
    "noc_or_soc" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "lat" REAL,
    "lng" REAL,
    "is_apprenticeship" BOOLEAN NOT NULL DEFAULT false,
    "employment_type" TEXT,
    "salary_min" REAL,
    "salary_max" REAL,
    "salary_currency" TEXT,
    "apply_url" TEXT,
    "apply_email" TEXT,
    "posted_at" DATETIME NOT NULL,
    "expires_at" DATETIME,
    "raw" JSONB,
    "employer_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "jobs_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ingest_runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "started_at" DATETIME NOT NULL,
    "finished_at" DATETIME,
    "counts" JSONB,
    "error" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "jobs_trade_idx" ON "jobs"("trade");

-- CreateIndex
CREATE INDEX "jobs_country_idx" ON "jobs"("country");

-- CreateIndex
CREATE INDEX "jobs_city_idx" ON "jobs"("city");

-- CreateIndex
CREATE INDEX "jobs_is_apprenticeship_idx" ON "jobs"("is_apprenticeship");

-- CreateIndex
CREATE INDEX "jobs_posted_at_idx" ON "jobs"("posted_at");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_source_source_id_key" ON "jobs"("source", "source_id");

-- CreateIndex
CREATE INDEX "ingest_runs_source_started_at_idx" ON "ingest_runs"("source", "started_at");
