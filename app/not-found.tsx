import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">404</p>
      <h1 className="mt-4 font-display text-7xl leading-none sm:text-9xl">PAGE NOT FOUND.</h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">The page you requested does not exist.</p>
      <Link href="/" className="mt-8 inline-flex border border-zinc-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] dark:border-zinc-700">Back home</Link>
    </div>
  );
}
