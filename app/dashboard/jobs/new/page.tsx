import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JobPostForm } from "@/components/employer/job-form";
import { createJobAction } from "@/app/actions/jobs";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "employer") {
    redirect("/login?next=/dashboard/jobs/new");
  }
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Post a job</h1>
        <p className="text-muted-foreground">
          Native listings apply by email or URL. Aggregated sources always link
          out.
        </p>
      </div>
      <JobPostForm
        action={createJobAction}
        error={error}
        defaultCompany={session.companyName ?? undefined}
      />
    </div>
  );
}
