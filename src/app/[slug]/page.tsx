import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { isReservedSlug } from "~/utils/reserved-slugs";

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
      redirect("/404");
    }

    redirect(shortUrl.longUrl);
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      redirect("/404");
    }
    throw error;
  }
}
