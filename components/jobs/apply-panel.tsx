"use client";

import type { Job } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution";
import { sourceLabel } from "@/lib/format";

export function ApplyPanel({ job }: { job: Job }) {
  if (job.source === "employer") {
    return <EmployerApply job={job} />;
  }

  if (!job.applyUrl) {
    return (
      <p className="text-sm text-muted-foreground">
        No apply link is attached to this aggregated listing.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        This listing was aggregated from {sourceLabel(job.source)}. Apply on the
        source site — Tradesboard does not host applications for these jobs.
      </p>
      <Button render={<a href={job.applyUrl} target="_blank" rel="noreferrer" />}>
        Apply on {sourceLabel(job.source)}
      </Button>
      {job.source === "adzuna" ? (
        <AdzunaAttribution country={job.country} />
      ) : null}
    </div>
  );
}

function EmployerApply({ job }: { job: Job }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Posted directly by {job.company}. Send a short note or use the
        employer’s apply link.
      </p>
      {job.applyUrl ? (
        <Button render={<a href={job.applyUrl} target="_blank" rel="noreferrer" />}>
          Apply on company site
        </Button>
      ) : null}
      {job.applyEmail ? (
        <EmployerEmailForm email={job.applyEmail} title={job.title} />
      ) : null}
      {!job.applyUrl && !job.applyEmail ? (
        <p className="text-sm text-muted-foreground">
          This employer did not include an apply email or URL.
        </p>
      ) : null}
    </div>
  );
}

function EmployerEmailForm({ email, title }: { email: string; title: string }) {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("from") ?? "");
    const note = String(data.get("body") ?? "");
    const body = `Name: ${name}\nEmail: ${from}\n\n${note}`;
    const href = `mailto:${email}?subject=${encodeURIComponent(`Application: ${title}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="from">Email</Label>
        <Input id="from" name="from" type="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Note</Label>
        <Textarea
          id="body"
          name="body"
          rows={4}
          placeholder="Tickets, years in the trade, and when you can start."
        />
      </div>
      <Button type="submit">Email {email}</Button>
    </form>
  );
}
