import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";

interface Props {
  params: {
    slug: string;
  };
}

export default async function RedirectPage({ params }: Props) {
  try {
    const shortUrl = await api.shortUrl.getBySlug({ slug: params.slug });

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
