import * as React from "react";

import { cn } from "@/lib/utils";

/** 인풋. DESIGN.md §5 (라디우스 2px), §8 (대비·포커스). */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-line-control bg-surface text-ink text-body h-11 w-full min-w-0 rounded-xs border px-3.5",
        "placeholder:text-ink-3 placeholder:font-normal",
        "transition-colors duration-(--dur-1) outline-none",
        "hover:border-ink-3 focus-visible:border-brand",
        "disabled:bg-surface-2 disabled:text-ink-3 disabled:cursor-not-allowed",
        "aria-invalid:border-danger aria-invalid:bg-danger-wash/40",
        "file:text-ink file:mr-3 file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
