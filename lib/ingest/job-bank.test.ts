import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { resolve } from 'node:path';
import { parseJobBankCsv } from '@/lib/ingest/job-bank-parse';

describe('parseJobBankCsv', () => {
  const csv = readFileSync(
    resolve(process.cwd(), 'data/job-bank-fixture.csv'),
    'utf8',
  );

  it('keeps trades NOC 72/73/74 rows and drops non-trades', () => {
    const jobs = parseJobBankCsv(csv);
    assert.equal(jobs.length, 4);
    assert.ok(jobs.every((job) => job.source === 'job_bank'));
    assert.ok(jobs.every((job) => job.country === 'CA'));
    assert.ok(!jobs.some((job) => /software/i.test(job.title)));
  });

  it('maps featured NOC codes to trades and flags apprentices', () => {
    const jobs = parseJobBankCsv(csv);
    const byId = Object.fromEntries(jobs.map((job) => [job.sourceId, job]));
    assert.equal(byId['JB-FIX-001'].trade, 'electrician');
    assert.equal(byId['JB-FIX-002'].trade, 'plumber');
    assert.equal(byId['JB-FIX-002'].isApprenticeship, true);
    assert.equal(byId['JB-FIX-003'].trade, 'millwright');
    assert.equal(byId['JB-FIX-004'].trade, 'heavy_equipment');
    assert.ok(byId['JB-FIX-001'].applyUrl?.includes('jobbank.gc.ca'));
  });

  it('keeps Western Canada trades rows when regions is west', () => {
    const jobs = parseJobBankCsv(csv, { regions: 'west' });
    assert.equal(jobs.length, 2);
    assert.deepEqual(
      jobs.map((job) => job.region).sort(),
      ['AB', 'SK'],
    );
    assert.ok(!jobs.some((job) => job.sourceId === 'JB-FIX-001'));
  });

  it('decodes UTF-16LE tab-separated snapshots', () => {
    const tsv =
      'WIC Job Location Snapshot ID\tJob Title\tNOC21 Code\tProvince/Territory\tCity\n' +
      'UTF16-1\tPlumber\t72300\tBritish Columbia\tVancouver\n' +
      'UTF16-2\tElectrician\t72200\tOntario\tToronto\n';
    const buffer = Buffer.concat([
      Buffer.from([0xff, 0xfe]),
      Buffer.from(tsv, 'utf16le'),
    ]);
    const jobs = parseJobBankCsv(buffer, { regions: 'west' });
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0]?.sourceId, 'UTF16-1');
    assert.equal(jobs[0]?.region, 'BC');
    assert.equal(jobs[0]?.city, 'Vancouver');
  });
});
