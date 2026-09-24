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
  if (!ADMIN_ENABLED) return <div>Admin disabled</div>;
  return <AdminDashboard />;
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error("Unknown error");
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
      setError(toError(requestError));
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  return <div />;
}
