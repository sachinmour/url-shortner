"use client";

import { useState, useEffect } from "react";

interface ShortUrlResultProps {
  shortUrl: string;
  slug: string;
}

export function ShortUrlResult({ shortUrl, slug }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    // Show success animation when component mounts
    const timer = setTimeout(() => setShowSuccess(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
    <div
      className={`mt-4 w-full max-w-md transform rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${showSuccess ? "scale-105" : "scale-100"}`}
    >
      <div className="flex items-center justify-between">
        <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Your shortened URL:
        </div>
        {showSuccess && (
          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900 dark:text-green-200">
            URL Shortened Successfully!
          </div>
        )}
      </div>
      <div className="group relative flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            readOnly
            value={shortUrl}
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            aria-label="Shortened URL"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 transform sm:hidden">
            <button
              onClick={copyToClipboard}
              className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              aria-label={
                copied ? "URL copied to clipboard" : "Copy URL to clipboard"
              }
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:block dark:bg-blue-500 dark:hover:bg-blue-400"
          aria-label={
            copied ? "URL copied to clipboard" : "Copy URL to clipboard"
          }
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </span>
          ) : (
            "Copy URL"
          )}
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Slug:
        </span>
        <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {slug}
        </code>
      </div>
    </div>
  );
}
