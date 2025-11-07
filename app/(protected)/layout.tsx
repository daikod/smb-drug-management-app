import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ✅ Get the current user from Stack
  const currentUser = await stackServerApp.getUser();
  if (!currentUser) {
    redirect("/signin");
  }

  // ✅ Fetch user role from database
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
  });

  if (!user) {
    redirect("/signin");
  }

  // ✅ Role-based redirect (optional)
  if (user.role === "ADMIN") {
    // Allow access to /admin and general routes
  } else if (user.role === "PHARMACIST") {
    // Allow access to /pharmacist and general routes
  } else {
    redirect("/signin");
  }

  // ✅ Return the children wrapped in a layout container
  return (
    <section className="min-h-screen bg-gray-50 text-gray-900">
      {children}
    </section>
  );
}
