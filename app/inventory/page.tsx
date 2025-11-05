import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import { deleteDrug } from "@/lib/actions/drugs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Inventory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 5;

  // Base drug filter
  const where = {
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  // Fetch total count and paginated drugs including batches
  const [totalCount, drugs] = await Promise.all([
    prisma.drug.count({ where }),
    prisma.drug.findMany({
      where,
      include: {
        batches: {
          select: {
            id: true,
            batchNumber: true,
            quantityAvailable: true,
            sellingPrice: true,
            expiryDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Drug Inventory</h1>
              <p className="text-sm text-gray-500">
                Manage drugs, monitor batches, and track stock levels.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="flex gap-2" action="/inventory" method="GET">
              <input
                name="q"
                placeholder="Search drugs..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </form>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Generic Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Available Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Selling Price (₦)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Expiry (Nearest)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {drugs.map((drug: any) => {
                  const totalAvailable = drug.batches.reduce(
                    (sum: any, b: any) => sum + b.quantityAvailable,
                    0
                  );

                  const avgPrice =
                    drug.batches.length > 0
                      ? (
                          drug.batches.reduce(
                            (sum: any, b: any) => sum + Number(b.sellingPrice),
                            0
                          ) / drug.batches.length
                        ).toFixed(2)
                      : "-";

                  const nearestExpiry =
                    drug.batches.length > 0
                      ? new Date(
                          Math.min(
                            ...drug.batches.map((b: any) =>
                              new Date(b.expiryDate).getTime()
                            )
                          )
                        ).toLocaleDateString()
                      : "-";

                  return (
                    <tr key={drug.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{drug.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {drug.genericName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{drug.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {totalAvailable}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{avgPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {nearestExpiry}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        <form
                          action={async (formData: FormData) => {
                            "use server";
                            await deleteDrug(formData);
                          }}
                        >
                          <input type="hidden" name="id" value={drug.id} />
                          <button className="hover:text-red-900">Delete</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{
                  q,
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
