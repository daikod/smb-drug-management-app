import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReportsClientWrapper from "./ReportsClientWrapper";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/signin");
  }

  // Optional: restrict to Admin or Pharmacist only
  if (currentUser.role !== "ADMIN" && currentUser.role !== "PHARMACIST") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <ReportsClientWrapper />
    </div>
  );
}
