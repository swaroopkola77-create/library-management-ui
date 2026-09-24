import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({
  children,
  href,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles = {
    primary:
      "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950",
    secondary:
      "border border-zinc-300 bg-white/70 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:bg-zinc-800",
    ghost: "hover:opacity-60",
  };

  const classes = `inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${className}`;

  if (href) {
    return <Link className={classes} href={href}>{children}</Link>;
  }

  return <button className={classes} type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}
