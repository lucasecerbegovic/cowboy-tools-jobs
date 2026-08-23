import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/session";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  return (
    <header className="border-b border-border/80 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold tracking-wide text-primary-foreground">
            TB
          </span>
          <span className="text-base font-semibold tracking-tight">
            Tradesboard
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/jobs" />}>
            Jobs
          </Button>
          {user?.role === "employer" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/dashboard" />}
              >
                Dashboard
              </Button>
              <Button size="sm" render={<Link href="/dashboard/jobs/new" />}>
                Post a job
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Employer login
              </Button>
              <Button size="sm" render={<Link href="/signup" />}>
                Post a job
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
