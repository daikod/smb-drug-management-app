import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function POST(request: Request) {
  try {
    const rawUser = await stackServerApp.getUser();

    if (!rawUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: rawUser.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { userId, role } = await request.json();

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error setting role:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
