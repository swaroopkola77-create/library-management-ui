import Link from "next/link";

import type { Book } from "@/types/api";
import { BookCard } from "@/components/books/BookCard";

export function BookGrid({
  books,
  list = false,
}: {
  books: Book[];
  list?: boolean;
}) {
  if (list) {
    return (
      <div className="space-y-3">
        {books.map((book) => (
          <BookCardRow key={book._id} book={book} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}

function BookCardRow({ book }: { book: Book }) {
  return (
    <article className="surface grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">{book.title}</h2>
          <span className="text-xs text-zinc-500">{book.category}</span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          {book.author} · {book.isbn}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">
          {book.available ? "Available" : "Checked out"}
        </span>
        <Link href={"/books/" + book._id} className="text-sm font-semibold hover:opacity-60">
          View →
        </Link>
      </div>
    </article>
  );
}
