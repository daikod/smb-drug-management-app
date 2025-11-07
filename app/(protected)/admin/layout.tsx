import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth"; // Adjust import path as needed
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();
  if (user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}