"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import type { Book } from "@/types/api";

export type BookFormValues = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear: string;
  available: boolean;
};

const nextYear = new Date().getFullYear() + 1;

const emptyValues: BookFormValues = {
  title: "",
  author: "",
  isbn: "",
  category: "General",
  publishedYear: "",
  available: true,
};

function validate(values: BookFormValues) {
  const errors: Partial<Record<keyof BookFormValues, string>> = {};

  if (!values.title.trim()) errors.title = "Title is required.";
  if (values.title.trim().length > 200) errors.title = "Title cannot exceed 200 characters.";

  if (!values.author.trim()) errors.author = "Author is required.";
  if (values.author.trim().length > 150) errors.author = "Author cannot exceed 150 characters.";

  if (!values.isbn.trim()) errors.isbn = "ISBN is required.";
  if (values.isbn.trim().length > 32) errors.isbn = "ISBN cannot exceed 32 characters.";

  if (values.category.trim().length > 100) {
    errors.category = "Category cannot exceed 100 characters.";
  }

  if (values.publishedYear) {
    const year = Number(values.publishedYear);
    if (!Number.isInteger(year) || year < 0 || year > nextYear) {
      errors.publishedYear = "Enter a year between 0 and next year.";
    }
  }

  return errors;
}

export function BookForm({
  initial,
  onSubmit,
  busy,
  submitLabel,
}: {
  initial?: Partial<Book>;
  onSubmit: (values: Omit<Book, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  busy: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<BookFormValues>(() => ({
    ...emptyValues,
    ...initial,
    publishedYear:
      initial?.publishedYear !== undefined
        ? String(initial.publishedYear)
        : "",
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookFormValues, string>>
  >({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setValues({
      ...emptyValues,
      ...initial,
      publishedYear:
        initial?.publishedYear !== undefined
          ? String(initial.publishedYear)
          : "",
    });
  }, [initial]);

  const update = <K extends keyof BookFormValues>(
    key: K,
    value: BookFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validate(values);
    setErrors(validation);
    setServerError("");

    if (Object.keys(validation).length > 0) return;

    try {
      await onSubmit({
        title: values.title.trim(),
        author: values.author.trim(),
        isbn: values.isbn.trim().toUpperCase(),
        category: values.category.trim() || "General",
        publishedYear: values.publishedYear
          ? Number(values.publishedYear)
          : undefined,
        available: values.available,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(
          error.status === 409
            ? "That ISBN already exists. Use a unique ISBN."
            : error.message
        );
        return;
      }

      setServerError("Unable to save the book. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {serverError && (
        <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          {serverError}
        </div>
      )}

      <Field label="Title" error={errors.title}>
        <input
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          className="form-input"
          maxLength={200}
          required
        />
      </Field>

      <Field label="Author" error={errors.author}>
        <input
          value={values.author}
          onChange={(event) => update("author", event.target.value)}
          className="form-input"
          maxLength={150}
          required
        />
      </Field>

      <Field label="ISBN" error={errors.isbn}>
        <input
          value={values.isbn}
          onChange={(event) => update("isbn", event.target.value)}
          className="form-input uppercase"
          maxLength={32}
          required
        />
      </Field>

      <Field label="Category" error={errors.category}>
        <input
          value={values.category}
          onChange={(event) => update("category", event.target.value)}
          className="form-input"
          maxLength={100}
        />
      </Field>

      <Field label="Published year" error={errors.publishedYear}>
        <input
          value={values.publishedYear}
          onChange={(event) => update("publishedYear", event.target.value)}
          className="form-input"
          type="number"
          min={0}
          max={nextYear}
        />
      </Field>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={values.available}
          onChange={(event) => update("available", event.target.checked)}
          className="h-4 w-4"
        />
        Available
      </label>

      <Button type="submit" disabled={busy}>
        {busy ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]">
        {label}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
