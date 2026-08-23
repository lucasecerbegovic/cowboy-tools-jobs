import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That page or job listing does not exist.
      </p>
      <Link
        href="/jobs"
        className="mt-6 inline-block text-sm underline underline-offset-2"
      >
        Browse jobs
      </Link>
    </div>
  );
}
