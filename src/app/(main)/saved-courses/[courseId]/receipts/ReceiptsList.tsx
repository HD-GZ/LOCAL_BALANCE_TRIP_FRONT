import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ReceiptIcon from "@/assets/receipt.svg";
import SurfaceState from "@/components/common/SurfaceState";
import type { Receipt } from "@/features/receipts/types";
import { formatPaidDate } from "@/features/receipts/utils";

/**
 * 영수증 목록. 이 표면이 제품에서 가장 장부다운 자리다 —
 * 금액과 날짜 모두 고정폭이고, 금액은 오른쪽 정렬해 자리수가 맞는다 (DESIGN.md §6 규칙 2).
 */
export default function ReceiptsList({
  receipts,
  savedCourseId,
}: {
  receipts: Receipt[];
  savedCourseId: number;
}) {
  if (receipts.length === 0) {
    return (
      <SurfaceState
        title="저장된 영수증이 없어요"
        description="여행하면서 영수증을 남기면 여기에 기록이 쌓여요. 촬영과 인식은 앱에서 할 수 있어요."
      />
    );
  }

  const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  return (
    <div className="flex w-full flex-col">
      <ul className="border-line divide-line flex w-full flex-col divide-y border-y">
        {receipts.map((receipt) => (
          <li key={receipt.receiptId}>
            <Link
              href={`/saved-courses/${savedCourseId}/receipts/${receipt.receiptId}`}
              className="group hover:bg-surface-2 -mx-3 flex items-center gap-3.5 rounded-sm px-3 py-3.5 transition-colors duration-(--dur-1)"
            >
              <span className="border-line bg-surface-2 flex size-10 shrink-0 items-center justify-center rounded-sm border">
                <ReceiptIcon className="text-ink-2 size-4.5" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-title-3 text-ink group-hover:text-brand-ink truncate transition-colors duration-(--dur-1)">
                  {receipt.merchantName}
                </span>
                <span className="text-ink-3 text-cap tabular-nums">
                  {formatPaidDate(receipt.paidDate)}
                </span>
              </span>
              <span className="text-num text-ink shrink-0 font-semibold tabular-nums">
                {receipt.amount.toLocaleString()}원
              </span>
              <ChevronRight
                aria-hidden
                strokeWidth={1.75}
                className="text-ink-3 group-hover:text-brand-ink size-4 shrink-0 transition-all duration-(--dur-2) group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-body-sm text-ink-2 flex items-baseline justify-between gap-4 pt-4">
        <span>
          영수증 <span className="text-ink font-semibold tabular-nums">{receipts.length}</span>건
        </span>
        <span>
          합계{" "}
          <span className="text-ink text-num font-semibold tabular-nums">
            {total.toLocaleString()}원
          </span>
        </span>
      </p>
    </div>
  );
}
