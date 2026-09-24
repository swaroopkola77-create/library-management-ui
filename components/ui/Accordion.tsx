"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Accordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={expanded}
              className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold"
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={19}
                className={"shrink-0 transition-transform " + (expanded ? "rotate-180" : "")}
                aria-hidden="true"
              />
            </button>
            {expanded && (
              <div className="max-w-3xl pb-6 pr-8 text-sm leading-6 text-zinc-500">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
