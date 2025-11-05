// lib/dashboard-stats.ts
import { prisma } from '@/lib/prisma';

export async function getDashboardStats(userId: string) {
  try {
    // Get all drugs (remove userId filter to see all drugs in system)
    const allDrugs = await prisma.drug.findMany({
      where: { isActive: true },
      include: {
        batches: {
          where: {
            status: {
              in: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']
            }
          }
        },
      },
    });

    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalQuantity = 0;

    allDrugs.forEach((drug) => {
      const totalAvailable = drug.batches.reduce(
        (sum, batch) => sum + batch.quantityAvailable,
        0
      );

      totalQuantity += totalAvailable;

      if (totalAvailable === 0) {
        outOfStockCount++;
      } else if (totalAvailable < drug.minimumStockLevel) {
        lowStockCount++;
      }
    });

    // Get expiring drugs (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringBatches = await prisma.batch.count({
      where: {
        expiryDate: {
          gte: new Date(),
          lte: thirtyDaysFromNow,
        },
        status: {
          in: ['IN_STOCK', 'LOW_STOCK']
        }
      },
    });

    // Get revenue and transaction stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.transaction.findMany({
      where: {
        type: 'SALE',
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const totalRevenue = recentSales.reduce(
      (sum, transaction) => sum + Number(transaction.totalPrice),
      0
    );

    return {
      totalDrugs: allDrugs.length,
      lowStockCount,
      outOfStockCount,
      expiringCount: expiringBatches,
      totalRevenue,
      recentTransactions: recentSales.length,
      totalQuantity,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalDrugs: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      expiringCount: 0,
      totalRevenue: 0,
      recentTransactions: 0,
      totalQuantity: 0,
    };
  }
}

export async function getLowStockDrugs(userId: string, limit: number = 5) {
  try {
    const drugs = await prisma.drug.findMany({
      where: { isActive: true },
      include: {
        batches: {
          where: {
            status: {
              in: ['IN_STOCK', 'LOW_STOCK']
            }
          },
          select: {
            quantityAvailable: true,
          },
        },
      },
    });

    const lowStockDrugs = drugs
      .map((drug) => {
        const totalQuantity = drug.batches.reduce(
          (sum, batch) => sum + batch.quantityAvailable,
          0
        );

        const stockPercentage = drug.minimumStockLevel > 0
          ? (totalQuantity / drug.minimumStockLevel) * 100
          : 100;

        return {
          ...drug,
          totalQuantity,
          stockPercentage,
        };
      })
      .filter((drug) => drug.totalQuantity < drug.minimumStockLevel)
      .sort((a, b) => a.stockPercentage - b.stockPercentage)
      .slice(0, limit);

    return lowStockDrugs;
  } catch (error) {
    console.error('Error fetching low stock drugs:', error);
    return [];
  }
}

export async function getExpiringDrugs(
  userId: string,
  days: number = 30,
  limit: number = 5
) {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const drugs = await prisma.drug.findMany({
      where: { isActive: true },
      include: {
        batches: {
          where: {
            expiryDate: {
              gte: new Date(),
              lte: targetDate,
            },
            status: {
              in: ['IN_STOCK', 'LOW_STOCK']
            }
          },
          orderBy: {
            expiryDate: 'asc',
          },
        },
      },
    });

    const expiringDrugs = drugs
      .filter((drug) => drug.batches.length > 0)
      .map((drug) => {
        const expiringQuantity = drug.batches.reduce(
          (sum, batch) => sum + batch.quantityAvailable,
          0
        );

        const nearestExpiry = drug.batches[0]?.expiryDate;

        return {
          ...drug,
          expiringQuantity,
          nearestExpiry,
        };
      })
      .sort(
        (a, b) =>
          new Date(a.nearestExpiry!).getTime() -
          new Date(b.nearestExpiry!).getTime()
      )
      .slice(0, limit);

    return expiringDrugs;
  } catch (error) {
    console.error('Error fetching expiring drugs:', error);
    return [];
  }
}

export async function getRecentTransactions(userId: string, limit: number = 5) {
  try {
    const transactions = await prisma.transaction.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        drug: {
          select: {
            name: true,
            genericName: true,
          },
        },
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return transactions.map((transaction) => ({
      ...transaction,
      transactionDate: transaction.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}