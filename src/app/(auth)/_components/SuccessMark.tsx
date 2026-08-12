import { Check } from "lucide-react";

/** 완료 표식. 원형은 표식(marker) 용도이므로 full 라디우스를 쓴다 (DESIGN.md §5). */
export default function SuccessMark() {
  return (
    <div className="flex w-full justify-center">
      <span className="border-brand/40 bg-brand-wash text-brand-ink flex size-16 items-center justify-center rounded-full border">
        <Check className="size-7" strokeWidth={2} aria-hidden />
      </span>
    </div>
  );
}
