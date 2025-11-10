import ManageStaffPage from "@/app/(protected)/admin/manage-staff/page";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, PlusCircle, Settings2, Truck, Users, FileBarChart, Users2 } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currentPath = "/dashboard",
  role = "ADMIN", // 👈 optionally pass from session/user
}: {
  currentPath?: string;
  role?: string;
}) {
  const safePath = typeof currentPath === "string" ? currentPath : "/dashboard";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-drug", icon: PlusCircle },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Settings", href: "/settings", icon: Settings2 },
    { name: "Manage Staff", href: "/admin/manage-staff", icon: Users, adminOnly: true },

  

    // ✅ Added Reports link for Admin and Pharmacist
    { name: "Reports", href: "/reports", icon: FileBarChart, roles: ["ADMIN", "PHARMACIST"] },
  ];

   // Example role check (replace with real user role)
  const userRole = role || "ADMIN";

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
          Navigation
        </div>

        {navigation
          .filter((item) => {
            if (item.roles) return item.roles.includes(userRole);
            if (item.adminOnly) return userRole === "ADMIN";
            return true;
          })
          .map((item, key) => {
            const IconComponent = item.icon;
            const isActive = safePath === item.href;
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
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );
}
