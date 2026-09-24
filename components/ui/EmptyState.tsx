import { LibraryBig } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet.",
  message = "Try a different search or filter.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-zinc-300 px-6 text-center dark:border-zinc-700">
      <LibraryBig size={32} strokeWidth={1.5} />
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{message}</p>
    </div>
  );
}
