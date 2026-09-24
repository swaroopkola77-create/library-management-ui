import type {
  Book,
  BookResponse,
  BooksResponse,
  HealthResponse,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError(500, "API URL is not configured.");
  }

  try {
    const response = await fetch(API_URL + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      cache: "no-store",
    });

    const body = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!response.ok) {
      const message =
        typeof body?.message === "string"
          ? body.message
          : "The request could not be completed.";

      const errors = Array.isArray(body?.errors)
        ? body.errors.filter(
            (value): value is string => typeof value === "string"
          )
        : undefined;

      throw new ApiError(response.status, message, errors);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      "Unable to reach the library service. Please try again."
    );
  }
}

export function getHealth() {
  return request<HealthResponse>("/health");
}

export function getBooks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  available?: boolean;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (typeof params?.available === "boolean") {
    searchParams.set("available", String(params.available));
  }

  const query = searchParams.toString();

  return request<BooksResponse>(
    "/api/books" + (query ? "?" + query : "")
  );
}

export function getBook(id: string) {
  return request<BookResponse>("/api/books/" + encodeURIComponent(id));
}

export function createBook(
  payload: Omit<Book, "_id" | "createdAt" | "updatedAt">
) {
  return request<BookResponse>("/api/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBook(
  id: string,
  payload: Partial<Omit<Book, "_id" | "createdAt" | "updatedAt">>
) {
  return request<BookResponse>(
    "/api/books/" + encodeURIComponent(id),
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteBook(id: string) {
  return request<{ success: true; message: string }>(
    "/api/books/" + encodeURIComponent(id),
    { method: "DELETE" }
  );
}

export function updateAvailability(id: string, available: boolean) {
  return request<BookResponse>(
    "/api/books/" + encodeURIComponent(id) + "/availability",
    {
      method: "PATCH",
      body: JSON.stringify({ available }),
    }
  );
}
