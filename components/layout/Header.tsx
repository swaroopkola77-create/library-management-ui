"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-paper/90 backdrop-blur dark:border-zinc-800 dark:bg-ink/90">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Shelf home"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-current text-sm font-bold">
            S
          </span>
          <span className="font-display text-3xl tracking-wide">SHELF</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/books" className="text-sm font-medium">Catalog</Link>
          <Link href="/#how-it-works" className="text-sm font-medium">How it works</Link>
          <ThemeToggle />
          <Button href="/admin" variant="secondary" className="px-4 py-2">
            Admin
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center border border-zinc-300 md:hidden dark:border-zinc-700"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/books" onClick={() => setOpen(false)}>
              Catalog
            </Link>
            <Link href="/#how-it-works" onClick={() => setOpen(false)}>
              How it works
            </Link>
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Button href="/admin" variant="secondary">Admin</Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
