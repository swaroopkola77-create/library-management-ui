"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme toggle"
        className="inline-flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-zinc-700"
      >
        <Moon size={17} aria-hidden="true" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center border border-zinc-300 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
