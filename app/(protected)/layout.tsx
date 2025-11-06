import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const currentUser = await stackServerApp.getUser({ req });
  if (!currentUser) return NextResponse.redirect(new URL("/signin", req.url));

  const user = await prisma.user.findUnique({ where: { email: currentUser.email } });

  if (req.nextUrl.pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/pharmacist", req.url));
  }

  return NextResponse.next();
}
