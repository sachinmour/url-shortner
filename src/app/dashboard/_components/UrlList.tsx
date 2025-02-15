import type { ShortUrl } from "@prisma/client";
import { UrlActions } from "./UrlActions";

interface UrlListProps {
  urls: Array<
    Pick<ShortUrl, "id" | "slug" | "longUrl" | "createdAt" | "visits"> & {
      shortUrl: string;
    }
  >;
  onUrlDeleted: () => void;
}

export function UrlList({ urls, onUrlDeleted }: UrlListProps) {
  if (urls.length === 0) {
    return (
      <div className="rounded-lg bg-white/10 p-6 text-center">
        <p className="text-gray-300">You haven't created any URLs yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white/10">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Short URL
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Visits
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id} className="border-b border-white/20 last:border-0">
              <td className="max-w-xs px-6 py-4 text-sm">
                <div className="truncate">{url.longUrl}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="truncate">{url.shortUrl}</div>
              </td>
              <td className="px-6 py-4 text-sm">{url.visits}</td>
              <td className="px-6 py-4 text-sm">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <UrlActions
                  shortUrl={url.shortUrl}
                  slug={url.slug}
                  onDelete={onUrlDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
