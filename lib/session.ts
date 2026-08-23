import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export const COOKIE_NAME = "tradesboard_session";
export const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  companyName: string | null;
};

export function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET must be set to a string of at least 16 characters",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(authSecret());
}

export async function readSessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, authSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    const role: Role = payload.role === "seeker" ? "seeker" : "employer";
    return {
      id: payload.sub,
      email: payload.email,
      role,
      companyName:
        typeof payload.companyName === "string" ? payload.companyName : null,
    };
  } catch {
    return null;
  }
}
