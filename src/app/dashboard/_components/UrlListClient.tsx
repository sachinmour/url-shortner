"use client";
import { api } from "~/trpc/react";
import { Stats } from "./Stats";
import { UrlList } from "./UrlList";

export function UrlListClient() {
  const { data: urls, refetch } = api.shortUrl.getUserUrls.useQuery();

  if (!urls) {
    return (
      <div className="space-y-8">
        <div className="h-32 animate-pulse rounded-lg bg-white/10" />
        <div>
          <div className="mb-4 h-8 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-64 animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Stats urls={urls} />
      <div>
        <h2 className="mb-4 text-2xl font-bold">Your URLs</h2>
        <UrlList urls={urls} onUrlDeleted={() => void refetch()} />
      </div>
    </div>
  );
}
