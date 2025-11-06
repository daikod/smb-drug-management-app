import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, PlusCircle, Settings2, Truck, Users } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth"; // ✅ Import to check user role

export default async function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  // ✅ Fetch user from your existing auth util
  const user = await getCurrentUser();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-drug", icon: PlusCircle },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Settings", href: "/settings", icon: Settings2 },
  ];

  // ✅ Add Admin-only section
  const adminLinks =
    user?.role === "ADMIN"
      ? [
          {
            name: "Manage Staff",
            href: "/admin/manage-staff",
            icon: Users,
          },
        ]
      : [];

  return (
    <div className="fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-10 h-10" />
          <span className="text-lg font-semibold">
            SM Balgwe Drug Management App
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        <div className="text-sm font-semibold text-gray-400 uppercase">
          Inventory
        </div>

        {navigation.map((item, key) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-gray-800"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}

        {/* ✅ Admin-only section */}
        {adminLinks.length > 0 && (
          <>
            <div className="text-sm font-semibold text-gray-400 uppercase mt-6">
              Admin
            </div>
            {adminLinks.map((item, key) => {
              const IconComponent = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link
                  href={item.href}
                  key={key}
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${
                    isActive
                      ? "bg-blue-100 text-gray-800"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );
}
