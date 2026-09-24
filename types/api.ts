export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear?: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BooksResponse {
  success: true;
  data: Book[];
  pagination: Pagination;
}

export interface BookResponse {
  success: true;
  data: Book;
}

export interface HealthResponse {
  success: boolean;
  service?: string;
  database: "connected" | "disconnected";
  timestamp: string;
}
