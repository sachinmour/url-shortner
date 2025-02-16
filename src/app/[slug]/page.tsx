import { redirect, notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { isReservedSlug } from "~/utils/reserved-slugs";
import Link from "next/link";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;

  // If the slug is reserved, let Next.js handle the route
  if (isReservedSlug(slug)) {
    return null;
  }

  try {
    const shortUrl = await api.shortUrl.getBySlug({ slug });

    if (!shortUrl) {
      notFound();
    }

    redirect(shortUrl.longUrl);
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") {
        notFound();
      }
      if (error.code === "TOO_MANY_REQUESTS") {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              429
            </h1>
            <p className="text-2xl">Rate Limit Exceeded</p>
            <p className="mt-4 text-white/80">{error.message}</p>
            <Link
              href="/"
              className="mt-8 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Go Home
            </Link>
          </div>
        );
      }
    }
    throw error;
  }
}
