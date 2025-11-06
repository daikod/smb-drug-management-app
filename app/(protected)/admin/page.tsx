import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import StaffForm from "./manage-staff/StaffForm";
import StaffTable from "./manage-staff/StaffTable";

export default async function ManageStaffPage() {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  const users = await prisma.user.findMany({
    where: { NOT: { id: currentUser.id } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Manage Staff</h1>
      <StaffForm />
      {/* ✅ Make sure this prop name matches StaffTable's expected prop */}
      <StaffTable users={users} />
    </div>
  );
}
