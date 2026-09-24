import type { ReactNode } from "react";

export function Carousel({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
      <div className="flex min-w-max gap-5 pb-3">{children}</div>
    </div>
  );
}
