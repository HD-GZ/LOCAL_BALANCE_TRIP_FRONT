import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * 버튼. DESIGN.md §5, §7, §8.
 *
 * 사이즈가 실제 쓰임에 맞게 정의되어 있으므로 호출부에서 높이를 덮어쓰지 않는다.
 * 주 CTA = size="xl", 폼 제출 = size="lg", 인라인 액션 = 기본값.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center",
    "border border-transparent bg-clip-padding font-semibold whitespace-nowrap select-none",
    "outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
    // 누름 피드백 + 상태 전이 (globals.css @layer utilities)
    "press",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-on hover:bg-brand-hover active:bg-brand-press",
        outline: "border-line-control bg-surface text-ink hover:bg-surface-2 hover:border-ink-3",
        secondary: "bg-surface-2 text-ink hover:bg-paper-sunk",
        ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
        destructive: "bg-danger text-danger-on hover:brightness-95 active:brightness-90",
        /** 파괴적 행동을 확인 전에 노출할 때 */
        "destructive-outline": "border-danger/40 text-danger-ink hover:bg-danger-wash",
        link: "text-brand-ink h-auto p-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 rounded-sm px-4 text-body-sm",
        xs: "h-7 gap-1 rounded-xs px-2 text-cap [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 gap-1.5 rounded-sm px-3 text-body-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 rounded-sm px-5 text-body",
        /** 표면의 주 CTA */
        xl: "h-13 gap-2 rounded-sm px-6 text-body",
        icon: "size-10 rounded-sm",
        "icon-xs": "size-7 rounded-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8.5 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
