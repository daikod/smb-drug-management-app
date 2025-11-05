import { Supplier } from "@prisma/client";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deleteSupplier, createSupplier } from "@/lib/actions/suppliers";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 5;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { contactPerson: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [totalCount, suppliers]: [number, Supplier[]] = await Promise.all([
    prisma.supplier.count({ where }),
    prisma.supplier.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/suppliers" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Suppliers
              </h1>
              <p className="text-sm text-gray-500">
                Manage your supplier information and partnerships.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="flex gap-2" action="/suppliers" method="GET">
              <input
                name="q"
                placeholder="Search suppliers..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </form>
          </div>

          {/* Create Supplier Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form action={createSupplier} className="grid grid-cols-2 gap-4">
              <input
                name="name"
                required
                placeholder="Supplier Name"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="contactPerson"
                required
                placeholder="Contact Person"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="phone"
                required
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="address"
                required
                placeholder="Address"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="city"
                required
                placeholder="City"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="state"
                placeholder="State"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="country"
                required
                placeholder="Country"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="postalCode"
                placeholder="Postal Code"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="taxId"
                placeholder="Tax ID"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                name="paymentTerms"
                placeholder="Payment Terms (e.g. Net 30)"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="col-span-2 mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Supplier
              </button>
            </form>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {s.contactPerson}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          await deleteSupplier(formData);
                        }}
                      >
                        <input type="hidden" name="id" value={s.id} />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/suppliers"
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
