import { prisma } from '@/lib/prisma';
import type { FormState } from '@/lib/form-state';
import { APPLY_SCHEMA, POST_JOB_SCHEMA } from '@/lib/schemas';
import { formToRecord, validateAll, type Errors } from '@/lib/validate';
import { isEmploymentType, isTrade, toIngestTrade } from '@/lib/jobs';
import { slugify } from '@/lib/slug';
import { formatJobTitle } from '@/lib/format-title';
import { inferEmployerBranding } from '@/lib/employer-logo';
import { SITE_NAME } from '@/lib/site';

/** Cross-field rule the per-field schema cannot express. */
function payRangeError(data: Record<string, string>): Errors {
  const min = Number(data.payMin);
  const max = Number(data.payMax);
  if (data.payMin && data.payMax && Number.isFinite(min) && Number.isFinite(max)) {
    if (min > max) {
      return { payMax: 'Maximum pay must be greater than minimum pay.' };
    }
  }
  return {};
}

function uniqueSourceId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function postJob(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formToRecord(formData);
  const errors = { ...validateAll(values, POST_JOB_SCHEMA), ...payRangeError(values) };

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, values };
  }

  if (!isTrade(values.trade) || !isEmploymentType(values.type)) {
    return { status: 'error', errors: { trade: 'Choose a valid trade and type.' }, values };
  }

  const slug = slugify(values.employer);
  const payMin = values.payMin ? Number(values.payMin) : null;
  const payMax = values.payMax ? Number(values.payMax) : null;
  const sourceId = uniqueSourceId('post');
  const branding = inferEmployerBranding({
    name: values.employer,
    applyEmail: values.contactEmail,
  });

  await prisma.employer.upsert({
    where: { slug },
    update: {
      name: values.employer,
      city: values.city,
      province: values.province,
      country: 'CA',
      ...(branding.website ? { website: branding.website } : {}),
      ...(branding.logoUrl ? { logoUrl: branding.logoUrl } : {}),
    },
    create: {
      slug,
      name: values.employer,
      verified: false,
      city: values.city,
      province: values.province,
      country: 'CA',
      about: `${values.employer} posts roles directly on ${SITE_NAME}.`,
      website: branding.website,
      logoUrl: branding.logoUrl,
    },
  });

  await prisma.job.create({
    data: {
      source: 'employer',
      sourceId,
      title: formatJobTitle(values.title),
      company: values.employer,
      description: values.summary,
      trade: toIngestTrade(values.trade),
      country: 'CA',
      region: values.province,
      city: values.city,
      isApprenticeship: values.type === 'apprenticeship',
      employmentType: values.type,
      salaryMin: Number.isFinite(payMin) ? payMin : null,
      salaryMax: Number.isFinite(payMax) ? payMax : null,
      salaryCurrency: 'CAD',
      payUnit: 'hr',
      applyEmail: values.contactEmail,
      postedAt: new Date(),
      union: values.union === '1' || values.union === 'on',
      experience: values.experience ?? '',
      responsibilities: values.responsibilities
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      employerSlug: slug,
    },
  });

  return { status: 'success', errors: {}, values };
}

export async function applyToJob(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formToRecord(formData);
  const errors = validateAll(values, APPLY_SCHEMA);

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, values };
  }

  const jobId = values.jobId;
  if (!jobId) {
    return { status: 'error', errors: { name: 'Missing job.' }, values };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return { status: 'error', errors: { name: 'That job is no longer listed.' }, values };
  }

  await prisma.application.create({
    data: {
      jobId,
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      ticket: values.ticket || null,
      message: values.message || null,
    },
  });

  return { status: 'success', errors: {}, values };
}
