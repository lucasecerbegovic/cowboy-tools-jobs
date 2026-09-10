import { jobByline } from '@/lib/employer-logo';

/** Second line on a listing: location, plus a company name only when we have one. */
export function JobByline({
  employer,
  city,
  province,
  extra,
}: {
  employer: string;
  city: string;
  province: string;
  extra?: string;
}) {
  const line = jobByline({ employer, city, province });
  if (!extra) return line;
  return `${line} · ${extra}`;
}
