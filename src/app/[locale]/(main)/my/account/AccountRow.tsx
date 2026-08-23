import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type AccountRowProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  optionalLabel?: string;
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
  optionalLabel,
  error,
  hint,
  className,
  children,
}: AccountRowProps) {
  return (
    <div
      className={cn(
        "border-line flex flex-col gap-2 border-t py-4 sm:flex-row sm:items-start sm:gap-6",
        className,
      )}
    >
      <p className="text-ink text-cap shrink-0 pt-2.5 whitespace-nowrap sm:w-36">
        {label}
        {required && <span className="text-danger-ink"> *</span>}
        {optional && <span className="text-ink-3 font-normal">{optionalLabel}</span>}
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {children}
        {error ? (
          <p role="alert" className="text-danger-ink text-cap font-medium">
            {error}
          </p>
        ) : hint ? (
          <p className="text-ink-3 text-cap font-normal">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
