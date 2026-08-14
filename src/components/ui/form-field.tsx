import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

/**
 * 폼 필드. DESIGN.md §8.
 * 라벨은 항상 인풋 위에, 오류는 항상 인풋 바로 아래. placeholder 를 라벨로 쓰지 않는다.
 */
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

function FormField({ label, required, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-ink text-cap">
        {label}
        {required && (
          <span className="text-danger-ink" aria-label="필수">
            *
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {error}
        </p>
      ) : hint ? (
        <p className="text-ink-3 text-cap font-normal">{hint}</p>
      ) : null}
    </div>
  );
}

export { FormField };
