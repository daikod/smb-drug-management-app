import { listStaff } from "./actions";
import StaffTable from "./StaffTable";
import StaffForm from "./StaffForm";
import { getCurrentUser } from "@/lib/auth"; // your helper
import { redirect } from "next/navigation";

  export default async function ManageStaffPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");
  const staff = await listStaff();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Staff</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <StaffForm />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <StaffTable staff={staff} />
        </div>
      </div>
    </div>
  );
}
