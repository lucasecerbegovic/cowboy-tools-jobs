import Link from "next/link";
import type { Job } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution";
import { SourceBadge } from "@/components/jobs/source-badge";
import { formatLocation, formatPostedAt, formatWage } from "@/lib/format";
import { tradeLabel } from "@/lib/trades";

export function JobCard({ job }: { job: Job }) {
  const wage = formatWage(job);
  const location = formatLocation(job);

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg">
            <Link href={`/jobs/${job.id}`} className="hover:underline">
              {job.title}
            </Link>
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {job.isApprenticeship ? (
              <Badge variant="secondary">Apprentice</Badge>
            ) : null}
            <SourceBadge source={job.source} />
          </div>
        </div>
        <CardDescription>
          {job.company} · {location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-medium">{tradeLabel(job.trade)}</span>
        {wage ? <span className="font-mono text-copper">{wage}</span> : null}
        <span className="text-muted-foreground">
          Posted {formatPostedAt(job.postedAt)}
        </span>
        {job.source === "adzuna" ? (
          <AdzunaAttribution country={job.country} />
        ) : null}
      </CardContent>
    </Card>
  );
}
