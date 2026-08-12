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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const requestCodeMutation = useMutation({
    mutationFn: requestPasswordResetCode,
    // 가입 이력이 없는 이메일도 BFF가 동일한 성공 응답으로 정규화하므로 여기서 따로 분기하지 않는다.
    onSuccess: ({ verificationCodeExpiresIn }, { email }) => {
      savePasswordResetCodeRequest({ email, verificationCodeExpiresIn });
      router.push("/find-password/verify");
    },
    onError: (error) => {
      setError("root", {
        message: isApiError(error) ? error.message : "인증번호 요청 중 오류가 발생했습니다.",
      });
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

      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={requestCodeMutation.isPending}
        size="lg"
        className="mt-2 w-full"
      >
        {requestCodeMutation.isPending ? "전송 중..." : "인증번호 받기"}
      </Button>
    </form>
  );
}
