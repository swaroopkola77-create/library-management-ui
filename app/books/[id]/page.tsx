"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays, Hash, UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { getBook } from "@/lib/api";
import type { Book } from "@/types/api";

export default function BookDetailsPage() {
  const params = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    setError(null);

    getBook(params.id)
      .then((result) => setBook(result.data))
      .catch((requestError: unknown) => setError(requestError))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Skeleton className="h-5 w-32" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Skeleton className="aspect-[4/5]" />
          <div className="space-y-5">
            <Skeleton className="h-16 w-4/5" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <ErrorState
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-60"
      >
        <ArrowLeft size={16} />
        Back to catalog
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="aspect-[4/5] bg-gradient-to-br from-zinc-200 via-zinc-50 to-zinc-300 p-6 dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900">
          <div className="flex h-full flex-col justify-between border border-zinc-400/60 p-6 dark:border-zinc-700">
            <div>
              <span className="text-xs uppercase tracking-[0.18em]">SHELF</span>
            </div>
            <BookOpen className="h-24 w-24" strokeWidth={1.15} />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={book.available ? "live" : "muted"}>
              {book.available ? "Available" : "Checked out"}
            </Badge>
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              {book.category}
            </span>
          </div>

          <h1 className="mt-5 font-display text-6xl leading-none sm:text-8xl">
            {book.title}
          </h1>

          <p className="mt-4 text-xl text-zinc-500">{book.author}</p>

          <div className="mt-10 grid gap-4 border-y border-zinc-200 py-8 dark:border-zinc-800 sm:grid-cols-3">
            <div>
              <Hash size={17} />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                ISBN
              </p>
              <p className="mt-1 text-sm font-medium">{book.isbn}</p>
            </div>

            <div>
              <UserRound size={17} />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                Author
              </p>
              <p className="mt-1 text-sm font-medium">{book.author}</p>
            </div>

            <div>
              <CalendarDays size={17} />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                Published
              </p>
              <p className="mt-1 text-sm font-medium">
                {book.publishedYear ?? "Not listed"}
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            This record is connected to the live library API. Availability
            reflects the latest value returned by the backend.
          </p>

          <div className="mt-8">
            <Button href="/books">Browse more books</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
