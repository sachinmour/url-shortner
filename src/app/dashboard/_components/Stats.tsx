import type { ShortUrl } from "@prisma/client";
import { Link2, Eye, BarChart3 } from "lucide-react";

interface StatsProps {
  urls: Array<
    Pick<ShortUrl, "id" | "slug" | "longUrl" | "createdAt" | "visits">
  >;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="group relative rounded-lg bg-white/10 p-4 transition-all hover:bg-white/15">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-500/10 p-2 text-blue-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
      <div className="absolute -inset-px rounded-lg border border-white/0 transition-all group-hover:border-white/10" />
      <div className="invisible absolute -top-12 left-1/2 z-10 w-48 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-center text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
        {description}
      </div>
    </div>
  );
}

export function Stats({ urls }: StatsProps) {
  const totalUrls = urls.length;
  const totalVisits = urls.reduce((sum, url) => sum + url.visits, 0);
  const averageVisits = totalUrls > 0 ? Math.round(totalVisits / totalUrls) : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total URLs"
        value={totalUrls}
        description="Total number of shortened URLs you've created"
        icon={<Link2 className="h-5 w-5" />}
      />
      <StatCard
        title="Total Visits"
        value={totalVisits}
        description="Total number of times your shortened URLs have been visited"
        icon={<Eye className="h-5 w-5" />}
      />
      <StatCard
        title="Average Visits"
        value={averageVisits}
        description="Average number of visits per shortened URL"
        icon={<BarChart3 className="h-5 w-5" />}
      />
    </div>
  );
}
