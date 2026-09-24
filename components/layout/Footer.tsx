import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2">
        <div>
          <div className="font-display text-3xl">SHELF</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A modern library interface for discovering and managing books.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm md:justify-end">
          <Link href="/books">Catalog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800">
        Library availability and borrowing rules are controlled by the library.
      </div>
    </footer>
  );
}
