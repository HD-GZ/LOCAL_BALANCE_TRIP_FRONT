import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

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
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-label text-[13px]">
        {label}
        {required && <span className="text-primary"> *</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-[12px] text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-muted-foreground text-[12px]">{hint}</p>
      ) : null}
    </div>
  );
}

export { FormField };
