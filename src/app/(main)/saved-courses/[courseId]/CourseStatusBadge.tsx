import { Check } from "lucide-react";
import type { SavedCourseDetailResponse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Partial<
  Record<SavedCourseDetailResponse["status"], { label: string; className: string; dotClassName: string }>
> = {
  TRAVELING: {
    label: "여행 중",
    className: "border-[#E3C9BC] bg-[#F3E8E3] text-[#B5654A]",
    dotClassName: "bg-[#B5654A]",
  },
  COMPLETED: {
    label: "완주",
    className: "border-[#C4DDCD] bg-[#E7F0EA] text-[#2F6F4F]",
    dotClassName: "bg-[#2F6F4F]",
  },
};

export default function CourseStatusBadge({
  status,
}: {
  status: SavedCourseDetailResponse["status"];
}) {
  const badge = STATUS_BADGE[status];

  if (!badge) {
    return null;
  }

  return (
    <span
      className={cn(
        "flex h-6 items-center gap-1.5 rounded-full border pr-2.75 pl-2.25 text-[11.5px] font-semibold",
        badge.className,
      )}
    >
      {status === "COMPLETED" ? (
        <Check className="size-3" />
      ) : (
        <span className={cn("size-1.75 rounded-full", badge.dotClassName)} />
      )}
      {badge.label}
    </span>
  );
}
