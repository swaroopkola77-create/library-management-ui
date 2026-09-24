"use client";

import { Grid2X2, List, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { BookGrid } from "@/components/books/BookGrid";
import { BookSkeleton } from "@/components/books/BookSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { getBooks } from "@/lib/api";
import type { Book, Pagination as PaginationType } from "@/types/api";

const PAGE_SIZE = 12;

export default function BooksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialised = useRef(false);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [availableFilter, setAvailableFilter] = useState(searchParams.get("available") ?? "");
  const [page, setPage] = useState(() => {
    const value = Number(searchParams.get("page") ?? "1");
    return Number.isInteger(value) && value > 0 ? value : 1;
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const syncUrl = useCallback(
    (nextSearch: string, nextAvailable: string, nextPage: number) => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextAvailable) params.set("available", nextAvailable);
      if (nextPage > 1) params.set("page", String(nextPage));

      const query = params.toString();
      router.replace(query ? pathname + "?" + query : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      setPage(1);
      syncUrl(search, availableFilter, 1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search, availableFilter, syncUrl]);

  useEffect(() => {
    let cancelled = false;
    const available =
      availableFilter === "true" ? true : availableFilter === "false" ? false : undefined;

    setLoading(true);
    setError(null);

    getBooks({ page, limit: PAGE_SIZE, search: search.trim(), available })
      .then((result) => {
        if (cancelled) return;
        setBooks(result.data);
        setPagination(result.pagination);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError : new Error(String(requestError)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, availableFilter, reloadKey]);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    syncUrl(search, availableFilter, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="border-b border-zinc-200 pb-12 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Catalog</p>
        <div className="mt-3 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h1 className="font-display text-7xl leading-none sm:text-9xl">THE CATALOG.</h1>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Search the live collection, filter availability, and open a book for the full record.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <SearchInput value={search} onChange={setSearch} />
        <select
          value={availableFilter}
          onChange={(event) => {
            setAvailableFilter(event.target.value);
            setPage(1);
            syncUrl(search, event.target.value, 1);
          }}
          aria-label="Filter books by availability"
          className="border border-zinc-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">All books</option>
          <option value="true">Available</option>
          <option value="false">Checked out</option>
        </select>

        <div className="flex border border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={"px-4 " + (view === "grid" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "")}
          >
            <Grid2X2 size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={"px-4 " + (view === "list" ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "")}
          >
            <List size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => <BookSkeleton key={index} />)}
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={() => setReloadKey((value) => value + 1)} />
        ) : books.length === 0 ? (
          <EmptyState title="No books found." message="Try a different search term or availability filter." />
        ) : (
          <BookGrid books={books} list={view === "list"} />
        )}
      </div>

      {!loading && !error && books.length > 0 && (
        <div className="mt-12">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={changePage} />
        </div>
      )}

      {!loading && !error && (
        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-zinc-500">
          <RotateCcw size={13} aria-hidden="true" />
          {pagination.total} book{pagination.total === 1 ? "" : "s"} in the collection
        </p>
      )}
    </div>
  );
}
