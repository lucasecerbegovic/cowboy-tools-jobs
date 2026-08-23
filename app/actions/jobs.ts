"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireEmployer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TRADE_SLUGS } from "@/lib/trades";

const jobSchema = z.object({
  title: z.string().min(4).max(160),
  company: z.string().min(2).max(120),
  description: z.string().min(20).max(8000),
  trade: z.enum(TRADE_SLUGS),
  country: z.enum(["CA", "US"]),
  city: z.string().min(2).max(80),
  region: z.string().max(80).optional(),
  employmentType: z.string().max(40).optional(),
  salaryMin: z.coerce.number().positive().optional(),
  salaryMax: z.coerce.number().positive().optional(),
  salaryCurrency: z.enum(["CAD", "USD"]).default("CAD"),
  applyUrl: z.string().url().optional().or(z.literal("")),
  applyEmail: z.string().email().optional().or(z.literal("")),
  isApprenticeship: z.boolean().default(false),
});

function optionalString(value: FormDataEntryValue | null): string | undefined {
  const text = String(value ?? "").trim();
  return text ? text : undefined;
}

export async function createJobAction(formData: FormData) {
  let employer;
  try {
    employer = await requireEmployer();
  } catch {
    redirect("/login?next=/dashboard/jobs/new");
  }

  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    description: formData.get("description"),
    trade: formData.get("trade"),
    country: formData.get("country"),
    city: formData.get("city"),
    region: optionalString(formData.get("region")),
    employmentType: optionalString(formData.get("employmentType")),
    salaryMin: optionalString(formData.get("salaryMin")) || undefined,
    salaryMax: optionalString(formData.get("salaryMax")) || undefined,
    salaryCurrency: formData.get("salaryCurrency") || "CAD",
    applyUrl: optionalString(formData.get("applyUrl")) ?? "",
    applyEmail: optionalString(formData.get("applyEmail")) ?? "",
    isApprenticeship: formData.get("isApprenticeship") === "1",
  });

  if (!parsed.success) {
    redirect(
      "/dashboard/jobs/new?error=" +
        encodeURIComponent("Check required fields. Description must be at least 20 characters."),
    );
  }

  if (!parsed.data.applyUrl && !parsed.data.applyEmail) {
    redirect(
      "/dashboard/jobs/new?error=" +
        encodeURIComponent("Add an apply email or apply URL so candidates can reach you."),
    );
  }

  const job = await prisma.job.create({
    data: {
      source: "employer",
      sourceId: `employer-${employer.id}-${Date.now()}`,
      title: parsed.data.title,
      company: parsed.data.company,
      description: parsed.data.description,
      trade: parsed.data.trade,
      country: parsed.data.country,
      city: parsed.data.city,
      region: parsed.data.region ?? null,
      employmentType: parsed.data.employmentType ?? null,
      salaryMin: parsed.data.salaryMin ?? null,
      salaryMax: parsed.data.salaryMax ?? null,
      salaryCurrency: parsed.data.salaryCurrency,
      applyUrl: parsed.data.applyUrl || null,
      applyEmail: parsed.data.applyEmail || null,
      isApprenticeship: parsed.data.isApprenticeship,
      postedAt: new Date(),
      employerId: employer.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/jobs");
  redirect(`/jobs/${job.id}`);
}

export async function deleteJobAction(formData: FormData) {
  const employer = await requireEmployer().catch(() => null);
  if (!employer) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.employerId !== employer.id) {
    redirect("/dashboard?error=" + encodeURIComponent("That listing could not be removed."));
  }
  await prisma.job.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  redirect("/dashboard");
}
