"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const schema = z.object({
  email: z.email("올바른 이메일 형식을 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.warn("login submit", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="이메일" error={errors.email?.message}>
        <Input {...register("email")} type="text" inputMode="email" placeholder="local@email.com" />
      </FormField>
      <FormField label="비밀번호" error={errors.password?.message}>
        <PasswordInput {...register("password")} placeholder="비밀번호 입력" />
      </FormField>
      <Button type="submit" className="h-auto w-full rounded-lg py-3.25 text-[14px] font-semibold">
        로그인
      </Button>
    </form>
  );
}
