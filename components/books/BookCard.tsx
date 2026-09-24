import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { Book } from "@/types/api";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="overflow-hidden border border-zinc-300 bg-white transition hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="aspect-[4/5] bg-gradient-to-br from-zinc-200 via-zinc-50 to-zinc-300 p-5 dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900">
        <div className="flex h-full flex-col justify-between border border-zinc-400/60 p-5 dark:border-zinc-700">
          <div className="flex justify-between gap-3 text-xs uppercase tracking-[0.18em]">
            <span>SHELF</span>
            <span>{book.category}</span>
          </div>
          <div>
            <p className="font-display text-5xl leading-none">
              {book.title.slice(0, 1).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <Badge tone={book.available ? "live" : "muted"}>
          {book.available ? "Available" : "Checked out"}
        </Badge>

        <h2 className="mt-4 line-clamp-2 text-lg font-semibold">{book.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{book.author}</p>

        <Link
          href={"/books/" + book._id}
          className="mt-5 inline-block text-sm font-semibold hover:opacity-60"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
