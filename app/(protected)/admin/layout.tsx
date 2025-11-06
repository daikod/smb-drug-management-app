// app/(protected)/admin/layout.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
