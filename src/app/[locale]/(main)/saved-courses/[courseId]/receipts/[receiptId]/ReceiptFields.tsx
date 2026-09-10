"use client";

import { useId, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPaidDate } from "@/features/receipts/utils";

import ReceiptDateCalendar from "./ReceiptDateCalendar";

/**
 * 증빙 필드. 이전 구현은 연필 아이콘을 눌러야 input 으로 바뀌는 방식이었다 —
 * 수정 가능하다는 사실이 보이지 않고, 라벨과 입력의 관계도 없었다.
 *
 * 항상 편집 가능한 입력으로 바꾸고 좌측에 라벨을 두었다 (DESIGN.md §8).
 * 필드 이름과 순서는 그대로다 (PRODUCT.md).
 */

const rowClassName = "flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4";
const labelClassName = "text-ink-2 text-cap w-20 shrink-0";
const inputClassName =
  "text-title-3 text-ink placeholder:text-ink-3 min-w-0 flex-1 rounded-xs bg-transparent px-2 py-1 outline-none transition-colors duration-(--dur-1) hover:bg-surface-2 focus-visible:bg-surface-2";

type ReceiptFieldsProps = {
  merchantName: string;
  onMerchantNameChange: (value: string) => void;
  amount: number;
  onAmountChange: (value: number) => void;
  paidDate: string;
  onPaidDateChange: (value: string) => void;
};

export default function ReceiptFields({
  merchantName,
  onMerchantNameChange,
  amount,
  onAmountChange,
  paidDate,
  onPaidDateChange,
}: ReceiptFieldsProps) {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const baseId = useId();
  const isMerchantNameEmpty = merchantName.trim().length === 0;
  const t = useTranslations("receipts");

  return (
    <div className="border-line divide-line bg-surface flex w-full flex-col divide-y rounded-md border">
      <div className={rowClassName}>
        <label className={labelClassName} htmlFor={`${baseId}-merchant`}>
          {t("fields.merchantLabel")}
        </label>
        <input
          id={`${baseId}-merchant`}
          name="merchantName"
          type="text"
          value={merchantName}
          aria-invalid={isMerchantNameEmpty}
          onChange={(event) => onMerchantNameChange(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className={rowClassName}>
        <label className={labelClassName} htmlFor={`${baseId}-amount`}>
          {t("fields.amountLabel")}
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <input
            id={`${baseId}-amount`}
            name="amount"
            type="text"
            inputMode="numeric"
            value={amount.toLocaleString()}
            onChange={(event) => onAmountChange(Number(event.target.value.replace(/\D/g, "")) || 0)}
            className={`${inputClassName} text-right tabular-nums`}
          />
          <span className="text-ink-2 text-body-sm shrink-0">{t("fields.currencyUnit")}</span>
        </div>
      </div>

      <div className={rowClassName}>
        <span className={labelClassName} id={`${baseId}-date-label`}>
          {t("fields.dateLabel")}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-title-3 text-ink flex-1 px-2 tabular-nums">
            {formatPaidDate(paidDate)}
          </span>
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-labelledby={`${baseId}-date-label`}
                aria-label={t("fields.dateEditAria")}
                className="press border-line-control text-ink-2 text-cap hover:bg-surface-2 flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5"
              >
                <CalendarDays className="size-3.5" strokeWidth={1.75} aria-hidden />
                {t("fields.dateChange")}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <ReceiptDateCalendar
                value={paidDate}
                onSelect={(date) => {
                  onPaidDateChange(date);
                  setIsDatePopoverOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
