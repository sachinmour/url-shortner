import type { ShortUrl } from "@prisma/client";

interface StatsProps {
  urls: Array<
    Pick<ShortUrl, "id" | "slug" | "longUrl" | "createdAt" | "visits">
  >;
}

export function Stats({ urls }: StatsProps) {
  const totalUrls = urls.length;
  const totalVisits = urls.reduce((sum, url) => sum + url.visits, 0);
  const averageVisits = totalUrls > 0 ? Math.round(totalVisits / totalUrls) : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-white/10 p-4">
        <h3 className="text-lg font-semibold">Total URLs</h3>
        <p className="mt-2 text-3xl font-bold">{totalUrls}</p>
      </div>
      <div className="rounded-lg bg-white/10 p-4">
        <h3 className="text-lg font-semibold">Total Visits</h3>
        <p className="mt-2 text-3xl font-bold">{totalVisits}</p>
      </div>
      <div className="rounded-lg bg-white/10 p-4">
        <h3 className="text-lg font-semibold">Average Visits</h3>
        <p className="mt-2 text-3xl font-bold">{averageVisits}</p>
      </div>
    </div>
  );
}
