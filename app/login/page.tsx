import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/employer/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Employer login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Employer login</CardTitle>
          <CardDescription>
            Local/dev account:{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              employer@tradesboard.dev
            </code>{" "}
            /{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              tradesboard
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm
            action={loginAction}
            submitLabel="Sign in"
            error={error}
            next={next}
          />
          <p className="text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="underline underline-offset-2">
              Create an employer account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
