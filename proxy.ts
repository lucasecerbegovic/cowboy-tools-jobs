import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, readSessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && (!session || session.role !== "employer")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
