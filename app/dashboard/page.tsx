import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { deleteJobAction } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/auth";
import { getEmployerJobs } from "@/lib/jobs";
import { formatPostedAt, formatWage } from "@/lib/format";
import { tradeLabel } from "@/lib/trades";

export const metadata: Metadata = { title: "Employer dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "employer") {
    redirect("/login?next=/dashboard");
  }
  const { error } = await searchParams;
  const jobs = await getEmployerJobs(session.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {session.companyName ?? session.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/dashboard/jobs/new" />}>
            New listing
          </Button>
          <form action={logoutAction}>
            <Button variant="outline" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
      {jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          You have not posted a job yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Trade</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Wage</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Link href={`/jobs/${job.id}`} className="hover:underline">
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{tradeLabel(job.trade)}</TableCell>
                <TableCell>
                  {[job.city, job.region, job.country].filter(Boolean).join(", ")}
                </TableCell>
                <TableCell>{formatWage(job) ?? "—"}</TableCell>
                <TableCell>{formatPostedAt(job.postedAt)}</TableCell>
                <TableCell>
                  <form action={deleteJobAction}>
                    <input type="hidden" name="id" value={job.id} />
                    <Button variant="ghost" size="sm" type="submit">
                      Remove
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
