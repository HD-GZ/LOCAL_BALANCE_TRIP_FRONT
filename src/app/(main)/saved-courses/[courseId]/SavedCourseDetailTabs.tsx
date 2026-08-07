"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SavedCourseDetailTabs({ courseId }: { courseId: number }) {
  const pathname = usePathname();
  const orderHref = `/saved-courses/${courseId}`;
  const receiptsHref = `/saved-courses/${courseId}/receipts`;
  const isReceiptsActive = pathname === receiptsHref;

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-[#E9E5DC] p-1">
      <Link
        href={orderHref}
        className={cn(
          "flex h-9.5 items-center justify-center rounded-full px-5.5 text-[14px] font-semibold tracking-[-0.14px]",
          !isReceiptsActive
            ? "bg-white text-[#2F6F4F] shadow-[0_1px_2px_0_rgba(40,36,28,0.08)]"
            : "text-[#928D84]",
        )}
      >
        코스 순서
      </Link>
      <Link
        href={receiptsHref}
        className={cn(
          "flex h-9.5 items-center justify-center rounded-full px-5.5 text-[14px] font-semibold tracking-[-0.14px]",
          isReceiptsActive
            ? "bg-white text-[#2F6F4F] shadow-[0_1px_2px_0_rgba(40,36,28,0.08)]"
            : "text-[#928D84]",
        )}
      >
        환급 증빙
      </Link>
    </div>
  );
}
