"use client";

import { ChevronRight } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { GENDER_OPTIONS, MONTHS, useSignupForm } from "./useSignupForm";

export default function SignupForm() {
  const signupForm = useSignupForm();
  const { emailRegister, errors, handleSubmit, register, setValue } = signupForm.form;
  const { agreeAll, agreeMarketing, agreePrivacy, agreeService } = signupForm.agreements;
  const { selectedBirthMonth, selectedGender } = signupForm.fields;
  const { isCheckingEmail, isSubmitting } = signupForm.status;
  const { handleAgreeAllChange, handleEmailBlur, handleIndividualChange, onSubmit } =
    signupForm.handlers;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="이름" required error={errors.name?.message}>
        <Input {...register("name")} type="text" placeholder="홍길동" />
      </FormField>

      <FormField
        label="이메일"
        required
        error={errors.email?.message}
        hint={isCheckingEmail ? "이메일 중복 확인 중..." : undefined}
      >
        <Input
          {...emailRegister}
          type="text"
          inputMode="email"
          placeholder="local@email.com"
          onBlur={handleEmailBlur}
        />
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
            value={selectedBirthMonth || undefined}
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
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setValue("gender", g, { shouldValidate: true })}
              aria-pressed={selectedGender === g}
              className={cn(
                "press text-body-sm h-11 cursor-pointer rounded-xs border font-semibold",
                selectedGender === g
                  ? "border-brand bg-brand-wash text-brand-ink"
                  : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink",
              )}
            >
              {g === "선택안함" ? "선택 안 함" : g}
            </button>
          ))}
        </div>
      </FormField>

      <div className="border-line bg-surface-2 flex flex-col gap-3 rounded-sm border p-3">
        <label className="border-line bg-surface flex cursor-pointer items-center gap-3 rounded-xs border px-3 py-3">
          <Checkbox
            checked={
              agreeAll
                ? true
                : agreeService || agreePrivacy || agreeMarketing
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) => {
              handleAgreeAllChange(checked === true);
            }}
          />
          <span className="text-ink text-body-sm font-semibold">약관에 모두 동의합니다</span>
        </label>

        <div className="flex flex-col gap-2 px-3">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeService}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeService", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">[필수] 서비스 이용약관 동의</span>
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="text-ink-3 shrink-0"
              aria-hidden
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreePrivacy}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreePrivacy", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">[필수] 개인정보 수집·이용 동의</span>
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="text-ink-3 shrink-0"
              aria-hidden
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeMarketing}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeMarketing", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">[선택] 혜택·여행 소식 알림 수신</span>
          </label>
        </div>
      </div>
      {(errors.agreeService || errors.agreePrivacy) && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.agreeService?.message ?? errors.agreePrivacy?.message}
        </p>
      )}

      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} size="lg" className="mt-2 w-full">
        {isSubmitting ? "가입 처리 중..." : "가입하고 이메일 인증하기"}
      </Button>
    </form>
  );
}
