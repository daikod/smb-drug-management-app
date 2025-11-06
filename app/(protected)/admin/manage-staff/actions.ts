"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function addStaff(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const role = data.get("role") as string;

  // generate a random temp password
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: { name, email, role: role as any, password: hashedPassword },
  });

  return { user, tempPassword };
}

export async function deleteStaff(id: string) {
  await prisma.user.delete({ where: { id } });
}

export async function updateRole(id: string, role: string) {
  await prisma.user.update({ where: { id }, data: { role: role as any } });
}

export async function listStaff() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}
