// app/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ Skip public routes
  if (
    pathname.startsWith("/signin") ||
    pathname === "/" ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  const currentUser = await stackServerApp.getUser({ req });
  if (!currentUser) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id as string },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/pharmacist", req.url));
  }

  return NextResponse.next();
}

// ✅ Restrict to protected areas only
export const config = {
  matcher: ["/admin/:path*", "/pharmacist/:path*"],
};
