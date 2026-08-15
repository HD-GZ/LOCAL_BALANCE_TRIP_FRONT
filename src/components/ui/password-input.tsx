"use client";

import { forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useBooleanState } from "@/hooks/useBooleanState";

import { Input } from "./input";

const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ ...props }, ref) => {
    const { value: show, toggle } = useBooleanState();

    return (
      <div className="relative">
        <Input ref={ref} type={show ? "text" : "password"} className="pr-11" {...props} />
        <button
          type="button"
          className="text-ink-3 hover:text-ink absolute top-1/2 right-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xs transition-colors duration-(--dur-1)"
          onClick={toggle}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
