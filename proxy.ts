// app/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

// Extend CurrentServerUser to safely include optional email sources
interface SafeCurrentUser {
  id?: string | null;
  email?: string | null;
  role?: string | null;
  data?: { email?: string | null };
  fields?: { email?: string | null };
}

export async function proxy(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Allow unauthenticated access for public routes
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon.ico")
    ) {
      return NextResponse.next();
    }

    // Retrieve the current user from Stack
    const rawUser = await stackServerApp.getUser();
    const currentUser = rawUser as unknown as SafeCurrentUser;

    // Redirect unauthenticated users from protected areas
    if (!currentUser) {
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

    // Prefer lookup by ID, fallback to email
    const userId = currentUser.id ?? null;
    const userEmail =
      currentUser.email ??
      currentUser.data?.email ??
      currentUser.fields?.email ??
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
    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/pharmacist", request.url));
    }

    if (pathname.startsWith("/pharmacist") && user.role !== "PHARMACIST") {
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
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
