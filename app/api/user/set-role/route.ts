import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
