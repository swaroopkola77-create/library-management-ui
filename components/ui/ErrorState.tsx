import { AlertTriangle, RefreshCw } from "lucide-react";

import { ApiError } from "@/lib/api";

export function getFriendlyApiMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "The library service is rate-limiting requests. Please wait a moment and retry.";
    }

    if (error.status === 503) {
      return "The library database is temporarily unavailable. Please retry shortly.";
    }

    if (error.status === 0) {
      return "We could not reach the library service. Check your connection and retry.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="border border-red-300 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/20">
      <div className="flex items-start gap-4">
        <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={20} />
        <div>
          <h2 className="font-semibold">Unable to load books</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {getFriendlyApiMessage(error)}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
