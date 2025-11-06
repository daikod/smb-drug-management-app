// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    // 🔹 Get logged-in user
    const currentUser = await getCurrentUser().catch(() => null);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized", drugs: [], summary: {}, role: "UNKNOWN" },
        { status: 401 }
      );
    }

    const role = currentUser.role || "USER";

    // 🔹 Allow only admin & pharmacist
    if (role !== "ADMIN" && role !== "PHARMACIST") {
      return NextResponse.json(
        { error: "Forbidden", drugs: [], summary: {}, role },
        { status: 403 }
      );
    }

    // 🔹 Safe Prisma queries with fallbacks
    const totalDrugs = await prisma.drug.count().catch(() => 0);
    const lowStock = await prisma.drug.count({
      where: { quantityAvailable: { lte: 20 } },
    }).catch(() => 0);
    const expired = await prisma.drug.count({
      where: { expiryDate: { lt: new Date() } },
    }).catch(() => 0);
    const activeSuppliers = await prisma.supplier.count({
      where: { isActive: true },
    }).catch(() => 0);

    const drugs = await prisma.drug.findMany({
      select: {
        id: true,
        name: true,
        quantityAvailable: true,
        expiryDate: true,
        reorderLevel: true,
      },
      take: 10,
    }).catch(() => []);

    // 🔹 Always return valid JSON
    return NextResponse.json({
      summary: {
        totalDrugs,
        lowStock,
        expired,
        activeSuppliers,
      },
      drugs,
      role,
    });
  } catch (err: any) {
    console.error("API Error (/api/reports):", err);
    return NextResponse.json(
      {
        error: "Failed to load reports",
        details: err?.message || "Unexpected server error",
        drugs: [],
        summary: {},
        role: "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
