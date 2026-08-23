import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({
  action,
  submitLabel,
  error,
  showCompany = false,
  next,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  error?: string;
  showCompany?: boolean;
  next?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={showCompany ? "new-password" : "current-password"}
        />
      </div>
      {showCompany ? (
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" name="companyName" required />
        </div>
      ) : null}
      <Button type="submit" className="w-full" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
