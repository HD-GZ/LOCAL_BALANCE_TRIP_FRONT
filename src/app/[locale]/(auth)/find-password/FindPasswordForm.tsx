"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { requestPasswordResetCode } from "@/features/auth/api";
import { savePasswordResetCodeRequest } from "@/features/auth/passwordResetStorage";
import { useRouter } from "@/i18n/navigation";
import { getApiErrorMessage, isApiError } from "@/lib/api/error";

type FindPasswordFormValues = {
  email: string;
};

export default function FindPasswordForm() {
  const t = useTranslations();
  const tApiError = useTranslations("apiError");
  const router = useRouter();
  const schema = z.object({ email: z.email(t("validation.emailInvalid")) });
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
        message: isApiError(error)
          ? getApiErrorMessage(error, tApiError)
          : t("findPassword.errors.generic"),
      });
    },
  });

  const onSubmit = ({ email }: FindPasswordFormValues) => {
    clearErrors("root");
    requestCodeMutation.mutate({ email: email.trim() });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label={t("findPassword.form.emailLabel")} required error={errors.email?.message}>
        <Input
          {...register("email")}
          type="text"
          inputMode="email"
          placeholder={t("findPassword.form.emailPlaceholder")}
        />
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
        {requestCodeMutation.isPending
          ? t("findPassword.form.submitting")
          : t("findPassword.form.submit")}
      </Button>
    </form>
  );
}
