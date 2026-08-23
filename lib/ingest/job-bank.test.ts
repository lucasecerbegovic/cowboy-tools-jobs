import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { resolve } from "node:path";
import { parseJobBankCsv } from "./job-bank-parse";

describe("parseJobBankCsv", () => {
  const csv = readFileSync(
    resolve(process.cwd(), "data/job-bank-fixture.csv"),
    "utf8",
  );

  it("keeps trades NOC 72/73/74 rows and drops non-trades", () => {
    const jobs = parseJobBankCsv(csv);
    assert.equal(jobs.length, 4);
    assert.ok(jobs.every((job) => job.source === "job_bank"));
    assert.ok(jobs.every((job) => job.country === "CA"));
    assert.ok(!jobs.some((job) => /software/i.test(job.title)));
  });

  it("maps featured NOC codes to trades and flags apprentices", () => {
    const jobs = parseJobBankCsv(csv);
    const byId = Object.fromEntries(jobs.map((job) => [job.sourceId, job]));
    assert.equal(byId["JB-FIX-001"].trade, "electrician");
    assert.equal(byId["JB-FIX-002"].trade, "plumber");
    assert.equal(byId["JB-FIX-002"].isApprenticeship, true);
    assert.equal(byId["JB-FIX-003"].trade, "millwright");
    assert.equal(byId["JB-FIX-004"].trade, "heavy_equipment");
    assert.ok(byId["JB-FIX-001"].applyUrl?.includes("jobbank.gc.ca"));
  });
});
