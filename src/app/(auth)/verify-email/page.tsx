"use client";

import { type KeyboardEvent, useRef, useState } from "react";

import SignupStepper from "@/app/(auth)/_components/SignupStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

export default function VerifyEmailPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isCodeComplete = code.every(Boolean);

  const handleCodeChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);

    if (nextValue && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-12">
      <h1 className="text-center font-bold">로컬밸런스 트립</h1>
      <main className="flex w-full max-w-110 flex-col rounded-[18px] bg-white px-11 py-10 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        <SignupStepper currentStep="verify-email" />
        <div className="flex flex-col gap-1.5 pb-5 text-center">
          <p className="text-foreground text-2xl font-semibold">이메일을 확인해 주세요</p>
          <p className="text-label text-[14px]">
            local@email.com 으로 <br /> 6자리 인증 코드를 보냈어요.
          </p>
        </div>
        <div className="flex h-15 gap-2.5">
          {code.map((digit, index) => (
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
              value={digit}
              onChange={(event) => handleCodeChange(index, event.target.value)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              className="h-full w-12.5 rounded-[13px] text-center text-xl font-semibold"
            />
          ))}
        </div>
        <div className="mt-5 flex w-full gap-2.5">
          <Button
            variant="outline"
            className="text-foreground h-12.5 flex-1 rounded-xl border-[#C3BDB3] bg-white text-[15px] hover:bg-white"
          >
            코드 재전송
          </Button>
          <Button
            disabled={!isCodeComplete}
            className={cn(
              "h-12.5 flex-1 rounded-xl text-[15px]",
              !isCodeComplete &&
                "text-placeholder border border-[#EBE7DF] bg-[#E9E5DC] disabled:opacity-100",
            )}
          >
            인증 완료
          </Button>
        </div>
      </main>
    </div>
  );
}
