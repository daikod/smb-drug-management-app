"use client";

import { SignUp, useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { prisma } from "@/lib/prisma";

export default function SignUpPage() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    async function assignRole() {
      // Default role for new users → PHARMACIST
      await prisma.user.update({
        where: { id: userId },
        data: { role: "PHARMACIST" },
      });
    }

    assignRole().then(() => router.replace("/pharmacist"));
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <SignUp />
      </div>
    </div>
  );
}
