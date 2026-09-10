"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/features/auth/api";
import { isResetTokenInvalidCode } from "@/features/auth/passwordReset";
import { clearPasswordResetSession } from "@/features/auth/passwordResetStorage";
import { useRouter } from "@/i18n/navigation";
import { getApiErrorMessage, getFieldErrors, isApiError } from "@/lib/api/error";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordFormProps = {
  resetToken: string;
};

export default function ResetPasswordForm({ resetToken }: ResetPasswordFormProps) {
  const t = useTranslations();
  const tApiError = useTranslations("apiError");
  const router = useRouter();

  const schema = z
    .object({
      newPassword: z
        .string()
        .min(8, t("validation.passwordMinLength"))
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, t("validation.passwordPattern")),
      confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

  const {
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

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      clearPasswordResetSession();
      router.replace("/find-password/complete");
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: t("findPassword.reset.errorGeneric") });
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
        message: fieldError ? fieldError.message : getApiErrorMessage(error, tApiError),
      });
    },
  });

  const onSubmit = ({ newPassword: password }: ResetPasswordFormValues) => {
    clearErrors("root");
    resetPasswordMutation.mutate({ resetToken, newPassword: password });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label={t("findPassword.reset.newPasswordLabel")}
        required
        error={errors.newPassword?.message}
        hint={t("findPassword.reset.passwordHint")}
      >
        <PasswordInput
          {...register("newPassword")}
          autoComplete="new-password"
          placeholder={t("findPassword.reset.newPasswordPlaceholder")}
        />
      </FormField>

      <FormField
        label={t("findPassword.reset.confirmPasswordLabel")}
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          placeholder={t("findPassword.reset.confirmPasswordPlaceholder")}
        />
      </FormField>

      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        size="lg"
        className="mt-2 w-full"
      >
        {resetPasswordMutation.isPending
          ? t("findPassword.reset.submitting")
          : t("findPassword.reset.submit")}
      </Button>
    </form>
  );
}
