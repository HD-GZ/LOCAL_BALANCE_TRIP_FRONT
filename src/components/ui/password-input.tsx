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
        <Input ref={ref} type={show ? "text" : "password"} {...props} />
        <button
          type="button"
          className="text-placeholder absolute top-1/2 right-3 -translate-y-1/2"
          onClick={toggle}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
