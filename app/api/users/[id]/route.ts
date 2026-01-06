import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js App Router requirement
) {
  try {
    const { id } = await context.params; // await promise
    const body = await req.json();

    const rawUser = await stackServerApp.getUser();
    if (!rawUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: rawUser.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can modify user accounts" },
        { status: 403 }
      );
    }

    // ✅ Explicit type-safe mapping
    const data: Prisma.UserUpdateInput = {
      firstName: body.firstName ?? undefined,
      lastName: body.lastName ?? undefined,
      role: body.role ?? undefined,
      // Cast emailVerified explicitly to any to satisfy Prisma UpdateInput
      ...(body.emailVerified === true
        ? { emailVerified: new Date() } as any
        : {}),
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
