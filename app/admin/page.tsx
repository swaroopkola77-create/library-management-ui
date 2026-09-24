"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { BookForm } from "@/components/admin/BookForm";
import { ErrorState, getFriendlyApiMessage } from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createBook, deleteBook, getBooks, updateAvailability, updateBook } from "@/lib/api";
import type { Book } from "@/types/api";

const ADMIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";

export default function AdminPage() {
  if (!ADMIN_ENABLED) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-20 text-center sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Admin</p>
        <h1 className="mt-4 font-display text-7xl">ADMIN DISABLED.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500">
          Admin operations are disabled because the current backend does not provide authentication or authorization.
        </p>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadBooks = async () => {
    setError(null);
    try {
      const result = await getBooks({ page: 1, limit: 100 });
      setBooks(result.data);
    } catch (requestError) {
      setError(requestError);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const sortedBooks = useMemo(
    () => [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [books]
  );

  const handleSubmit = async (values: Omit<Book, "_id" | "createdAt" | "updatedAt">) => {
    setBusy(true);
    try {
      if (editing) await updateBook(editing._id, values);
      else await createBook(values);
      setEditing(null);
      setShowForm(false);
      await loadBooks();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (book: Book) => {
    const confirmed = window.confirm('Delete "' + book.title + '"? This cannot be undone.');
    if (!confirmed) return;

    setBusy(true);
    try {
      await deleteBook(book._id);
      await loadBooks();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const handleAvailability = async (book: Book) => {
    setBusy(true);
    try {
      await updateAvailability(book._id, !book.available);
      await loadBooks();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-10 md:flex-row md:items-end dark:border-zinc-800">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Admin</p>
          <h1 className="mt-3 font-display text-7xl leading-none sm:text-9xl">MANAGE.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-500">
            This dashboard is protected only by a build-time flag. Do not enable it on a public deployment until backend authentication exists.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={17} /> Add book
        </Button>
      </div>

      {error && (
        <div className="mt-8">
          <ErrorState error={error} onRetry={loadBooks} />
          <p className="mt-3 text-sm text-zinc-500">{getFriendlyApiMessage(error)}</p>
        </div>
      )}

      {showForm && (
        <section className="mt-8 border border-zinc-300 p-6 dark:border-zinc-700">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{editing ? "Edit book" : "New book"}</p>
              <h2 className="mt-2 text-xl font-semibold">{editing ? editing.title : "Add a book to the collection"}</h2>
            </div>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white">
              Close
            </button>
          </div>
          <div className="max-w-2xl">
            <BookForm initial={editing ?? undefined} onSubmit={handleSubmit} busy={busy} submitLabel={editing ? "Update book" : "Create book"} />
          </div>
        </section>
      )}

      <section className="mt-10 overflow-hidden border border-zinc-300 dark:border-zinc-700">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {sortedBooks.map((book) => (
            <article key={book._id} className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold">{book.title}</h2>
                  <Badge tone={book.available ? "live" : "muted"}>{book.available ? "Available" : "Checked out"}</Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{book.author} · {book.isbn} · {book.category}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="px-3 py-2" onClick={() => { setEditing(book); setShowForm(true); }} disabled={busy}>
                  <Pencil size={15} /> Edit
                </Button>
                <Button variant="secondary" className="px-3 py-2" onClick={() => handleAvailability(book)} disabled={busy}>
                  {book.available ? "Check out" : "Mark available"}
                </Button>
                <Button variant="secondary" className="px-3 py-2" onClick={() => handleDelete(book)} disabled={busy}>
                  <Trash2 size={15} /> Delete
                </Button>
              </div>
            </article>
          ))}
          {sortedBooks.length === 0 && !error && <div className="p-10 text-center text-sm text-zinc-500">No books available to manage.</div>}
        </div>
      </section>
    </div>
  );
}
