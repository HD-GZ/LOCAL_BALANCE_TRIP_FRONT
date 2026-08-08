"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/features/auth/api";
import { isResetTokenInvalidCode } from "@/features/auth/passwordReset";
import { clearPasswordResetSession } from "@/features/auth/passwordResetStorage";
import { getFieldErrors, isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

const hasLetterAndDigit = (value: string) => /(?=.*[a-zA-Z])(?=.*\d)/.test(value);
const hasMinLength = (value: string) => value.length >= 8;

const PASSWORD_RULES = [
  { label: "영문 · 숫자 조합", test: hasLetterAndDigit },
  { label: "8자 이상", test: hasMinLength },
] as const;

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 해요.")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "영문·숫자를 포함해 주세요."),
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해 주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof schema>;

type ResetPasswordFormProps = {
  resetToken: string;
};

export default function ResetPasswordForm({ resetToken }: ResetPasswordFormProps) {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({ control, name: "newPassword" });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      clearPasswordResetSession();
      router.replace("/find-password/complete");
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: "비밀번호 변경 중 오류가 발생했습니다." });
        return;
      }

      // 토큰이 만료·사용됨 상태라면 처음 단계부터 다시 진행해야 한다.
      if (isResetTokenInvalidCode(error.code)) {
        clearPasswordResetSession();
        router.replace("/find-password");
        return;
      }

      const fieldError = getFieldErrors(error).find(({ field }) => field === "newPassword");

      setError(fieldError ? "newPassword" : "root", {
        message: fieldError ? fieldError.message : error.message,
      });
    },
  });

  const onSubmit = ({ newPassword: password }: ResetPasswordFormValues) => {
    clearErrors("root");
    resetPasswordMutation.mutate({ resetToken, newPassword: password });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="새 비밀번호" required error={errors.newPassword?.message}>
        <PasswordInput
          {...register("newPassword")}
          autoComplete="new-password"
          placeholder="영문·숫자 8자 이상"
        />
      </FormField>

      <ul className="-mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {PASSWORD_RULES.map(({ label, test }) => {
          const isSatisfied = test(newPassword ?? "");

          return (
            <li key={label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-3 items-center justify-center rounded-full",
                  isSatisfied ? "bg-primary text-white" : "bg-[#E9E5DC] text-transparent",
                )}
              >
                <Check className="size-2" strokeWidth={4} />
              </span>
              <span
                className={cn(
                  "text-[12px]",
                  isSatisfied ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
                <span className="sr-only">{isSatisfied ? " 충족" : " 미충족"}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <FormField label="새 비밀번호 확인" required error={errors.confirmPassword?.message}>
        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          placeholder="다시 입력"
        />
      </FormField>

      {errors.root?.message && <p className="text-[12px] text-red-500">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="h-auto w-full rounded-lg py-3.25 text-[14px] font-semibold"
      >
        {resetPasswordMutation.isPending ? "변경 중..." : "비밀번호 변경하기"}
      </Button>
    </form>
  );
}
