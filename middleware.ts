import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/notes", "/dashboard", "/api/notes", "/api/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("peblo_session")?.value);

  const needsAuth = protectedRoutes.some((route) => pathname.startsWith(route));

  if (needsAuth && !hasSession) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/dashboard/:path*", "/api/:path*", "/login", "/signup"]
};
