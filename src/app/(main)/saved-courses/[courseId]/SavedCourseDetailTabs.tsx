"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * 코스 순서 / 환급 증빙 전환. 이전 구현은 알약 안의 알약(흰 캡슐 + 그림자)이었다.
 * 밑줄 탭으로 바꿔 헤더의 다른 탭 패턴(Header 내비게이션)과 언어를 맞췄다.
 */
const tabClassName =
  "text-body-sm flex h-9.5 items-center justify-center rounded-full px-5.5 font-semibold transition-colors duration-(--dur-1)";

export default function SavedCourseDetailTabs({ courseId }: { courseId: number }) {
  const pathname = usePathname();
  const orderHref = `/saved-courses/${courseId}`;
  const receiptsHref = `/saved-courses/${courseId}/receipts`;
  const isReceiptsActive = pathname.startsWith(receiptsHref);

  return (
    <nav
      className="bg-paper-sunk flex w-fit items-center gap-0.5 rounded-full p-1"
      aria-label="코스 상세"
    >
      {[
        { href: orderHref, label: "코스 순서", active: !isReceiptsActive },
        { href: receiptsHref, label: "환급 증빙", active: isReceiptsActive },
      ].map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            tabClassName,
            tab.active
              ? "bg-surface text-brand-ink shadow-[0_1px_2px_0_rgb(40_36_28/0.08)]"
              : "text-ink-3 hover:text-ink",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
