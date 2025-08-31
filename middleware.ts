import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { rateLimit } from "@/lib/rate-limit";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth?.token?.role as "ADMIN" | "STUDENT" | undefined;

    // Basic RBAC routing
    if (pathname.startsWith("/api")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "unknown";
      const key = `${ip}:${pathname}`;
      const { allowed, resetAt } = rateLimit(key, 100, 60_000);
      if (!allowed) {
        return new NextResponse("Too many requests", { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now())/1000)) } });
      }
    }
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url));
      }
    }
    if (pathname.startsWith("/student")) {
      if (!role) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/dashboard",
    "/api/:path*",
  ],
};
