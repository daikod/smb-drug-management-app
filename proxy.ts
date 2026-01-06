// app/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
import type { CurrentServerUser } from "@stackframe/stack";

// Extended type to include optional email
interface ExtendedUser extends CurrentServerUser {
  email?: string | null;
  data?: { email?: string | null };
  fields?: { email?: string | null };
  role?: "ADMIN" | "PHARMACIST" | null;
}

export async function proxy(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Allow unauthenticated access for public routes
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon.ico")
    ) {
      return NextResponse.next();
    }

    const rawUser = (await stackServerApp.getUser()) as ExtendedUser;

    // Redirect unauthenticated users from protected areas
    if (!rawUser) {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/pharmacist") ||
        pathname.startsWith("/inventory") ||
        pathname.startsWith("/reports")
      ) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      return NextResponse.next();
    }

    // Prefer lookup by ID, fallback to email safely
    const userId = rawUser.id ?? null;
    const userEmail =
      rawUser.email ??
      rawUser.data?.email ??
      rawUser.fields?.email ??
      null;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }

    // Allow if DB user not found to prevent broken redirects
    if (!user) {
      console.warn(
        "Proxy: session user found but no DB record",
        { id: userId, email: userEmail, path: pathname }
      );
      return NextResponse.next();
    }

    console.log("Proxy: user.role=", user.role, "path=", pathname);

    // Role-based route enforcement
    if (pathname.startsWith("/admin") && user.role === "ADMIN") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/pharmacist") && user.role === "PHARMACIST") {
      return NextResponse.next();
    }

    // Default fallback for unauthorized access
    if (pathname.startsWith("/admin") || pathname.startsWith("/pharmacist")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.next();
  }
}

// Matcher for protected areas
export const config = {
  matcher: [
    "/admin/:path*",
    "/pharmacist/:path*",
    "/inventory/:path*",
    "/reports/:path*",
  ],
};
