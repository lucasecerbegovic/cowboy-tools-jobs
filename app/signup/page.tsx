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
import { signupAction } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Create employer account" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Post jobs as an employer</CardTitle>
          <CardDescription>
            Public job search stays open. An account is only needed to publish
            a native listing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm
            action={signupAction}
            submitLabel="Create account"
            error={error}
            showCompany
          />
          <p className="text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
