import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StaffForm from "@/app/(protected)/admin/manage-staff/StaffForm";
import StaffTable from "@/app/(protected)/admin/manage-staff/StaffTable";
import { redirect } from "next/navigation";

export default async function ManageStaffPage() {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "ADMIN") {
    redirect("/dashboard"); // or redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    where: { NOT: { id: currentUser.id } }, // don't show self
    orderBy: { createdAt: "desc" },
    select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    lastLogin: true,
    role: true,
    phone: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  },

});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Staff</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <StaffForm />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <StaffTable users={users} />
        </div>
      </div>
    </div>
  );
}
