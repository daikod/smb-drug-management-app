import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ params is now a Promise
    const data = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
