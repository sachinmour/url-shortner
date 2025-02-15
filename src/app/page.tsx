import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { UrlShortenerForm } from "./_components/UrlShortenerForm";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              URL Shortener
            </h1>
            <p className="text-center text-lg text-gray-300">
              Make your long URLs short and easy to share
            </p>
          </div>

          <div className="w-full max-w-xl">
            <UrlShortenerForm />
          </div>

          <div className="mt-8 text-center">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <p className="mb-4 text-gray-300">
                  Sign in to access more features like custom URLs and analytics
                </p>
                <Link
                  href="/api/auth/signin"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
