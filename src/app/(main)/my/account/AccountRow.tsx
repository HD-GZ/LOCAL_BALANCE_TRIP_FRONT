import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type AccountRowProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/** 라벨 열과 입력 열이 나란히 놓이는 마이페이지 전용 행 레이아웃. */
export default function AccountRow({
  label,
  required,
  optional,
  error,
  hint,
  className,
  children,
}: AccountRowProps) {
  return (
    <div className={cn("flex items-start gap-4.5 border-t border-[#EBE7DF] py-4", className)}>
      <p className="w-40 shrink-0 pt-2.5 text-[14px] font-medium whitespace-nowrap text-[#222019]">
        {label}
        {required && <span className="text-primary"> *</span>}
        {optional && <span className="text-[13px] text-[#928D84]"> (선택)</span>}
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {children}
        {error ? (
          <p className="text-[12px] text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-[12px] text-[#928D84]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
