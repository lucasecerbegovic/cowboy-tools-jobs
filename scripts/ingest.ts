import { runIngest } from "../lib/ingest/run";

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes("--live");
  const source = args.find((arg) => arg !== "--live") ?? "all";
  const results = await runIngest({ source, liveJobBank: live });
  console.log(JSON.stringify(results, null, 2));
  const failed = results.some((result) => result.error);
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
