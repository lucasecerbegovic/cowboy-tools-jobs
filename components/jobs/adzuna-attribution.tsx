import { adzunaHome } from "@/lib/format";

export function AdzunaAttribution({ country }: { country: string }) {
  const href = adzunaHome(country);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-[23px] min-w-[116px] items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <span className="underline underline-offset-2">Jobs</span>
      <span>by</span>
      <span className="font-semibold tracking-tight text-[#1960C0]">Adzuna</span>
    </a>
  );
}
