"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Copy, Trash2, X, Loader2 } from "lucide-react";

interface UrlActionsProps {
  shortUrl: string;
  slug: string;
  onDelete?: () => void;
}

export function UrlActions({ shortUrl, slug, onDelete }: UrlActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

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
      setIsCopying(true);
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    } finally {
      setIsCopying(false);
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
          disabled={isCopying}
          className="group relative flex items-center gap-2 rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isCopying ? "Copying..." : "Copy to clipboard"}
        >
          {isCopying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Copying...</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
          <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs opacity-0 transition-all group-hover:visible group-hover:opacity-100">
            {isCopying ? "Copying to clipboard..." : "Copy URL to clipboard"}
          </span>
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={deleteUrlMutation.isPending}
        className={`group relative flex items-center gap-2 rounded px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
          showDeleteConfirm
            ? "bg-red-600 hover:bg-red-700"
            : "bg-red-500 hover:bg-red-600"
        }`}
        aria-label={
          deleteUrlMutation.isPending
            ? "Deleting..."
            : showDeleteConfirm
              ? "Confirm deletion"
              : "Delete URL"
        }
      >
        {deleteUrlMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            <span>{showDeleteConfirm ? "Confirm Delete" : "Delete"}</span>
          </>
        )}
        <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs opacity-0 transition-all group-hover:visible group-hover:opacity-100">
          {deleteUrlMutation.isPending
            ? "Deleting URL..."
            : showDeleteConfirm
              ? "Click to confirm deletion"
              : "Delete this URL"}
        </span>
      </button>
      {showDeleteConfirm && (
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="group relative flex items-center gap-2 rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
          aria-label="Cancel deletion"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
          <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs opacity-0 transition-all group-hover:visible group-hover:opacity-100">
            Cancel deletion
          </span>
        </button>
      )}
    </div>
  );
}
