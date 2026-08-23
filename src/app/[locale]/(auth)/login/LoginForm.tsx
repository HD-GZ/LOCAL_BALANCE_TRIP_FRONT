"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { homeQueryKeys } from "@/features/home/queries";
import { userQueryKeys } from "@/features/user/queries";
import { useRouter } from "@/i18n/navigation";
import { apiClient } from "@/lib/api/client";
import { isApiError } from "@/lib/api/error";

type LoginFormValues = {
  email: string;
  password: string;
};

function loginWithCookie(body: LoginFormValues) {
  return apiClient.post<null, LoginFormValues>("/api/auth/login", { body });
}

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const schema = z.object({
    email: z.email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginWithCookie,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: homeQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      router.push("/");
    },
    onError: (error) => {
      setError("root", {
        message: isApiError(error) ? error.message : t("login.errorGeneric"),
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    clearErrors("root");
    loginMutation.mutate({
      email: data.email.trim(),
      password: data.password,
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label={t("login.emailLabel")} error={errors.email?.message}>
        <Input
          {...register("email")}
          type="text"
          inputMode="email"
          placeholder={t("login.emailPlaceholder")}
        />
      </FormField>
      <FormField label={t("login.passwordLabel")} error={errors.password?.message}>
        <PasswordInput {...register("password")} placeholder={t("login.passwordPlaceholder")} />
      </FormField>
      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={loginMutation.isPending} size="lg" className="mt-2 w-full">
        {loginMutation.isPending ? t("login.submitting") : t("login.submit")}
      </Button>
    </form>
  );
}
