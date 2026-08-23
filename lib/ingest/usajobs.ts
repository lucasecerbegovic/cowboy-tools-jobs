import {
  detectApprenticeship,
  tradeFromText,
  type TradeSlug,
} from "@/lib/trades";
import type { IngestResult, NormalizedJob } from "@/lib/ingest/types";
import { emptyCounts } from "@/lib/ingest/types";
import { persistIngest } from "@/lib/ingest/persist";

type UsaJobsPosition = {
  PositionID?: string;
  PositionTitle?: string;
  PositionURI?: string;
  PositionStartDate?: string;
  PositionEndDate?: string;
  PublicationStartDate?: string;
  ApplicationCloseDate?: string;
  PositionLocationDisplay?: string;
  PositionLocation?: Array<{
    CityName?: string;
    CountrySubDivisionCode?: string;
    CountryCode?: string;
    Longitude?: number;
    Latitude?: number;
  }>;
  OrganizationName?: string;
  DepartmentName?: string;
  JobCategory?: Array<{ Code?: string; Name?: string }>;
  PositionRemuneration?: Array<{
    MinimumRange?: string;
    MaximumRange?: string;
    RateIntervalCode?: string;
  }>;
  UserArea?: { Details?: { JobSummary?: string; MajorDuties?: string[] } };
};

type UsaJobsSearchResponse = {
  SearchResult?: {
    SearchResultItems?: Array<{ MatchedObjectDescriptor?: UsaJobsPosition }>;
  };
};

/** Federal Wage System trades series in product scope. */
export const USAJOBS_SERIES: Array<{ code: string; trade: TradeSlug }> = [
  { code: "2805", trade: "electrician" },
  { code: "2810", trade: "electrician" },
  { code: "3703", trade: "welder" },
  { code: "3806", trade: "welder" },
  { code: "4204", trade: "plumber" },
  { code: "4206", trade: "plumber" },
  { code: "4607", trade: "carpenter" },
  { code: "4604", trade: "carpenter" },
  { code: "4749", trade: "millwright" },
  { code: "5306", trade: "hvac" },
  { code: "5803", trade: "heavy_equipment" },
  { code: "5716", trade: "heavy_equipment" },
  { code: "5725", trade: "heavy_equipment" },
];

function parseMoney(value: string | undefined): number | null {
  if (!value) return null;
  const num = Number.parseFloat(value.replace(/[$,]/g, ""));
  return Number.isFinite(num) ? num : null;
}

function mapUsaJob(
  position: UsaJobsPosition,
  seriesTrade: TradeSlug,
): NormalizedJob | null {
  const sourceId = position.PositionID;
  const title = position.PositionTitle;
  if (!sourceId || !title) return null;

  const loc = position.PositionLocation?.[0];
  const pay = position.PositionRemuneration?.[0];
  const summary =
    position.UserArea?.Details?.JobSummary ||
    position.UserArea?.Details?.MajorDuties?.join("\n") ||
    title;
  const series = position.JobCategory?.[0]?.Code;
  const trade =
    seriesTrade !== "other"
      ? seriesTrade
      : tradeFromText(title, position.JobCategory?.[0]?.Name);

  return {
    source: "usajobs",
    sourceId,
    title,
    company:
      position.OrganizationName ||
      position.DepartmentName ||
      "U.S. federal government",
    description: summary,
    trade,
    nocOrSoc: series ?? null,
    country: "US",
    region: loc?.CountrySubDivisionCode ?? null,
    city: loc?.CityName ?? position.PositionLocationDisplay ?? null,
    lat: loc?.Latitude ?? null,
    lng: loc?.Longitude ?? null,
    isApprenticeship: detectApprenticeship(title, summary),
    employmentType: "full-time",
    salaryMin: parseMoney(pay?.MinimumRange),
    salaryMax: parseMoney(pay?.MaximumRange),
    salaryCurrency: "USD",
    applyUrl: position.PositionURI ?? null,
    postedAt: position.PublicationStartDate
      ? new Date(position.PublicationStartDate)
      : new Date(),
    expiresAt: position.ApplicationCloseDate
      ? new Date(position.ApplicationCloseDate)
      : null,
    raw: {
      department: position.DepartmentName ?? null,
      rateInterval: pay?.RateIntervalCode ?? null,
    },
  };
}

export async function ingestUsaJobs(): Promise<IngestResult> {
  const apiKey = process.env.USAJOBS_API_KEY;
  const userAgent =
    process.env.USAJOBS_USER_AGENT || "tradesboard@localhost";

  if (!apiKey) {
    console.log("USAJOBS ingest skipped: USAJOBS_API_KEY not set");
    return {
      source: "usajobs",
      skipped: true,
      reason: "Missing USAJOBS_API_KEY",
    };
  }

  const counts = emptyCounts();
  const collected: NormalizedJob[] = [];

  try {
    for (const { code, trade } of USAJOBS_SERIES) {
      const url = new URL("https://data.usajobs.gov/api/search");
      url.searchParams.set("JobCategoryCode", code);
      url.searchParams.set("ResultsPerPage", "25");

      const response = await fetch(url, {
        headers: {
          Host: "data.usajobs.gov",
          "User-Agent": userAgent,
          "Authorization-Key": apiKey,
        },
      });

      if (!response.ok) {
        console.log(
          `USAJOBS series ${code} failed: ${response.status} ${await response.text()}`,
        );
        continue;
      }

      const payload = (await response.json()) as UsaJobsSearchResponse;
      for (const item of payload.SearchResult?.SearchResultItems ?? []) {
        const mapped = mapUsaJob(item.MatchedObjectDescriptor ?? {}, trade);
        if (mapped) collected.push(mapped);
      }
    }

    counts.fetched = collected.length;
    const persisted = await persistIngest("usajobs", collected);
    counts.upserted = persisted.upserted;
    counts.skipped = persisted.skipped;
    return { source: "usajobs", counts };
  } catch (error) {
    return {
      source: "usajobs",
      counts,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
