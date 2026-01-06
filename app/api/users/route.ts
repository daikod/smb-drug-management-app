import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import type { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const rawUser = await stackServerApp.getUser();
    if (!rawUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.user.findUnique({
      where: { id: rawUser.id },
      select: { role: true },
    });
    if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, phone: true },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rawUser = await stackServerApp.getUser();
    if (!rawUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.user.findUnique({
      where: { id: rawUser.id },
      select: { role: true },
    });
    if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { firstName, lastName, email, role, phone, password } = body;

    // ✅ Omit password field if null/undefined to satisfy Prisma types
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: role as UserRole,
        phone,
        password, // <-- THIS fixes the TS error
        // omit password to allow nullable string
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
