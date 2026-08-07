"use client";

import { useState } from "react";
import { PencilLine, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPaidDate } from "@/features/receipts/utils";
import ReceiptDateCalendar from "./ReceiptDateCalendar";

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
  const [isEditingMerchantName, setIsEditingMerchantName] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-[14px] border border-[#EBE7DF] bg-white">
      <div className="flex w-full items-center gap-3.5 border-b border-b-[#EBE7DF] px-4.5 py-3.75">
        <p className="w-22 shrink-0 text-[13px] font-medium text-[#928D84]">가맹점명</p>
        {isEditingMerchantName ? (
          <input
            type="text"
            autoFocus
            value={merchantName}
            onChange={(event) => onMerchantNameChange(event.target.value)}
            onBlur={() => setIsEditingMerchantName(false)}
            onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
            className="flex-1 text-[16px] font-semibold tracking-[-0.16px] text-[#222019] outline-none"
          />
        ) : (
          <p className="flex-1 text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
            {merchantName}
          </p>
        )}
        <button type="button" onClick={() => setIsEditingMerchantName(true)}>
          <PencilLine className="size-3.5 shrink-0 cursor-pointer text-[#928D84]" />
        </button>
      </div>
      <div className="flex w-full items-center gap-3.5 border-b border-b-[#EBE7DF] px-4.5 py-3.75">
        <p className="w-22 shrink-0 text-[13px] font-medium text-[#928D84]">금액</p>
        {isEditingAmount ? (
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            value={amount}
            onChange={(event) => onAmountChange(Number(event.target.value.replace(/\D/g, "")) || 0)}
            onBlur={() => setIsEditingAmount(false)}
            onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
            className="flex-1 font-mono text-[16px] font-semibold tracking-[-0.16px] text-[#222019] outline-none"
          />
        ) : (
          <p className="flex-1 font-mono text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
            {amount.toLocaleString()}
          </p>
        )}
        <button type="button" onClick={() => setIsEditingAmount(true)}>
          <PencilLine className="size-3.5 shrink-0 cursor-pointer text-[#928D84]" />
        </button>
      </div>
      <div className="flex w-full items-center gap-3.5 px-4.5 py-3.75">
        <p className="w-22 shrink-0 text-[13px] font-medium text-[#928D84]">날짜</p>
        <p className="flex-1 font-mono text-[16px] font-semibold tracking-[-0.16px] text-[#222019]">
          {formatPaidDate(paidDate)}
        </p>
        <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <button type="button">
              <Calendar className="size-3.5 shrink-0 cursor-pointer text-[#928D84]" />
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
  );
}
