import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SavedCoursePagerProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const pagerButtonClassName =
  "flex size-9 items-center justify-center rounded-[10px] border text-[13.5px]";

export default function SavedCoursePager({
  page,
  totalPages,
  onPageChange,
}: SavedCoursePagerProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <button
        type="button"
        className={cn(
          pagerButtonClassName,
          "border-[#EBE7DF] bg-white",
          page <= 1 && "cursor-not-allowed opacity-40",
        )}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4 text-[#928D84]" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={cn(
            pagerButtonClassName,
            "font-mono font-medium",
            pageNumber === page
              ? "border-[#2F6F4F] bg-[#2F6F4F] text-white"
              : "border-[#EBE7DF] bg-white text-[#5F5B53]",
          )}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        className={cn(
          pagerButtonClassName,
          "border-[#EBE7DF] bg-white",
          page >= totalPages && "cursor-not-allowed opacity-40",
        )}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4 text-[#928D84]" />
      </button>
    </div>
  );
}
