import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/**
 * 페이지 이동. 페이지 번호는 세는 값이므로 고정폭이다 (DESIGN.md §6 규칙 2).
 * 페이지가 많아지면 앞뒤 2개와 양 끝만 남기고 줄인다 — 20개 버튼이 늘어서는 것을 막는다.
 */

const buttonBase =
  "press text-body-sm flex size-9 cursor-pointer items-center justify-center rounded-sm border disabled:cursor-not-allowed disabled:opacity-40";

function toPageItems(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const visible = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return visible.flatMap((value, index) => {
    const previous = visible[index - 1];
    return previous !== undefined && value - previous > 1 ? ["gap" as const, value] : [value];
  });
}

type SavedCoursePagerProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SavedCoursePager({
  page,
  totalPages,
  onPageChange,
}: SavedCoursePagerProps) {
  const t = useTranslations("savedCourses");
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex w-full items-center justify-center gap-1.5" aria-label={t("pager.nav")}>
      <button
        type="button"
        aria-label={t("pager.previous")}
        className={cn(buttonBase, "border-line-control text-ink-2 hover:bg-surface-2")}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} />
      </button>

      {toPageItems(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="text-ink-3 text-body-sm w-4 text-center">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            aria-label={t("pager.pageAria", { page: item })}
            className={cn(
              buttonBase,
              "tabular-nums",
              item === page
                ? "border-brand bg-brand text-brand-on font-semibold"
                : "border-line-control text-ink-2 hover:bg-surface-2",
            )}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label={t("pager.next")}
        className={cn(buttonBase, "border-line-control text-ink-2 hover:bg-surface-2")}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </button>
    </nav>
  );
}
