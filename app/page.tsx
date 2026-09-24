"use client";

import Link from "next/link";
import { ArrowRight, LibraryBig, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Carousel } from "@/components/ui/Carousel";
import { Marquee } from "@/components/ui/Marquee";
import { getBooks, getHealth } from "@/lib/api";
import type { Book } from "@/types/api";

const marquee = ["FICTION","SCIENCE","HISTORY","BIOGRAPHY","TECHNOLOGY","SELF HELP","FANTASY","ROMANCE"];

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(0);
  const [apiLive, setApiLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getBooks({ page: 1, limit: 8 }),
      getBooks({ page: 1, limit: 1, available: true }),
      getHealth(),
    ])
      .then(([bookResult, availableResult, health]) => {
        if (cancelled) return;
        setBooks(bookResult.data);
        setTotal(bookResult.pagination.total);
        setAvailable(availableResult.pagination.total);
        setApiLive(health.success);
      })
      .catch(() => {
        if (!cancelled) {
          setBooks([]);
          setTotal(0);
          setAvailable(0);
          setApiLive(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category).filter(Boolean))).slice(0, 8),
    [books]
  );

  const fallbackCategories = ["Fiction", "Technology", "History", "Biography"];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.04)_1px,transparent_1px)] [background-size:44px_44px] dark:opacity-20" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-32">
          <div>
            <Badge tone={loading ? "muted" : apiLive ? "live" : "muted"}>
              <span className={"h-2 w-2 rounded-full " + (apiLive ? "bg-emerald-500" : "bg-zinc-400")} />
              {loading ? "Connecting to library" : apiLive ? "Library service live" : "Service unavailable"}
            </Badge>

            <h1 className="mt-5 max-w-4xl font-display text-[clamp(4rem,10vw,8.5rem)] leading-[0.86] tracking-tight">
              READ.<br />BORROW.<br />REPEAT.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Find your next book, check availability, and keep your reading moving.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/books">
                Browse books <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button href="/#how-it-works" variant="secondary">How it works</Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:grid-cols-3">
              {[["Books", loading ? "—" : total], ["Available", loading ? "—" : available], ["Service", loading ? "..." : apiLive ? "LIVE" : "OFF"]].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="font-display text-4xl">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-xl" aria-hidden="true">
              <motion.div
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 border border-zinc-300 dark:border-zinc-700"
              />
              <div className="absolute inset-16 -rotate-3 border border-zinc-300 dark:border-zinc-700" />
              <div className="absolute inset-24 flex items-center justify-center border border-zinc-300 bg-white/60 dark:border-zinc-700 dark:bg-zinc-950/70">
                <LibraryBig size={110} strokeWidth={1.3} />
              </div>
              <Sparkles className="absolute right-12 top-12 animate-pulse" size={25} />
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-zinc-200 py-5 dark:border-zinc-800">
        <Marquee>
          {marquee.map((item, index) => (
            <span key={item + index} className="mx-8 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              {item} <span className="text-accent">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">01 · Pick your shelf</p>
        <h2 className="mt-3 font-display text-6xl leading-none sm:text-8xl">YOUR CATEGORIES.</h2>
        <div className="mt-8">
          <Carousel>
            {(categories.length ? categories : fallbackCategories).map((category) => (
              <Link
                key={category}
                href={"/books?search=" + encodeURIComponent(category)}
                className="group min-w-[260px] border border-zinc-300 bg-white p-6 transition hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-950"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Category</p>
                <h3 className="mt-20 font-display text-4xl transition-transform group-hover:translate-x-1">
                  {category.toUpperCase()}
                </h3>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">02 · Featured books</p>
          <div className="mt-3 flex items-end justify-between gap-6">
            <h2 className="font-display text-6xl leading-none sm:text-8xl">FRESH OFF THE SHELF.</h2>
            <Link href="/books" className="hidden text-sm font-semibold md:block">View all →</Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book, index) => (
              <motion.article
                key={book._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-zinc-200 via-zinc-50 to-zinc-300 p-5 dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900">
                  <div className="flex h-full flex-col justify-between border border-zinc-400/60 p-5 dark:border-zinc-700">
                    <div className="flex justify-between gap-4 text-xs uppercase tracking-[0.18em]">
                      <span>SHELF</span><span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <span className="font-display text-5xl">{book.title.slice(0, 1).toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone={book.available ? "live" : "muted"}>{book.available ? "Available" : "Checked out"}</Badge>
                    <span className="text-xs text-zinc-500">{book.category}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{book.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{book.author}</p>
                  <Link className="mt-5 inline-block text-sm font-semibold hover:opacity-60" href={"/books/" + book._id}>View details →</Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/books" className="text-sm font-semibold">View all books →</Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">03 · How it works</p>
        <h2 className="mt-3 font-display text-6xl leading-none sm:text-8xl">KEEP IT SIMPLE.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["01", "Find a book"],
            ["02", "Check availability"],
            ["03", "Visit the desk"],
            ["04", "Return on time"],
          ].map(([number, title]) => (
            <div key={number} className="border-t-2 border-zinc-900 pt-6 dark:border-white">
              <p className="font-display text-5xl">{number}</p>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">Follow the library process and keep your reading list moving.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">04 · FAQ</p>
          <h2 className="mt-3 font-display text-6xl leading-none sm:text-8xl">GOOD TO KNOW.</h2>
          <div className="mt-10">
            <Accordion
              items={[
                { question: "What are the opening hours?", answer: "Library opening hours are controlled by the institution. Replace this text with your current official timetable." },
                { question: "How many books can I borrow?", answer: "Borrowing limits depend on your institution. Replace this with the library's actual lending policy." },
                { question: "Are there late fees?", answer: "Late-return rules vary by library. Replace this with the official late-return and fee policy." },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
