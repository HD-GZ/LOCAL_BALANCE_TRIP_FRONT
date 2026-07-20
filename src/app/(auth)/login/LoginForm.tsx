"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { userQueryKeys } from "@/features/user/queries";
import { apiClient } from "@/lib/api/client";
import { isApiError } from "@/lib/api/error";

const schema = z.object({
  email: z.email("올바른 이메일 형식을 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type LoginFormValues = z.infer<typeof schema>;

function loginWithCookie(body: LoginFormValues) {
  return apiClient.post<null, LoginFormValues>("/api/auth/login", { body });
}

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      router.push("/");
    },
    onError: (error) => {
      setError("root", {
        message: isApiError(error) ? error.message : "로그인 중 오류가 발생했습니다.",
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
      <FormField label="이메일" error={errors.email?.message}>
        <Input {...register("email")} type="text" inputMode="email" placeholder="local@email.com" />
      </FormField>
      <FormField label="비밀번호" error={errors.password?.message}>
        <PasswordInput {...register("password")} placeholder="비밀번호 입력" />
      </FormField>
      {errors.root?.message && <p className="text-[12px] text-red-500">{errors.root.message}</p>}
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="h-auto w-full rounded-lg py-3.25 text-[14px] font-semibold"
      >
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
