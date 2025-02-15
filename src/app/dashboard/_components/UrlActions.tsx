"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface UrlActionsProps {
  shortUrl: string;
  slug: string;
  onDelete?: () => void;
}

export function UrlActions({ shortUrl, slug, onDelete }: UrlActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteUrlMutation = api.shortUrl.delete.useMutation({
    onSuccess: () => {
      toast.success("URL deleted successfully");
      onDelete?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    deleteUrlMutation.mutate({ slug });
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-2">
      {!showDeleteConfirm && (
        <button
          onClick={copyToClipboard}
          className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
          title="Copy to clipboard"
        >
          Copy
        </button>
      )}
      <button
        onClick={handleDelete}
        className={`rounded px-3 py-1 text-sm font-medium text-white ${
          showDeleteConfirm
            ? "bg-red-600 hover:bg-red-700"
            : "bg-red-500 hover:bg-red-600"
        }`}
        title={showDeleteConfirm ? "Click again to confirm" : "Delete URL"}
      >
        {showDeleteConfirm ? "Confirm Delete" : "Delete"}
      </button>
      {showDeleteConfirm && (
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
          title="Cancel Delete"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
