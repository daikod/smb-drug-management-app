// lib/reports.ts
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

/**
 * Reports library — server-only. Each function returns structured JSON ready for UI.
 */

/** Inventory summary: total drugs, total batches, total quantity, distinct suppliers */
export async function getInventorySummary(userId?: string) {
  // if you want user-level scoping, add where: { userId } to queries where needed
  const totalDrugs = await prisma.drug.count({ where: { isActive: true } });
  const totalBatches = await prisma.batch.count();
  const totalQuantityRow = await prisma.batch.aggregate({
    _sum: { quantityAvailable: true },
  });

  const suppliersCount = await prisma.supplier.count();

  return {
    totalDrugs,
    totalBatches,
    totalQuantity: Number(totalQuantityRow._sum.quantityAvailable || 0),
    suppliersCount,
  };
}

/** Low stock report: drugs whose total available <= minimumStockLevel */
export async function getLowStockReport(limit = 50) {
  const drugs = await prisma.drug.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      genericName: true,
      minimumStockLevel: true,
      reorderLevel: true,
      batches: {
        select: { quantityAvailable: true },
      },
    },
  });

  const rows = drugs
    .map((d) => {
      const totalQuantity = d.batches.reduce((s, b) => s + Number(b.quantityAvailable), 0);
      return {
        id: d.id,
        name: d.name,
        genericName: d.genericName,
        totalQuantity,
        minimumStockLevel: d.minimumStockLevel,
        reorderLevel: d.reorderLevel,
      };
    })
    .filter((r) => r.totalQuantity <= r.minimumStockLevel)
    .sort((a, b) => a.totalQuantity - b.totalQuantity)
    .slice(0, limit);

  return rows;
}

/** Expiry report: batches expiring in next `daysAhead` days */
export async function getExpiringSoonReport(daysAhead = 30, limit = 100) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + daysAhead);

  const batches = await prisma.batch.findMany({
    where: {
      quantityAvailable: { gt: 0 },
      expiryDate: { lte: cutoff, gt: new Date() },
    },
    select: {
      id: true,
      batchNumber: true,
      quantityAvailable: true,
      expiryDate: true,
      drug: { select: { id: true, name: true, genericName: true } },
    },
    orderBy: { expiryDate: "asc" },
    take: limit,
  });

  return batches.map((b) => ({
    id: b.id,
    batchNumber: b.batchNumber,
    drugId: b.drug.id,
    drugName: b.drug.name,
    genericName: b.drug.genericName,
    quantityAvailable: Number(b.quantityAvailable),
    expiryDate: b.expiryDate,
    daysUntilExpiry: Math.ceil((b.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  }));
}

/** Stock value by category (sum quantity * unitPrice across batches) */
export async function getStockValueByCategory() {
  // join drug -> batches
  const drugs = await prisma.drug.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      batches: { select: { quantityAvailable: true, unitPrice: true } },
    },
  });

  const map = new Map<string, { category: string | null; value: number; quantity: number }>();

  drugs.forEach((d) => {
    const cat = d.category ?? "OTHER";
    let agg = map.get(cat) ?? { category: String(cat), value: 0, quantity: 0 };
    d.batches.forEach((b) => {
      const qty = Number(b.quantityAvailable || 0);
      const price = Number(b.unitPrice || 0);
      agg.value += qty * price;
      agg.quantity += qty;
    });
    map.set(cat, agg);
  });

  return Array.from(map.values()).sort((a, b) => b.value - a.value);
}

/** Top-selling drugs (based on SALE transactions) within the last N days */
export async function getTopSellingDrugs(days = 30, limit = 10) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await prisma.transaction.groupBy({
    by: ["drugId"],
    where: { type: "SALE", transactionDate: { gte: since } },
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  // enrich with drug names
  const enriched = await Promise.all(
    rows.map(async (r) => {
      const drug = await prisma.drug.findUnique({ where: { id: r.drugId }, select: { name: true, genericName: true } });
      return {
        drugId: r.drugId,
        drugName: drug?.name ?? "Unknown",
        genericName: drug?.genericName ?? null,
        quantitySold: Number(r._sum.quantity || 0),
        revenue: Number(r._sum.totalPrice || 0),
      };
    })
  );

  return enriched;
}

/** Turnover: total sales and average order value for the last N days */
export async function getTurnover(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const aggregated = await prisma.transaction.aggregate({
    where: { type: "SALE", transactionDate: { gte: since } },
    _sum: { totalPrice: true },
    _count: { id: true },
  });

  const totalRevenue = Number(aggregated._sum.totalPrice || 0);
  const count = aggregated._count || 0;
  const avgOrder = count > 0 ? totalRevenue / count : 0;

  return { totalRevenue, count, avgOrder };
}
