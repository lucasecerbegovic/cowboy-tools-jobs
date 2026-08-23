import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyPanel } from "@/components/jobs/apply-panel";
import { SourceBadge } from "@/components/jobs/source-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getJobById } from "@/lib/jobs";
import { formatLocation, formatPostedAt, formatWage } from "@/lib/format";
import { tradeLabel } from "@/lib/trades";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  return { title: job?.title ?? "Job" };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const wage = formatWage(job);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <article className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <SourceBadge source={job.source} />
            {job.isApprenticeship ? (
              <Badge variant="secondary">Apprentice</Badge>
            ) : null}
            <Badge variant="outline">{tradeLabel(job.trade)}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            {job.title}
          </h1>
          <p className="text-muted-foreground">
            {job.company} · {formatLocation(job)}
          </p>
          <p className="text-sm text-muted-foreground">
            Posted {formatPostedAt(job.postedAt)}
            {job.nocOrSoc ? ` · ${job.country === "CA" ? "NOC" : "SOC/series"} ${job.nocOrSoc}` : ""}
            {job.employmentType ? ` · ${job.employmentType}` : ""}
          </p>
          {wage ? (
            <p className="font-mono text-lg text-copper">{wage}</p>
          ) : null}
        </div>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-sm leading-7">
          {job.description}
        </div>
      </article>
      <aside>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplyPanel job={job} />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
