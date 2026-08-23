import { parse } from "csv-parse/sync";
import {
  detectApprenticeship,
  isTradesNoc,
  tradeFromNoc,
  tradeFromText,
} from "@/lib/trades";
import type { NormalizedJob } from "@/lib/ingest/types";

type CsvRow = Record<string, string>;

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function cell(row: CsvRow, ...aliases: string[]): string {
  for (const alias of aliases) {
    const key = normalizeHeader(alias);
    const match = Object.keys(row).find((k) => normalizeHeader(k) === key);
    if (match && row[match] && row[match] !== "NA") {
      return row[match].trim();
    }
  }
  return "";
}

function parseNumber(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[$,]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function jobBankSearchUrl(title: string, city: string, region: string): string {
  const params = new URLSearchParams();
  if (title) params.set("searchstring", title);
  const location = [city, region].filter(Boolean).join(", ");
  if (location) params.set("locationstring", location);
  return `https://www.jobbank.gc.ca/jobsearch/jobsearch?${params.toString()}`;
}

export function parseJobBankCsv(csvText: string): NormalizedJob[] {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as CsvRow[];

  const jobs: NormalizedJob[] = [];

  for (const row of records) {
    const noc =
      cell(row, "NOC21 Code", "NOC 2021 Code", "NOC21") ||
      cell(row, "NOC 2016 Code", "NOC2016 Code");
    if (!isTradesNoc(noc)) continue;

    const title =
      cell(row, "Job Title") || cell(row, "Original Job Title") || "Trades job";
    const city = cell(row, "City");
    const region = cell(
      row,
      "Province/Territory",
      "Province",
      "Economic Region",
    );
    const sourceId =
      cell(
        row,
        "ythWIC Job Location Snapshot ID",
        "_id",
        "Job Location Snapshot ID",
      ) || `${title}|${city}|${noc}|${cell(row, "First Posting Date")}`;

    const nocName = cell(row, "NOC21 Code Name", "NOC 2016 Code Name");
    const employmentType = cell(row, "Employment Type");
    const employmentTerm = cell(row, "Employment Term");
    const experience = cell(row, "Experience Level");
    const salaryPer = cell(row, "Salary Per");
    const company = cell(row, "Placement Agency") || "Employer (via Job Bank)";
    const postedAt = parseDate(cell(row, "First Posting Date")) ?? new Date();
    const mappedTrade = tradeFromNoc(noc);
    const trade =
      mappedTrade === "other" ? tradeFromText(title, nocName) : mappedTrade;

    const descriptionParts = [
      title,
      noc ? `NOC ${noc}${nocName ? ` — ${nocName}` : ""}` : null,
      experience ? `Experience: ${experience}` : null,
      employmentType ? `Employment type: ${employmentType}` : null,
      employmentTerm ? `Term: ${employmentTerm}` : null,
      city || region
        ? `Location: ${[city, region].filter(Boolean).join(", ")}`
        : null,
      "Source: Job Bank open data (Employment and Social Development Canada), licensed under the Open Government Licence – Canada.",
    ].filter(Boolean);

    jobs.push({
      source: "job_bank",
      sourceId,
      title,
      company,
      description: descriptionParts.join("\n"),
      trade,
      nocOrSoc: noc || null,
      country: "CA",
      region: region || null,
      city: city || null,
      isApprenticeship: detectApprenticeship(title, nocName, experience),
      employmentType: employmentType || employmentTerm || null,
      salaryMin: parseNumber(cell(row, "Salary Minimum")),
      salaryMax: parseNumber(cell(row, "Salary Maximum")),
      salaryCurrency: "CAD",
      applyUrl: jobBankSearchUrl(title, city, region),
      postedAt,
      raw: {
        salaryPer: salaryPer || null,
        nocName,
      },
    });
  }

  return jobs;
}
