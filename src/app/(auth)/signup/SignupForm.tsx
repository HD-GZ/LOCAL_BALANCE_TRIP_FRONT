"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const schema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요."),
    email: z.email("올바른 이메일 형식을 입력해 주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 해요.")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "영문·숫자를 포함해 주세요."),
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해 주세요."),
    birthYear: z.string().regex(/^\d{4}$/, "년도 4자리를 입력해 주세요."),
    birthMonth: z.string().min(1, "월을 선택해 주세요."),
    birthDay: z
      .string()
      .regex(/^\d{1,2}$/, "일을 입력해 주세요.")
      .refine((v) => {
        const n = Number(v);
        return n >= 1 && n <= 31;
      }, "올바른 일을 입력해 주세요."),
    gender: z.enum(["남성", "여성", "선택안함"], {
      message: "성별을 선택해 주세요.",
    }),
    agreeService: z.boolean().refine((v) => v, "서비스 이용약관에 동의해 주세요."),
    agreePrivacy: z.boolean().refine((v) => v, "개인정보 수집·이용에 동의해 주세요."),
    agreeMarketing: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof schema>;

export default function SignupForm() {
  const [agreeAll, setAgreeAll] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: undefined,
      agreeService: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  });

  const selectedGender = useWatch({ control, name: "gender" });
  const agreeService = useWatch({ control, name: "agreeService" });
  const agreePrivacy = useWatch({ control, name: "agreePrivacy" });
  const agreeMarketing = useWatch({ control, name: "agreeMarketing" });

  const handleIndividualChange = (
    field: "agreeService" | "agreePrivacy" | "agreeMarketing",
    value: boolean,
  ) => {
    setValue(field, value, { shouldValidate: true });
    const next = {
      agreeService,
      agreePrivacy,
      agreeMarketing,
      [field]: value,
    };
    setAgreeAll(next.agreeService && next.agreePrivacy && next.agreeMarketing);
  };

  const onSubmit = (data: SignupFormValues) => {
    console.warn("signup submit", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="이름" required error={errors.name?.message}>
        <Input {...register("name")} type="text" placeholder="홍길동" />
      </FormField>

      <FormField label="이메일" required error={errors.email?.message}>
        <Input {...register("email")} type="text" inputMode="email" placeholder="local@email.com" />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="비밀번호"
          required
          error={errors.password?.message}
          hint="영문·숫자 포함 8자 이상"
        >
          <PasswordInput {...register("password")} placeholder="영문·숫자 8자 이상" />
        </FormField>

        <FormField label="비밀번호 확인" required error={errors.confirmPassword?.message}>
          <PasswordInput {...register("confirmPassword")} placeholder="다시 입력" />
        </FormField>
      </div>

      <FormField
        label="생년월일"
        required
        error={errors.birthYear?.message ?? errors.birthMonth?.message ?? errors.birthDay?.message}
      >
        <div className="grid grid-cols-[2fr_1.6fr_1.8fr] gap-2">
          <Input
            {...register("birthYear")}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="년 (4자리)"
          />
          <Select
            value={undefined}
            onValueChange={(v) => setValue("birthMonth", v, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-48 min-w-0">
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...register("birthDay")}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="일"
          />
        </div>
      </FormField>

      <FormField label="성별" required error={errors.gender?.message}>
        <div className="grid grid-cols-3 gap-2">
          {(["남성", "여성", "선택안함"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setValue("gender", g, { shouldValidate: true })}
              className={`rounded-lg border py-3 text-[14px] transition-colors ${
                selectedGender === g
                  ? "border-primary bg-primary font-medium text-white"
                  : "border-border text-label"
              }`}
            >
              {g === "선택안함" ? "선택 안 함" : g}
            </button>
          ))}
        </div>
      </FormField>

      <div className="bg-muted flex flex-col gap-2 rounded-[13px] p-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-[9px] bg-white px-3 py-3">
          <Checkbox
            checked={
              agreeAll
                ? true
                : agreeService || agreePrivacy || agreeMarketing
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) => {
              const next = checked === true;
              setAgreeAll(next);
              setValue("agreeService", next, { shouldValidate: true });
              setValue("agreePrivacy", next, { shouldValidate: true });
              setValue("agreeMarketing", next);
            }}
          />
          <span className="text-foreground text-[13.5px] font-semibold">
            약관에 모두 동의합니다
          </span>
        </label>

        <div className="flex flex-col gap-2 px-3">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeService}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeService", checked === true)
              }
            />
            <span className="text-label flex-1 text-[13px]">[필수] 서비스 이용약관 동의</span>
            <ChevronRight size={16} className="text-placeholder shrink-0" />
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreePrivacy}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreePrivacy", checked === true)
              }
            />
            <span className="text-label flex-1 text-[13px]">[필수] 개인정보 수집·이용 동의</span>
            <ChevronRight size={16} className="text-placeholder shrink-0" />
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeMarketing}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeMarketing", checked === true)
              }
            />
            <span className="text-label flex-1 text-[13px]">[선택] 혜택·여행 소식 알림 수신</span>
          </label>
        </div>
      </div>
      {(errors.agreeService || errors.agreePrivacy) && (
        <p className="text-[12px] text-red-500">
          {errors.agreeService?.message ?? errors.agreePrivacy?.message}
        </p>
      )}

      <Button type="submit" className="h-auto w-full rounded-lg py-3.5 text-[14px] font-semibold">
        가입하고 이메일 인증하기
      </Button>
    </form>
  );
}
