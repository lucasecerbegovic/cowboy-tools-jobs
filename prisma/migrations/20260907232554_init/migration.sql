-- CreateTable
CREATE TABLE "employers" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CA',
    "founded" INTEGER,
    "size" TEXT,
    "about" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
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
    "pay_unit" TEXT,
    "apply_url" TEXT,
    "apply_email" TEXT,
    "posted_at" DATETIME NOT NULL,
    "expires_at" DATETIME,
    "union" BOOLEAN NOT NULL DEFAULT false,
    "experience" TEXT NOT NULL DEFAULT '',
    "responsibilities" JSONB,
    "raw" JSONB,
    "employer_slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "jobs_employer_slug_fkey" FOREIGN KEY ("employer_slug") REFERENCES "employers" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ticket" TEXT,
    "message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE INDEX "jobs_employer_slug_idx" ON "jobs"("employer_slug");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_source_source_id_key" ON "jobs"("source", "source_id");

-- CreateIndex
CREATE INDEX "applications_job_id_idx" ON "applications"("job_id");

-- CreateIndex
CREATE INDEX "ingest_runs_source_started_at_idx" ON "ingest_runs"("source", "started_at");
