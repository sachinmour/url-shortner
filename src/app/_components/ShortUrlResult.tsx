"use client";

import { useState } from "react";

interface ShortUrlResultProps {
  shortUrl: string;
  slug: string;
}

export function ShortUrlResult({ shortUrl, slug }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="mt-4 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        Your shortened URL:
      </div>
      <div className="group relative flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={shortUrl}
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        <button
          onClick={copyToClipboard}
          className="absolute right-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
          aria-label="Copy to clipboard"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Slug: {slug}
      </div>
    </div>
  );
}
