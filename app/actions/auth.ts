"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  hashPassword,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2).optional(),
});

export async function signupAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName") || undefined,
  });
  if (!parsed.success || !parsed.data.companyName) {
    redirect("/signup?error=" + encodeURIComponent("Check email, password (8+), and company name."));
  }

  const existing = await prisma.profile.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    redirect("/signup?error=" + encodeURIComponent("That email is already registered."));
  }

  const profile = await prisma.profile.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: "employer",
      companyName: parsed.data.companyName,
    },
  });

  await setSessionCookie({
    id: profile.id,
    email: profile.email,
    role: profile.role,
    companyName: profile.companyName,
  });
  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.pick({ email: true, password: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect("/login?error=" + encodeURIComponent("Enter a valid email and password."));
  }

  const profile = await prisma.profile.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!profile || !(await verifyPassword(parsed.data.password, profile.passwordHash))) {
    redirect("/login?error=" + encodeURIComponent("Invalid email or password."));
  }

  await setSessionCookie({
    id: profile.id,
    email: profile.email,
    role: profile.role,
    companyName: profile.companyName,
  });

  const next = String(formData.get("next") || "/dashboard");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
