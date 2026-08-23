import {
  detectApprenticeship,
  TRADE_SLUGS,
  type TradeSlug,
} from "@/lib/trades";
import type { IngestResult, NormalizedJob } from "@/lib/ingest/types";
import { emptyCounts } from "@/lib/ingest/types";
import { persistIngest } from "@/lib/ingest/persist";

type AdzunaJob = {
  id: string | number;
  title?: string;
  description?: string;
  created?: string;
  redirect_url?: string;
  salary_min?: number;
  salary_max?: number;
  latitude?: number;
  longitude?: number;
  contract_type?: string;
  contract_time?: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
};

type AdzunaSearchResponse = {
  results?: AdzunaJob[];
};

const ADZUNA_COUNTRIES = ["ca", "us"] as const;

function queryForTrade(trade: TradeSlug): string | null {
  switch (trade) {
    case "electrician":
      return "electrician";
    case "plumber":
      return "plumber";
    case "carpenter":
      return "carpenter";
    case "welder":
      return "welder";
    case "millwright":
      return "millwright";
    case "hvac":
      return "HVAC";
    case "heavy_equipment":
      return "heavy equipment operator";
    case "other":
      return null;
    default: {
      const exhaustive: never = trade;
      return exhaustive;
    }
  }
}

function regionFromAdzuna(job: AdzunaJob): {
  city: string | null;
  region: string | null;
} {
  const area = job.location?.area ?? [];
  const display = job.location?.display_name ?? "";
  const city = display.split(",")[0]?.trim() || area.at(-1) || null;
  const region = area.length >= 2 ? area.at(-2) ?? null : null;
  return { city, region };
}

function mapAdzunaJob(
  job: AdzunaJob,
  country: "CA" | "US",
  trade: TradeSlug,
): NormalizedJob | null {
  if (!job.id || !job.title) return null;
  const { city, region } = regionFromAdzuna(job);
  return {
    source: "adzuna",
    sourceId: String(job.id),
    title: job.title,
    company: job.company?.display_name || "Employer (via Adzuna)",
    description: job.description || job.title,
    trade,
    country,
    region,
    city,
    lat: job.latitude ?? null,
    lng: job.longitude ?? null,
    isApprenticeship: detectApprenticeship(job.title, job.description),
    employmentType: job.contract_type || job.contract_time || null,
    salaryMin: job.salary_min ?? null,
    salaryMax: job.salary_max ?? null,
    salaryCurrency: country === "CA" ? "CAD" : "USD",
    applyUrl: job.redirect_url ?? null,
    postedAt: job.created ? new Date(job.created) : new Date(),
    raw: { adzunaId: job.id },
  };
}

export async function ingestAdzuna(): Promise<IngestResult> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    console.log("Adzuna ingest skipped: ADZUNA_APP_ID / ADZUNA_APP_KEY not set");
    return {
      source: "adzuna",
      skipped: true,
      reason: "Missing ADZUNA_APP_ID or ADZUNA_APP_KEY",
    };
  }

  const counts = emptyCounts();
  const collected: NormalizedJob[] = [];

  try {
    for (const country of ADZUNA_COUNTRIES) {
      for (const trade of TRADE_SLUGS) {
        const what = queryForTrade(trade);
        if (!what) continue;
        const url = new URL(
          `https://api.adzuna.com/v1/api/jobs/${country}/search/1`,
        );
        url.searchParams.set("app_id", appId);
        url.searchParams.set("app_key", appKey);
        url.searchParams.set("results_per_page", "20");
        url.searchParams.set("what", what);
        url.searchParams.set("content-type", "application/json");

        const response = await fetch(url);
        if (!response.ok) {
          console.log(
            `Adzuna ${country} ${what} failed: ${response.status} ${await response.text()}`,
          );
          continue;
        }
        const payload = (await response.json()) as AdzunaSearchResponse;
        for (const result of payload.results ?? []) {
          const mapped = mapAdzunaJob(
            result,
            country.toUpperCase() as "CA" | "US",
            trade,
          );
          if (mapped) collected.push(mapped);
        }
      }
    }

    counts.fetched = collected.length;
    const persisted = await persistIngest("adzuna", collected);
    counts.upserted = persisted.upserted;
    counts.skipped = persisted.skipped;
    return { source: "adzuna", counts };
  } catch (error) {
    return {
      source: "adzuna",
      counts,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
