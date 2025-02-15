"use client";

import type { ShortUrl } from "@prisma/client";
import { UrlActions } from "./UrlActions";
import { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

interface UrlListProps {
  urls: Array<
    Pick<ShortUrl, "id" | "slug" | "longUrl" | "createdAt" | "visits"> & {
      shortUrl: string;
    }
  >;
  onUrlDeleted: () => void;
}

export function UrlList({ urls, onUrlDeleted }: UrlListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof urls)[0] | "shortUrl";
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const itemsPerPage = 10;

  // Filter URLs based on search term
  const filteredUrls = urls.filter(
    (url) =>
      url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort URLs
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate URLs
  const totalPages = Math.ceil(sortedUrls.length / itemsPerPage);
  const paginatedUrls = sortedUrls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: typeof sortConfig.key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (urls.length === 0) {
    return (
      <div className="rounded-lg bg-white/10 p-6 text-center">
        <p className="text-gray-300">You have not created any URLs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="text-sm text-gray-400">
          Showing {paginatedUrls.length} of {filteredUrls.length} URLs
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th
                className="cursor-pointer px-6 py-3 text-left text-sm font-semibold hover:text-blue-400"
                onClick={() => handleSort("longUrl")}
              >
                Original URL
                {sortConfig.key === "longUrl" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? (
                      <ChevronUp className="inline h-4 w-4" />
                    ) : (
                      <ChevronDown className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-sm font-semibold hover:text-blue-400"
                onClick={() => handleSort("shortUrl")}
              >
                Short URL
                {sortConfig.key === "shortUrl" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? (
                      <ChevronUp className="inline h-4 w-4" />
                    ) : (
                      <ChevronDown className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-sm font-semibold hover:text-blue-400"
                onClick={() => handleSort("visits")}
              >
                Visits
                {sortConfig.key === "visits" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? (
                      <ChevronUp className="inline h-4 w-4" />
                    ) : (
                      <ChevronDown className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-sm font-semibold hover:text-blue-400"
                onClick={() => handleSort("createdAt")}
              >
                Created At
                {sortConfig.key === "createdAt" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? (
                      <ChevronUp className="inline h-4 w-4" />
                    ) : (
                      <ChevronDown className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUrls.map((url) => (
              <tr
                key={url.id}
                className="border-b border-white/20 last:border-0 hover:bg-white/5"
              >
                <td className="max-w-xs px-6 py-4 text-sm">
                  <div className="truncate" title={url.longUrl}>
                    {url.longUrl}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="truncate" title={url.shortUrl}>
                    {url.shortUrl}
                  </div>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
