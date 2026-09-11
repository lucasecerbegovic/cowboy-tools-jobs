/**
 * Apply local Prisma SQLite migrations to Turso.
 * Prisma Migrate cannot target Turso directly — run this after `prisma migrate dev`.
 *
 * Usage: pnpm db:turso-migrate
 */
import { createClient } from '@libsql/client';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

async function loadEnvFiles() {
  for (const file of ['.env', '.env.local']) {
    try {
      process.loadEnvFile(file);
    } catch {
      // optional
    }
  }
}

async function main() {
  await loadEnvFiles();

  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local');
  }

  const client = createClient({ url, authToken });
  const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
  const entries = (await readdir(migrationsDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id TEXT PRIMARY KEY NOT NULL,
      checksum TEXT NOT NULL,
      finished_at DATETIME,
      migration_name TEXT NOT NULL,
      logs TEXT,
      rolled_back_at DATETIME,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      applied_steps_count INTEGER NOT NULL DEFAULT 0
    )
  `);

  const applied = new Set(
    (
      await client.execute('SELECT migration_name FROM _prisma_migrations WHERE rolled_back_at IS NULL')
    ).rows.map((row) => String(row.migration_name)),
  );

  for (const name of entries) {
    if (applied.has(name)) {
      console.log(`skip  ${name}`);
      continue;
    }
    const sqlPath = path.join(migrationsDir, name, 'migration.sql');
    const sql = await readFile(sqlPath, 'utf8');
    const statements = sql
      .split(';')
      .map((chunk) =>
        chunk
          .split('\n')
          .map((line) => line.trimEnd())
          .filter((line) => {
            const trimmed = line.trim();
            return trimmed.length > 0 && !trimmed.startsWith('--');
          })
          .join('\n')
          .trim(),
      )
      .filter((s) => s.length > 0);

    console.log(`apply ${name} (${statements.length} statements)`);
    for (const statement of statements) {
      await client.execute(statement);
    }
    await client.execute({
      sql: `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, applied_steps_count)
            VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)`,
      args: [crypto.randomUUID(), 'manual', name, statements.length],
    });
  }

  console.log('Turso migrations up to date.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
