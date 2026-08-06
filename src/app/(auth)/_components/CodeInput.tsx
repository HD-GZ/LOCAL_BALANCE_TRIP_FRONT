"use client";

import { type ClipboardEvent, type KeyboardEvent, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";

export const CODE_LENGTH = 6;

export function createEmptyCode() {
  return Array<string>(CODE_LENGTH).fill("");
}

type CodeInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export default function CodeInput({ value, onChange, disabled }: CodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isEmpty = value.every((digit) => !digit);

  // 진입 시와 코드가 초기화된 직후(재전송 등)에 첫 칸으로 포커스를 옮긴다.
  useEffect(() => {
    if (isEmpty) {
      inputRefs.current[0]?.focus();
    }
  }, [isEmpty]);

  const handleChange = (index: number, nextInputValue: string) => {
    const nextDigit = nextInputValue.replace(/\D/g, "").slice(-1);
    const nextCode = [...value];
    nextCode[index] = nextDigit;
    onChange(nextCode);

    if (nextDigit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH - index);

    if (!pastedDigits) {
      return;
    }

    event.preventDefault();

    const nextCode = [...value];
    pastedDigits.split("").forEach((digit, offset) => {
      nextCode[index + offset] = digit;
    });

    onChange(nextCode);

    const nextFocusIndex = Math.min(index + pastedDigits.length, CODE_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex h-15 gap-2.5">
      {value.map((digit, index) => (
        <Input
          key={index}
          aria-label={`인증 코드 ${index + 1}번째 자리`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className="h-full w-12.5 rounded-[13px] text-center text-xl font-semibold"
        />
      ))}
    </div>
  );
}
