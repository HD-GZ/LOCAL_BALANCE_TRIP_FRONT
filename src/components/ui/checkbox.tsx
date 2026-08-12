"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // 라디우스 2px, 올리브 체크. after 로 44px 터치 타깃을 확보한다.
        "peer border-line-control bg-surface text-brand-on relative flex size-4.5 shrink-0 cursor-pointer items-center justify-center rounded-xs border outline-none",
        "hover:border-brand transition-colors duration-(--dur-1)",
        "data-checked:border-brand data-checked:bg-brand",
        "aria-invalid:border-danger",
        "after:absolute after:-inset-x-3 after:-inset-y-3",
        "group-has-disabled/field:opacity-45 disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
