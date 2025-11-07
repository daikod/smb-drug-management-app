import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  // Fetch user from Stack Auth
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Safely extract identity info — adjust based on your Stack schema
  const email = user.id ?? user.primaryEmail ?? "";
  const firstName =
    (user.name && user.name.split(" ")[0]) ||
    user.firstName ||
    "New";
  const lastName =
    (user.name && user.name.split(" ")[1]) ||
    user.lastName ||
    "User";

  // Check if user exists in Prisma
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // If not found, create with appropriate role
  if (!dbUser) {
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? UserRole.ADMIN : UserRole.PHARMACIST;

    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email,
        firstName,
        lastName,
        role,
        password: "STACK_AUTH_USER", // pseudo password for stack users
        isActive: true,
        lastLogin: new Date(),
      },
    });
  }

  return { ...user, role: dbUser.role };
}
