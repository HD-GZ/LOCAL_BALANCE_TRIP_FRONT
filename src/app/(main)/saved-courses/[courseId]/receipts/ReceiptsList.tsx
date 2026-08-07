import Link from "next/link";
import ChevronRight from "@/assets/chevronRight.svg";
import ReceiptIcon from "@/assets/receipt.svg";
import type { Receipt } from "@/features/receipts/types";
import { formatPaidDate } from "@/features/receipts/utils";
import { cn } from "@/lib/utils";

export default function ReceiptsList({
  receipts,
  savedCourseId,
}: {
  receipts: Receipt[];
  savedCourseId: number;
}) {
  if (receipts.length === 0) {
    return (
      <p className="flex w-full justify-center py-10 text-[13px] text-[#928D84]">
        저장된 영수증이 없어요.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-start rounded-[14px] bg-white">
      {receipts.map((receipt, index) => (
        <Link
          href={`/saved-courses/${savedCourseId}/receipts/${receipt.receiptId}`}
          key={receipt.receiptId}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3.5 px-4.5 py-4",
            index > 0 && "border-t border-t-[#EBE7DF]",
          )}
        >
          <span className="flex size-10.5 shrink-0 items-center justify-center rounded-[10px] bg-[#E7F0EA]">
            <ReceiptIcon className="size-5" />
          </span>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
              {receipt.merchantName}
            </span>
            <span className="text-[13px] text-[#928D84]">{formatPaidDate(receipt.paidDate)}</span>
          </div>
          <span className="text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
            {receipt.amount.toLocaleString()}원
          </span>
          <ChevronRight className="size-4.5 shrink-0" />
        </Link>
      ))}
    </div>
  );
}
