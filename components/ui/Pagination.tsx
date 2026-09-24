import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="border border-zinc-300 p-2 disabled:opacity-30 dark:border-zinc-700"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-24 text-center text-sm">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="border border-zinc-300 p-2 disabled:opacity-30 dark:border-zinc-700"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
