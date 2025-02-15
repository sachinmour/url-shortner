import { type ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <nav className="border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold hover:text-gray-300">
            URL Shortener
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              Create URL
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-300 hover:text-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, {session.user?.name ?? session.user?.email}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
