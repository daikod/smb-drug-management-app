"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useUser } from "@stackframe/stack";

export default function SignInPage() {
  const router = useRouter();
  const user = useUser(); // ✅ Stack Auth returns user directly (or null)

  useEffect(() => {
    // Wait until user object is available (Stack automatically loads it)
    if (user) {
      const role =
        user.id ||
        // user.publicMetadata?.role ||
        // user.customClaims?.role ||
        null;

      if (role === "ADMIN") router.replace("/admin");
      else if (role === "PHARMACIST") router.replace("/pharmacist");
      else router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

        {/* ✅ Stack’s built-in SignIn component */}
        <SignIn />

        {!user && (
          <p className="text-center text-gray-500 mt-4">
            Please sign in to continue…
          </p>
        )}
      </div>
    </div>
  );
}
