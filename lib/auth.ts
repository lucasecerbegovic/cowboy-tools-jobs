import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  COOKIE_NAME,
  SESSION_DAYS,
  createSessionToken,
  readSessionToken,
  type SessionUser,
} from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await readSessionToken(token);
  if (!session) return null;
  const profile = await prisma.profile.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, role: true, companyName: true },
  });
  return profile;
}

export async function requireEmployer(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== "employer") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export { COOKIE_NAME, readSessionToken, type SessionUser };
