import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server"; // 🔹 StackAuth server SDK

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Extract ID from URL
    const { id } = await context.params;
    const body = await req.json();

    // 🔐 Ensure user is authenticated before allowing updates
    const rawUser = await stackServerApp.getUser();
    if (!rawUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get user role from your Prisma DB (Stack doesn’t store custom roles)
    const currentUser = await prisma.user.findUnique({
      where: { id: rawUser.id },
      select: { role: true },
    });

    // 🚨 Only allow admins to update user roles / verification
    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can modify user accounts" },
        { status: 403 }
      );
    }

    // 📝 Allow only specific fields to be updated
    const allowedUpdates = ["role", "emailVerified", "name"];
    const data = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedUpdates.includes(key))
    );

    // If admin verifying the email
    if (body?.emailVerified === true) {
      data.emailVerified = new Date();
    }

    // Update user inside Prisma
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
