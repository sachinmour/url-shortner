"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ShortUrlResult } from "./ShortUrlResult";
import { useSession } from "next-auth/react";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "~/server/api/root";

const inputClassName =
  "block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400";

const labelClassName =
  "block text-sm font-medium text-gray-700 dark:text-gray-200";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  pattern?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  helperText?: string;
  onInvalid?: (e: React.InvalidEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  pattern,
  placeholder,
  minLength,
  maxLength,
  helperText,
  onInvalid,
  onInput,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={id}
          id={id}
          required
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          className={inputClassName}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInvalid={onInvalid}
          onInput={onInput}
        />
        {helperText && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

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

  const handleError = (error: TRPCClientErrorLike<AppRouter>) => {
    if (error.data?.code === "TOO_MANY_REQUESTS") {
      setError(`Rate limit exceeded. ${error.message}`);
    } else if (error.data?.zodError !== undefined) {
      setError("Please enter a valid URL (e.g., https://example.com)");
    } else {
      setError(error.message ?? "An error occurred while shortening the URL");
    }
  };

  const createShortUrl = api.shortUrl.create.useMutation({
    onError: handleError,
  });

  const createWithCustomSlug = api.shortUrl.createWithCustomSlug.useMutation({
    onError: handleError,
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
    } catch {
      // Error is handled by onError in mutation
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <FormInput
          id="url"
          label="Enter a URL to shorten"
          type="url"
          value={url}
          onChange={setUrl}
          pattern="https?:\/\/.+"
          placeholder="https://example.com"
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity(
              "Please enter a valid URL starting with http:// or https://",
            );
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />

        {session && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useCustomSlug"
              checked={useCustomSlug}
              onChange={(e) => setUseCustomSlug(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useCustomSlug" className={labelClassName}>
              Use custom URL
            </label>
          </div>
        )}

        {useCustomSlug && session && (
          <FormInput
            id="customSlug"
            label="Custom URL Slug"
            value={customSlug}
            onChange={setCustomSlug}
            pattern="[a-zA-Z0-9-_]+"
            placeholder="my-custom-url"
            minLength={3}
            maxLength={20}
            helperText="3-20 characters, letters, numbers, hyphens and underscores only"
          />
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
