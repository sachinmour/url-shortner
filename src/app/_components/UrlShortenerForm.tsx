"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ShortUrlResult } from "./ShortUrlResult";
import { useSession } from "next-auth/react";

export function UrlShortenerForm() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [error, setError] = useState("");
  const [shortUrlData, setShortUrlData] = useState<{
    shortUrl: string;
    slug: string;
  } | null>(null);

  const createShortUrl = api.shortUrl.create.useMutation({
    onError: (error) => {
      setError(error.message ?? "An error occurred while shortening the URL");
    },
  });

  const createWithCustomSlug = api.shortUrl.createWithCustomSlug.useMutation({
    onError: (error) => {
      setError(error.message ?? "An error occurred while shortening the URL");
    },
  });

  const isPending =
    createShortUrl.status === "pending" ||
    createWithCustomSlug.status === "pending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let result;
      if (useCustomSlug && session) {
        result = await createWithCustomSlug.mutateAsync({
          longUrl: url,
          slug: customSlug,
        });
      } else {
        result = await createShortUrl.mutateAsync({ longUrl: url });
      }
      setShortUrlData(result);
      setUrl("");
      setCustomSlug("");
    } catch (error) {
      // Error is handled by onError in mutation
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Enter a URL to shorten
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="url"
              id="url"
              required
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {session && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useCustomSlug"
              checked={useCustomSlug}
              onChange={(e) => setUseCustomSlug(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="useCustomSlug"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Use custom URL
            </label>
          </div>
        )}

        {useCustomSlug && session && (
          <div className="mt-4">
            <label
              htmlFor="customSlug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Custom URL Slug
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="customSlug"
                id="customSlug"
                required
                pattern="[a-zA-Z0-9-_]+"
                minLength={3}
                maxLength={20}
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                placeholder="my-custom-url"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                3-20 characters, letters, numbers, hyphens and underscores only
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {isPending ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
      {shortUrlData && (
        <ShortUrlResult
          shortUrl={shortUrlData.shortUrl}
          slug={shortUrlData.slug}
        />
      )}
    </div>
  );
}
