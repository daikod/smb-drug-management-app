import { stackServerApp } from "@/stack/server";
import { SignIn } from "@stackframe/stack";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // ✅ added import to fetch user role

export default async function SignInPage() {
  const user = await stackServerApp.getUser();

  if (user) {
    // ✅ Check role from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (dbUser?.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200">
      <div className="max-w-md w-full space-y-8">
        <SignIn />
        <Link href="/">Go Back Home</Link>
      </div>
    </div>
  );
}
