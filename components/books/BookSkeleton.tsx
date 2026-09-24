import { Skeleton } from "@/components/ui/Skeleton";

export function BookSkeleton() {
  return (
    <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Skeleton className="aspect-[4/5]" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
