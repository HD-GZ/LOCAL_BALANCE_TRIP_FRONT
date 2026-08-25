"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * 코스 순서 / 환급 증빙 / 리포트 전환.
 * 코스 순서는 나머지 둘이 아닐 때 활성이므로 마지막에 판별한다.
 *
 * 비활성 라벨은 `ink-2`를 쓴다. `ink-3`은 paper·surface 위에서만 4.5:1을 넘고
 * 이 트랙의 `paper-sunk` 위에서는 4.21:1로 미달한다 (DESIGN.md §3).
 */
const tabClassName =
  "text-body-sm flex h-9.5 items-center justify-center rounded-full px-5.5 font-semibold transition-colors duration-(--dur-1)";

export default function SavedCourseDetailTabs({ courseId }: { courseId: number }) {
  const t = useTranslations("savedCourses.courseDetail.tabs");
  const pathname = usePathname();
  const orderHref = `/saved-courses/${courseId}`;
  const receiptsHref = `/saved-courses/${courseId}/receipts`;
  const reportHref = `/saved-courses/${courseId}/report`;
  const isReceiptsActive = pathname.startsWith(receiptsHref);
  const isReportActive = pathname.startsWith(reportHref);

  return (
    <nav
      className="bg-paper-sunk flex w-fit items-center gap-0.5 rounded-full p-1"
      aria-label={t("ariaLabel")}
    >
      {[
        { href: orderHref, label: t("order"), active: !isReceiptsActive && !isReportActive },
        { href: receiptsHref, label: t("receipts"), active: isReceiptsActive },
        { href: reportHref, label: t("report"), active: isReportActive },
      ].map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            tabClassName,
            tab.active
              ? "bg-surface text-brand-ink shadow-[0_1px_2px_0_rgb(40_36_28/0.08)]"
              : "text-ink-2 hover:text-ink",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
