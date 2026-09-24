import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "live" | "muted";
}) {
  const styles = {
    default:
      "border-zinc-300 bg-white/70 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
    live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    muted:
      "border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
  };

  return (
    <span
      className={
        "inline-flex items-center gap-2 border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] " +
        styles[tone]
      }
    >
      {children}
    </span>
  );
}
