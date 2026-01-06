import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();

  // Hard safety check
  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/signin");
  }

  return <>{children}</>;
}
