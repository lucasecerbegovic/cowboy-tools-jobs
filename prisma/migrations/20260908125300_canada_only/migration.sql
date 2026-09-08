-- Keep only Canadian listings. Retired ingest source rows are dropped.
DELETE FROM "jobs" WHERE "country" != 'CA' OR "source" = 'usajobs';
DELETE FROM "employers" WHERE "country" != 'CA';
DELETE FROM "ingest_runs" WHERE "source" = 'usajobs';
