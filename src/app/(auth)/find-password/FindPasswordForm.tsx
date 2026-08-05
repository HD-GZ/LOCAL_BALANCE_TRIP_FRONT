"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { requestPasswordResetCode } from "@/features/auth/api";
import {
  DEFAULT_VERIFICATION_CODE_EXPIRES_IN,
  PASSWORD_RESET_ERROR_CODE,
} from "@/features/auth/passwordReset";
import { savePasswordResetCodeRequest } from "@/features/auth/passwordResetStorage";
import { isApiError } from "@/lib/api/error";

const schema = z.object({
  email: z.email("올바른 이메일 형식을 입력해 주세요."),
});

type FindPasswordFormValues = z.infer<typeof schema>;

export default function FindPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const goToVerifyStep = (email: string, verificationCodeExpiresIn: number) => {
    savePasswordResetCodeRequest({ email, verificationCodeExpiresIn });
    router.push("/find-password/verify");
  };

  const requestCodeMutation = useMutation({
    mutationFn: requestPasswordResetCode,
    onSuccess: ({ verificationCodeExpiresIn }, { email }) => {
      goToVerifyStep(email, verificationCodeExpiresIn);
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: "인증번호 요청 중 오류가 발생했습니다." });
        return;
      }

      // 계정 존재 여부를 노출하지 않기 위해, 가입 이력이 없어도 동일한 안내 화면으로 진행한다.
      if (error.code === PASSWORD_RESET_ERROR_CODE.USER_NOT_FOUND) {
        goToVerifyStep(getValues("email").trim(), DEFAULT_VERIFICATION_CODE_EXPIRES_IN);
        return;
      }

      setError("root", { message: error.message });
    },
  });

  const onSubmit = ({ email }: FindPasswordFormValues) => {
    clearErrors("root");
    requestCodeMutation.mutate({ email: email.trim() });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="이메일" required error={errors.email?.message}>
        <Input {...register("email")} type="text" inputMode="email" placeholder="local@email.com" />
      </FormField>

      {errors.root?.message && <p className="text-[12px] text-red-500">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={requestCodeMutation.isPending}
        className="h-auto w-full rounded-lg py-3.25 text-[14px] font-semibold"
      >
        {requestCodeMutation.isPending ? "전송 중..." : "인증번호 받기"}
      </Button>
    </form>
  );
}
