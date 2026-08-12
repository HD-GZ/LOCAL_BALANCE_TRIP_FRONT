"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * 코스 순서 / 환급 증빙 전환. 이전 구현은 알약 안의 알약(흰 캡슐 + 그림자)이었다.
 * 밑줄 탭으로 바꿔 헤더의 다른 탭 패턴(Header 내비게이션)과 언어를 맞췄다.
 */
const tabClassName = [
  "text-body-sm relative block py-3 font-semibold transition-colors duration-(--dur-1)",
  "after:bg-brand after:absolute after:-bottom-px after:left-0 after:h-0.5",
  "after:transition-[width] after:duration-(--dur-2) after:ease-(--ease-out-quart)",
].join(" ");

export default function SavedCourseDetailTabs({ courseId }: { courseId: number }) {
  const pathname = usePathname();
  const orderHref = `/saved-courses/${courseId}`;
  const receiptsHref = `/saved-courses/${courseId}/receipts`;
  const isReceiptsActive = pathname.startsWith(receiptsHref);

  return (
    <nav className="border-line flex w-full items-center gap-6 border-b" aria-label="코스 상세">
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
              ? "text-brand-ink after:w-full"
              : "text-ink-3 hover:text-ink after:w-0 hover:after:w-full",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
