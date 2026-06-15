"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useBooleanState } from "@/hooks/useBooleanState";

const schema = z.object({
  email: z.email("올바른 이메일 형식을 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { value: showPassword, toggle: togglePassword } = useBooleanState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#5F5B53]">이메일</label>
        <input
          {...register("email")}
          className="rounded-xl border border-[#D9D5CD] px-3.5 py-3 text-[14px] leading-[150%] placeholder:text-[#B8B3AA]"
          type="text"
          inputMode="email"
          placeholder="local@email.com"
        />
        {errors.email && <p className="text-[12px] text-red-500">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#5F5B53]">비밀번호</label>
        <div className="relative">
          <input
            {...register("password")}
            className="w-full rounded-xl border border-[#D9D5CD] px-3.5 py-3 text-[14px] leading-[150%] placeholder:text-[#B8B3AA]"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 입력"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#B8B3AA]"
            onClick={togglePassword}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        className="rounded-xl bg-[#2F6F4F] py-3.5 text-[14px] font-semibold text-white"
      >
        로그인
      </button>
    </form>
  );
}
